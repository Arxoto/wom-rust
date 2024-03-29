/// 常用的函数集合、platform平台兼容层抽象（tauri中invoke的方法）

import { writeText } from '@tauri-apps/api/clipboard';
import { ask } from '@tauri-apps/api/dialog';
import { Options, isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/shell';
import { WebviewWindow, appWindow } from '@tauri-apps/api/window';
import { isRegistered, register, unregister } from '@tauri-apps/api/globalShortcut';
import { ItemCommon, ItemExtend } from './womItem';
import { actions } from './womExecuter';
import { appDataDir } from '@tauri-apps/api/path';

// ========= API =========

// 确认
const ensure = async (message: string) => await ask(message);

// 系统消息
const notify = async (options: Options | string): Promise<void> => {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
    }
    if (permissionGranted) {
        sendNotification(options);
    } else {
        console.error("no Granted Notification Permission");
    }
}

// 剪贴板
const clipboardWriteText = (s: string) => writeText(s);

const clipboardWriteTextNotify = (s: string) => {
    clipboardWriteText(s).catch(e => {
        console.error(e);
        notify(`cpoy ${s} failed`);
    });
}

// 打开配置路径
const openConfigPath = async () => open(await appDataDir());

// 打开资源  两个打开的进程貌似都会挂在本进程下面
const shellOpen = (s: string) => open(s);
// const shellOpen = async (s: string) => invoke("shell_execute", { file: s });

// ========= invoker =========

// 选中资源
const shellSelect = (s: string) => {
    return invoke("open_folder_and_select_items", { path: s }) as Promise<void>;
};

const shutdown_power: (s: string) => void = (s: string) => invoke("shutdown_power", { action: s });

const calc: (s: string) => Promise<string> = (s: string) => invoke("calc", { expr: s });


// ========= config =========

interface ValueRuler<T> {
    the_default: T,
    the_options?: T[],
}

interface ConfigRuler {
    global_shortcut: ValueRuler<string>,
    window_width: ValueRuler<number>,
    window_height: ValueRuler<number>,
}

interface ConfigCurrent {
    global_shortcut: string,
    window_width: number,
    window_height: number,
}

const configRuler = (): Promise<ConfigRuler> => invoke('config_ruler');
const configCurrent = (): Promise<ConfigCurrent> => invoke('config_current');

// ========= item search =========

interface FindedItems<T> {
    eq: T[],
    sw: T[],
    ct: T[],
    mc: T[],
}

const convertItem = (items: ItemCommon[]): ItemExtend[] => items.map(item => ({
    ...item.the_base,
    ...item,
    action_list: actions(item.the_base.the_type),
    action_index: 0,
}))

const searchItem = async (keyword: string, hasArgs: boolean): Promise<FindedItems<ItemExtend>> => {
    let items: FindedItems<ItemCommon> = await invoke('search_item', { keyword, hasArgs });
    return {
        eq: convertItem(items.eq),
        sw: convertItem(items.sw),
        ct: convertItem(items.ct),
        mc: convertItem(items.mc),
    }
}

// ========= event =========

const listenEvents = (...listeners: [string, () => void][]) => {
    const unlistens = listeners.map(listener => appWindow.listen(listener[0], listener[1]));

    return () => {
        unlistens.forEach(unlisten => {
            unlisten.then(fn => fn()).catch(console.error);
        });
    }
}

const windowVisibelSwitch = async () => {
    if (await appWindow.isVisible()) {
        appWindow.hide();
    } else {
        await appWindow.show();
        appWindow.setFocus();
    }
}

const registerSwitchDoAndUn = (global_shortcut_key: string) => {
    return [
        async () => {
            if (await isRegistered(global_shortcut_key)) {
                return;
            }
            register(global_shortcut_key, windowVisibelSwitch)
                .then(() => console.log("doregister"))
                .catch(console.error)
        },
        () => unregister(global_shortcut_key)
            .then(() => console.log("unregister"))
            .catch(console.error),
    ]
}

// ========= window =========

// interface UrlQuery {
//     goto?: string,
// }

// const withQuery = (url: string, query: UrlQuery) => {
//     let hasQuery = false;
//     let ll = [];
//     let object = query as any;
//     for (const key in object) {
//         if (Object.prototype.hasOwnProperty.call(object, key)) {
//             const element = object[key] as string;
//             hasQuery = true;
//             ll.push(`${key}=${encodeURIComponent(element)}`)
//         }
//     }
//     if (hasQuery) {
//         url += '?' + ll.join("&")
//     }
//     return url
// }

// const parseQuery = (url: string) => {
//     let query: any = {};
//     let i = url.indexOf('?');
//     let search: string;
//     if (i != -1) {
//         search = url.substring(i + 1);
//         let ll = search.split("&");
//         for (const element of ll) {
//             let [k, v] = element.split("=", 2)
//             query[k] = decodeURIComponent(v);
//         }
//     }
//     return query as UrlQuery;
// }

/**
 * 目前有个难点
 * 
 * 1、选择 query=url + iframe 的方式 会导致子文档无法使用 __TAURI__ 方法
 * 也许跟这个有关 https://github.com/tauri-apps/tauri/issues/6204
 * 但是不完全一致，没深究，明明其他人说是能在 iframe 里用的，嘤嘤嘤
 * 
 * 2、选择 file://asset 需要自己实现窗口框架且打开 dangerousRemoteDomainIpcAccess 但是该选项只能以白名单的方式开启 不支持通配符
 * see https://github.com/tauri-apps/tauri/issues/7461
 * 新方案在 V2 合入了 https://github.com/tauri-apps/tauri/pull/8428
 * 因此拒绝了 V1 的合并请求 https://github.com/tauri-apps/tauri/pull/7468
 * 导致这里不是很优雅，哼！
 */
const exWebView = async (title: string, url: string) => {
    // const label = crypto.randomUUID();
    const lb = "plugins";
    for (let i = 0; i < 10; i++) {
        const label = `${lb}${i}`;
        let webview = WebviewWindow.getByLabel(label);
        if (webview) {
            continue;
        }
        invoke('build_a_window', { label, url, title }).catch(console.error)
        return;
    }
    console.error('failed to build a new window');
}

// 创建页面
const pageWebView = async (pathId: string) => {
    const label = 'tmp';  // todo 根据 pathId 选择不同 label
    let webview = WebviewWindow.getByLabel(label);
    if (webview) {
        await webview.close();
    }

    new WebviewWindow(label, {
        url: `/${pathId}`,
        title: pathId,
        decorations: false,
        transparent: true,
        center: true,
        visible: false,
    });
}

const isMain = () => appWindow.label === "main";
const currentHide = () => appWindow.hide();
const currentShow = () => appWindow.show().then(() => appWindow.setFocus());
const currentMini = () => appWindow.minimize();
const currentClose = () => appWindow.close();
const currentOnTop = (ontop: boolean) => appWindow.setAlwaysOnTop(ontop);


// ========= platform-independent =========

// 关于遍历的最佳实践
// for-i    命令式编程 性能最佳 可读性不高
// for-in   遍历对象的属性 而非遍历集合 性能极差 一般不推荐使用
// for-of   遍历集合 相较于for-each的优点：性能较优、支持 continue/break
// for-each 函数式编程 遍历全部集合 可读性高
// map      函数式编程 映射 非遍历用途 与 filter reduce 等方法组合使用 （其实不应该放在这里 但很多人会拿过来一起比较）
// 结论：一般推荐for-each有较高可读性且性能尚可 需要continue/break的场景使用for-of语句 复杂场景使用for-i

/**
 * 防抖 执行最后一次
 * @param delay 对应的时延
 * @param fn 应执行的方法
 * @returns 包装后的方法
 */
const debounce = (delay: number, fn: Function) => {
    let timerId: number | undefined = undefined;
    return (...args: any) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn(...args);
            timerId = undefined;
        }, delay);
    }
};

/**
 * 节流 执行第一次
 * @param delay 对应的时延
 * @param fn 应执行的方法
 * @returns 包装后的方法
 */
const throttle = (delay: number, fn: Function) => {
    let cd = false;
    return (...args: any) => {
        if (cd) { return; }
        cd = true;
        fn(...args);
        setTimeout(() => {
            cd = false;
        }, delay);
    }
};

export {
    ensure,
    notify,
    clipboardWriteText, clipboardWriteTextNotify,
    openConfigPath, shellOpen, shellSelect, shutdown_power, calc,
    configRuler, configCurrent, searchItem,
    listenEvents, registerSwitchDoAndUn,
    exWebView, pageWebView, isMain,
    currentHide, currentShow,
    currentMini, currentClose, currentOnTop,
    debounce, throttle
};
export type { FindedItems, ConfigCurrent };

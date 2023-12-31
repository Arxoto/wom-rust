/// 常用的函数集合、platform平台兼容层抽象（tauri中invoke的方法）

import { writeText } from '@tauri-apps/api/clipboard';
import { ask } from '@tauri-apps/api/dialog';
import { listen } from '@tauri-apps/api/event';
import { Options, isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { appCacheDir, appConfigDir, appDataDir, appLocalDataDir, appLogDir, audioDir, cacheDir, configDir, dataDir, desktopDir, documentDir, downloadDir, executableDir, fontDir, homeDir, join, localDataDir, pictureDir, publicDir, resolve, resourceDir, runtimeDir, sep, templateDir, videoDir } from '@tauri-apps/api/path';
import { FileEntry, exists, readDir } from '@tauri-apps/api/fs';
import { invoke } from '@tauri-apps/api/tauri';
import { WebviewWindow, getCurrent } from '@tauri-apps/api/window';
import { open } from '@tauri-apps/api/shell';

// 剪贴板
const clipboardWriteText = (s: string) => writeText(s);

const clipboardWriteTextNotify = (s: string) => {
    clipboardWriteText(s).catch(e => {
        console.error(e);
        notify(`cpoy ${s} failed`);
    });
}

// 用户确认
const ensure = async (message: string) => await ask(message);

// 事件
const listenEvents = (...listeners: [string, () => void][]) => {
    const unlistens = listeners.map(listener => listen(listener[0], listener[1]));

    return () => {
        unlistens.forEach(unlisten => {
            unlisten.then(fn => fn()).catch(console.error);
        });
    }
}

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

// 允许的特殊路径/环境变量的路径
const allowedFormatPath = [
    // 公共目录
    'publicDir',
    // 用户目录
    'homeDir',
    'desktopDir',
    'downloadDir',
    'documentDir',
    'pictureDir',
    'videoDir',
    'audioDir',
    'templateDir',  // office模板
    // 临时目录
    'cacheDir',
    'localDataDir',
    'appCacheDir',
    'appLocalDataDir',
    // 数据目录
    'dataDir',
    'configDir',
    'appDataDir',
    'appConfigDir',
    // 日志
    'appLogDir',
];

/**
 * 特殊路径转换
 * @param uri 包含特定目录标识的相对路径，格式：{特定目录}:{相对路径}
 * @returns 真正的路径
 */
async function formatPath(uri: string) {
    let [root, ps] = uri.split(':', 2);
    ps = ps || '';
    let pp: string;
    switch (root) {
        case 'appCacheDir': pp = await appCacheDir(); break;
        case 'appConfigDir': pp = await appConfigDir(); break;
        case 'appDataDir': pp = await appDataDir(); break;
        case 'appLocalDataDir': pp = await appLocalDataDir(); break;
        case 'appLogDir': pp = await appLogDir(); break;
        case 'audioDir': pp = await audioDir(); break;
        case 'cacheDir': pp = await cacheDir(); break;
        case 'configDir': pp = await configDir(); break;
        case 'dataDir': pp = await dataDir(); break;
        case 'desktopDir': pp = await desktopDir(); break;
        case 'documentDir': pp = await documentDir(); break;
        case 'downloadDir': pp = await downloadDir(); break;
        case 'executableDir': pp = await executableDir(); break;
        case 'fontDir': pp = await fontDir(); break;
        case 'homeDir': pp = await homeDir(); break;
        case 'localDataDir': pp = await localDataDir(); break;
        case 'pictureDir': pp = await pictureDir(); break;
        case 'publicDir': pp = await publicDir(); break;
        case 'resourceDir': pp = await resourceDir(); break;
        case 'runtimeDir': pp = await runtimeDir(); break;
        case 'templateDir': pp = await templateDir(); break;
        case 'videoDir': pp = await videoDir(); break;
        default:
            return uri;
    }
    return await resolve(await join(pp, ps));
}

const basename = (filePath: string) => {
    let paths = filePath.split(sep);
    for (let i = paths.length - 1; i >= 0; i--) {
        const fp = paths[i];
        if (fp) {
            return fp;
        }
    }
    return '';
}

// const extname = (fileName: string) => {
//     let fns = fileName.split('.');
//     if (fns.length <= 1) return ''; // 无扩展后缀的文件
//     return fns[fns.length - 1];
// }

/**
 * 
 * @param desc 过滤的文件扩展名 用','分割
 * @param uri 包含特定目录标识的相对路径，格式：{特定目录}:{相对路径}
 * @returns [fileName, filePath][]
 */
async function listFiles(desc: string, uri: string): Promise<[string, string][]> {
    let folderPath = await formatPath(uri);
    if (! await exists(folderPath)) {
        return [];
    }

    const result: [string, string][] = [];
    const processEntries = async (entries: FileEntry[]) => {
        for (const entry of entries) {
            if (entry.children) {
                await processEntries(entry.children);
                continue;
            }
            let fpath = entry.path;
            let fname = basename(fpath);
            if (new RegExp(desc).test(fname)) {
                result.push([fname, fpath]);
            }
        }
    }

    await processEntries(await readDir(folderPath, { recursive: true }));
    return result;
}

// 打开资源 两个打开的进程貌似都会挂在本进程下面
const shellOpen = (s: string) => open(s);
// const shellOpen = async (s: string) => invoke("shell_execute", { file: s });

// 选中资源
const shellSelect = (s: string) => {
    invoke("open_folder_and_select_items", { path: s });
};

const calc: (s: string) => Promise<string> = (s: string) => invoke("calc", { expr: s });

const shutdown_power: (s: string) => void = (s: string) => invoke("shutdown_power", { action: s });

// 主窗口隐藏
const mainWindowHide = () => {
    WebviewWindow.getByLabel('main')?.hide();
}

// 创建临时窗口
const pageWebView = (title: string, url: string) => {
    let webview = WebviewWindow.getByLabel(title);
    if (webview) {
        webview.show().then(() => webview?.setFocus());
        return;
    }

    new WebviewWindow(title, {
        url,
        title,
        center: true,
        decorations: false,
        transparent: true,
    });
}

const currentLabel = () => getCurrent().label;
const isMain = () => currentLabel() === 'main';
const currentWindowClose = () => getCurrent().close();
const currentWindowTop = (ontop: boolean) => getCurrent().setAlwaysOnTop(ontop);

// ========= platform-independent =========

// 关于遍历的最佳实践
// for-i    命令式编程 性能最佳 可读性不高
// for-in   遍历对象的属性 而非遍历集合 性能极差 一般不推荐使用
// for-of   遍历集合 相较于for-each的优点：性能较优、支持 continue/break
// for-each 函数式编程 遍历全部集合 可读性高
// map      函数式编程 映射 非遍历用途 与 filter reduce 等方法组合使用 （其实不应该放在这里 但很多人会拿过来一起比较）
// 结论：一般推荐for-each有较高可读性且性能尚可 需要continue/break的场景使用for-of语句 复杂场景使用for-i

const whenfocus = (fn: (() => void) | null) => {
    document.body.onfocus = fn;
};

const whenkeydown = (onkeydown: ((event: KeyboardEvent) => void) | null) => {
    window.onkeydown = onkeydown;
};

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
    clipboardWriteText, clipboardWriteTextNotify,
    ensure,
    listenEvents,
    notify,
    formatPath, allowedFormatPath, listFiles,
    shellOpen, shellSelect,
    calc, shutdown_power,
    mainWindowHide, pageWebView, currentLabel, isMain, currentWindowClose, currentWindowTop,
    whenfocus, whenkeydown,
    debounce, throttle
}
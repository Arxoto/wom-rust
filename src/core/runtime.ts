/// 常用的函数集合、platform平台兼容层抽象（tauri中invoke的方法）

import { writeText } from '@tauri-apps/api/clipboard';
import { ask } from '@tauri-apps/api/dialog';
import { Options, isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/shell';
import { appWindow, getCurrent } from '@tauri-apps/api/window';
import { isRegistered, register, unregister } from '@tauri-apps/api/globalShortcut';

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

// 打开资源  两个打开的进程貌似都会挂在本进程下面
const shellOpen = (s: string) => open(s);
// const shellOpen = async (s: string) => invoke("shell_execute", { file: s });

// 选中资源
const shellSelect = (s: string) => {
    invoke("open_folder_and_select_items", { path: s });
};

const calc: (s: string) => Promise<string> = (s: string) => invoke("calc", { expr: s });

const shutdown_power: (s: string) => void = (s: string) => invoke("shutdown_power", { action: s });

// ========= window =========

// 事件
const listenEvents = (...listeners: [string, () => void][]) => {
    const unlistens = listeners.map(listener => appWindow.listen(listener[0], listener[1]));

    return () => {
        unlistens.forEach(unlisten => {
            unlisten.then(fn => fn()).catch(console.error);
        });
    }
}

const windowVisibelSwitch = async () => {
    const w = getCurrent();
    if (await w.isVisible()) {
        w.hide();
    } else {
        await w.show();
        w.setFocus();
    }
}

const registerSwitchDoAndUn = (global_shortcut_key: string) => {
    return [
        async () => {
            if (await isRegistered(global_shortcut_key)) {
                return;
            }
            await register(global_shortcut_key, windowVisibelSwitch);
            console.log("register")
        },
        () => unregister(global_shortcut_key).catch(console.error),
    ]
}


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
    shellOpen, shellSelect,
    calc, shutdown_power,
    listenEvents, registerSwitchDoAndUn,
    debounce, throttle
}
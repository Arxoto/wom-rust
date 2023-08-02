import { Options, isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';

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

const whenfocus = (fn: (() => void) | null) => {
    document.body.onfocus = fn;
};

const whenkeydown = (onkeydown: ((event: KeyboardEvent) => void) | null) => {
    window.onkeydown = onkeydown;
};

// 防抖 执行最后一次
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

// 节流 执行第一次
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
    notify,
    whenfocus, whenkeydown,
    debounce, throttle
}
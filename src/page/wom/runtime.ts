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
    whenfocus, whenkeydown,
    debounce, throttle
}
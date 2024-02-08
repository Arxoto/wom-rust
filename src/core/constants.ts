const router = {
    root: 'root',
    navigation: 'navigation',
    setting: 'setting',
    config: 'config',
}

const inputer = {
    split: '___',
    args: '{}',
    doSearch_debounce: 100,  // wom-input 内容改变 搜索匹配项的延迟
    selectItem_throttle: 50, // 键盘控制选中 item 的延迟  注意双方的大小 这里由于渲染的速度一般自带延迟且小于匹配延迟
}

export {
    router, inputer
};
export default {
    globalShortcutKey: 'Shift+Space', // 注册时有报错 怀疑是强制覆盖了全局快捷键导致 Alt
    router_navigation: '/navigation',
    wom_input_placeholder: '',
    wom_tag_hide: '_',
    wom_tag_default: '',
    wom_tag_loading: '•••',
    wom_tag_notfound: 'N/A',
    doSearch_debounce: 100,  // wom-input 内容改变 搜索匹配项的延迟
    selectItem_throttle: 50, // 键盘控制选中 item 的延迟  注意双方的大小 这里由于渲染的速度一般自带延迟且小于匹配延迟
    cmd_terminal: 'cmd',
    input_replace: '{}',
}

const constants = {
    db_name: 'sqlite:wom.db',

    router_navigation_path: '/navigation',
    router_navigation_name: 'navigation',
    router_setting_path: '/navigation/setting',
    router_setting_name: 'setting',

    wom_input_placeholder: '',
    wom_tag_hide: '_',
    wom_tag_default: '',
    wom_tag_loading: '•••',
    wom_tag_notfound: 'N/A',
    doSearch_debounce: 100,  // wom-input 内容改变 搜索匹配项的延迟
    selectItem_throttle: 50, // 键盘控制选中 item 的延迟  注意双方的大小 这里由于渲染的速度一般自带延迟且小于匹配延迟
    plugin_calc_detail: 'support: int float + - * / % ^ ()',
    setting_add_placeholder: '{type}|{title}|{detail}\ncmd|name|cmd_args_replace_with_{}\nweb|name|url_single_arg_replace_with_{}\napp|name|magic_path => absolute_path or {path_tag_in_tips}:relative_path\nfolder|name|magic_path\nfile|RegExp|magic_path',
}

const variables = {
    global_shortcut_key: 'Alt+Space', // 注册时有报错 怀疑是强制覆盖了全局快捷键导致 Alt
    cmd_terminal: 'cmd',
    input_replace: '{}',
}

const routerPath = (routerName: string) => {
    switch (routerName) {
        case constants.router_navigation_name:
            return constants.router_navigation_path;
        case constants.router_setting_name:
            return constants.router_setting_path;
        default:
            return '/';
    }
}

export {
    constants,
    variables,
    routerPath,
};

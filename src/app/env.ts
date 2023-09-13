const constants = {
    db_name: 'sqlite:wom.db',
    app_loading_delay: 500,

    wom_input_placeholder: '',
    wom_tag_default: '',
    wom_tag_notfound: 'N/A',
    wom_tag_showindex: '_',
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

const router = {
    navigation_name: 'navigation',
    navigation_path: '/navigation',
    setting_name: 'setting',
    setting_path: '/navigation/setting',
}

const routerMap = new Map([
    [router.navigation_name, router.navigation_path],
    [router.setting_name, router.setting_path],
]);

const routerPath = (routerName: string) => routerMap.get(routerName) || '/';

export {
    constants,
    variables,
    router,
    routerPath,
};

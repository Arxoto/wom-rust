/// 定义Item类型

enum ItemType {
    Plugin = "plugin",  // 内置工具
    Page = "page",      // 独立页面
    Cmd = "cmd",        // 命令行
    Web = "web",        // 网页
    App = "app",        // 应用
    Folder = "folder",  // 文件夹
    Files = "files",    // 文件 扫描文件夹下的文件
}

interface ItemBase {
    the_type: string,
    title: string,
    detail: string,
}

interface ItemCommon {
    the_base: ItemBase,
    the_key: string,
    with_args: boolean,
}

interface ItemExtend {
    the_type: string,
    title: string,
    detail: string,
    the_key: string,
    with_args: boolean,
    action_list: string[],
    action_index: number,
    trigger?: (action: string, arg: string) => void,
}

export { ItemType };
export type { ItemBase, ItemCommon, ItemExtend };

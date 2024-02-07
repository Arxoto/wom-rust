enum ItemType {
    Page = "page",      // 独立页面
    Plugin = "plugin",  // 内置工具
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
}

const a4oc = ['open', 'copy'];
const a4osc = ['open', 'select', 'copy'];
const a4empty: string[] = [''];

/**
 * 根据特定类型获取其固定的动作
 */
const actions = (the_type: string) => {
    switch (the_type) {
        case ItemType.Folder:
            return a4oc;
        case ItemType.Files:
        case ItemType.App:
            return a4osc;
        default:
            return a4empty;
    }
}

export {
    ItemType, actions
};
export type { ItemBase, ItemCommon, ItemExtend };

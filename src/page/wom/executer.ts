// web file no args
import { open } from '@tauri-apps/api/shell';

enum ItemType {
    Plugin = "plugin",      // 内置工具
    Setting = "setting",    // 设置
    Cmd = "cmd",            // 命令行
    Web = "web",            // 网页
    Folder = "folder",      // 文件夹
    Application = "app",    // 应用
}

interface ItemDescriptor {
    theType: ItemType | string,
    title: string,
    detail: string,
    actions: string[],
    trigger?: (action: string, params: string[] | null) => void,
}

function triggerItem(item: ItemDescriptor, actionIndex: number, args: string) {
    console.log(item.theType, item.title, item.detail, item.actions[actionIndex]);
}

export { ItemType, triggerItem };
export type { ItemDescriptor };

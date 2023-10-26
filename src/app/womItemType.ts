enum ItemType {
    Page = "page",   // 独立页面
    Plugin = "plugin",      // 内置工具
    Cmd = "cmd",            // 命令行
    Web = "web",            // 网页
    Application = "app",    // 应用
    Folder = "folder",      // 文件夹
    File = "file",          // 文件 扫描文件夹下的文件
}

/**
 * ItemType 详细信息 带有优先级顺序
 */
interface ItemTypeInfo {
    type: ItemType | string,
    numb: number,
}

const ItemTypePlugin: ItemTypeInfo = {
    type: ItemType.Plugin,
    numb: 1
};

const ItemTypePage: ItemTypeInfo = {
    type: ItemType.Page,
    numb: 2
};

const ItemTypeCmd: ItemTypeInfo = {
    type: ItemType.Cmd,
    numb: 3
};

const ItemTypeWeb: ItemTypeInfo = {
    type: ItemType.Web,
    numb: 4
};

const ItemTypeApplication: ItemTypeInfo = {
    type: ItemType.Application,
    numb: 5
};

const ItemTypeFolder: ItemTypeInfo = {
    type: ItemType.Folder,
    numb: 6
};

const ItemTypeFile: ItemTypeInfo = {
    type: ItemType.File,
    numb: 7
};

/**
 * 根据 ItemType 获取详细信息
 */
function getItemTypeId(itemType: string): ItemTypeInfo {
    switch (itemType) {
        case ItemType.Plugin:
            return ItemTypePlugin;
        case ItemType.Page:
            return ItemTypePage;
        case ItemType.Cmd:
            return ItemTypeCmd;
        case ItemType.Web:
            return ItemTypeWeb;
        case ItemType.Application:
            return ItemTypeApplication;
        case ItemType.Folder:
            return ItemTypeFolder;
        case ItemType.File:
            return ItemTypeFile;
        default:
            return { type: itemType, numb: 0 };
    }
}

/**
 * DB 中存放的类型
 */
const dbAallowedTypes: string[] = [ItemType.Cmd, ItemType.Web, ItemType.Application, ItemType.Folder, ItemType.File];

export { ItemType, getItemTypeId, dbAallowedTypes };
export type { ItemTypeInfo };

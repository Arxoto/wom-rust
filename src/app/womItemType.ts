function getItemTypeId(itemType: string): ItemTypeInfo {
    switch (itemType) {
        case ItemType.Plugin:
            return ItemTypePlugin;
        case ItemType.Setting:
            return ItemTypeSetting;
        case ItemType.Cmd:
            return ItemTypeCmd;
        case ItemType.Web:
            return ItemTypeWeb;
        case ItemType.Folder:
            return ItemTypeFolder;
        case ItemType.Application:
            return ItemTypeApplication;
        default:
            return { type: itemType, numb: 0 };
    }
}

interface ItemTypeInfo {
    type: ItemType | string,
    numb: number,
}

enum ItemType {
    Plugin = "plugin",      // 内置工具
    Setting = "setting",    // 设置
    Cmd = "cmd",            // 命令行
    Web = "web",            // 网页
    Folder = "folder",      // 文件夹
    Application = "app",    // 应用
}

const ItemTypePlugin: ItemTypeInfo = {
    type: ItemType.Plugin,
    numb: 1
};

const ItemTypeSetting: ItemTypeInfo = {
    type: ItemType.Setting,
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

const ItemTypeFolder: ItemTypeInfo = {
    type: ItemType.Folder,
    numb: 5
};

const ItemTypeApplication: ItemTypeInfo = {
    type: ItemType.Application,
    numb: 6
};

export { ItemType, getItemTypeId };
export type { ItemTypeInfo };

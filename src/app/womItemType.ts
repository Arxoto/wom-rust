function getItemTypeId(itemType: string): ItemTypeInfo {
    switch (itemType) {
        case ItemType.Plugin:
            return ItemTypePlugin;
        case ItemType.Navi:
            return ItemTypeNavi;
        case ItemType.Setting:
            return ItemTypeSetting;
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

interface ItemTypeInfo {
    type: ItemType | string,
    numb: number,
}

enum ItemType {
    Navi = "page:navigation",   // 导航页
    Setting = "page:setting",   // 设置页
    Plugin = "plugin",      // 内置工具
    Cmd = "cmd",            // 命令行
    Web = "web",            // 网页
    Application = "app",    // 应用
    Folder = "folder",      // 文件夹
    File = "file",          // 文件 扫描文件夹下的文件
}

const itemTypeIsPage = (theType: string) => theType.startsWith('page:');

const ItemTypePlugin: ItemTypeInfo = {
    type: ItemType.Plugin,
    numb: 1
};

const ItemTypeNavi: ItemTypeInfo = {
    type: ItemType.Navi,
    numb: 2
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

export { ItemType, getItemTypeId, itemTypeIsPage };
export type { ItemTypeInfo };

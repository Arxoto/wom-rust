interface ItemDescriptor {
    iconPath: string,
    title: string,
    detail: string,
    actions: string[],
}

interface ItemObject {
    theType: ItemType | string,
    theKey: string,
    title: string,
    detail: string,
    actions: string[],
    trigger: (action: string | null, params: string[] | null) => void,
}

enum ItemType {
    Tool,    // 内置选项
    Cmd,     // 命令行
    Web,     // 网页
    App,     // 应用
    Folder,  // 文件夹
}

function ItemObjectConvertDescriptor(item: ItemObject): ItemDescriptor {
    // todo
    return {
        iconPath: '',
        title: '',
        detail: 'string',
        actions: [],
    }
}

interface ItemElement {
    item: ItemObject
}

function Item({ item }: ItemElement) {

}
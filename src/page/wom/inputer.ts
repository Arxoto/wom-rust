import { ItemDescriptor, ItemType } from "./executer";

const testItems: ItemDescriptor[] = [
    {
        theType: ItemType.Plugin,
        title: 'plugin',
        detail: '',
        actions: ['aaa', 'sss', 'ddd']
    },
    {
        theType: ItemType.Plugin,
        title: 'plugin',
        detail: '',
        actions: ['aaa', 'sss', 'ddd']
    },
    {
        theType: ItemType.Setting,
        title: 'UserSetting',
        detail: 'detail',
        actions: ['aaa', '阿木木', '阿松大']
    },
    {
        theType: ItemType.Cmd,
        title: 'cmd',
        detail: 'detail',
        actions: ['aaa', '阿木木', '阿松大']
    },
    {
        theType: ItemType.Cmd,
        title: 'cmd',
        detail: 'detail',
        actions: []
    },
    {
        theType: ItemType.Cmd,
        title: 'cmd',
        detail: 'detail',
        actions: ['aaa', 'sss', 'ddd']
    },
    {
        theType: ItemType.Web,
        title: 'web-web',
        detail: 'detail',
        actions: ['aaa', 'sss', 'ddd']
    },
    {
        theType: ItemType.Web,
        title: 'web-web',
        detail: 'detail',
        actions: ['aaa', 'sss', 'ddd']
    },
    {
        theType: ItemType.Web,
        title: 'web-web==============================================',
        detail: 'detail',
        actions: ['aaa', 'sss', 'ddd']
    },
    {
        theType: ItemType.Web,
        title: 'web-web==============================================',
        detail: 'detail',
        actions: []
    },
    {
        theType: ItemType.Folder,
        title: 'folder',
        detail: 'detail',
        actions: []
    },
    {
        theType: ItemType.Folder,
        title: 'folder',
        detail: 'detail',
        actions: []
    },
    {
        theType: ItemType.Folder,
        title: 'folder',
        detail: 'detail',
        actions: []
    },
    {
        theType: ItemType.Folder,
        title: 'folder',
        detail: 'detail',
        actions: []
    },
    {
        theType: ItemType.Application,
        title: 'app',
        detail: 'detail',
        actions: ['aaa', 'sss']
    },
    {
        theType: ItemType.Application,
        title: 'app',
        detail: 'detail',
        actions: ['aaa', 'sss']
    },
    {
        theType: ItemType.Application,
        title: 'app',
        detail: 'detail',
        actions: ['aaa', 'sss']
    },
    {
        theType: ItemType.Application,
        title: 'app',
        detail: 'detail',
        actions: ['aaa', 'sss']
    },
    {
        theType: "...",
        title: 'title',
        detail: 'detail',
        actions: ['aaa', 'sss', 'ddd']
    },
];

interface InputValue {
    key: string,
    args: string,
}

function parseInputValue(input: string): InputValue {
    if (!input) {
        return { key: '', args: '' }
    }
    input = input.replace(/\s+/g, ' ');
    let spaceIndex = input.indexOf(' ');
    // 无空格 视为无参数
    if (spaceIndex < 0) {
        return { key: input, args: '' }
    }
    // 存在空格 无论在不在开头一样处理
    return {
        key: input.substring(0, spaceIndex),
        args: input.substring(spaceIndex + 1),
    }
}

function searchItems(input: string): ItemDescriptor[] {
    if (!input) {
        return [];
    }
    const { key, args } = parseInputValue(input);

    console.log(key, args);
    let tmpItems: ItemDescriptor[];
    if (key.length % 2 === 0 && key.length < 5) {
        tmpItems = [];
    } else {
        tmpItems = testItems;
    }
    return tmpItems;
}

export { parseInputValue, searchItems }
import { ItemPersistent, ItemDescriptor, ItemType, actionsByType } from "./executer";

const testItems = [
    [
        {
            theType: ItemType.Plugin,
            title: 'plugin',
            detail: '',
        },
        {
            theType: ItemType.Plugin,
            title: 'plugin',
            detail: '',
        },
        {
            theType: ItemType.Setting,
            title: 'UserSetting',
            detail: 'detail',
        }
    ], [
        {
            theType: ItemType.Cmd,
            title: 'cmd',
            detail: 'detail',
        },
        {
            theType: ItemType.Cmd,
            title: 'cmd',
            detail: 'detail',
        },
        {
            theType: ItemType.Cmd,
            title: 'cmd',
            detail: 'detail',
        },
        {
            theType: ItemType.Web,
            title: 'web-web',
            detail: 'https://fanyi.youdao.com/indexLLM.html#/',
        },
        {
            theType: ItemType.Web,
            title: 'Bilbili-search',
            detail: 'https://search.bilibili.com/all?keyword={}',
        },
        {
            theType: ItemType.Web,
            title: 'web-web==============================================',
            detail: 'detail',
        },
        {
            theType: ItemType.Web,
            title: 'web-web==============================================',
            detail: 'detail',
        },
        {
            theType: ItemType.Folder,
            title: 'folder',
            detail: 'detail',
        },
        {
            theType: ItemType.Folder,
            title: 'folder',
            detail: 'detail',
        },
        {
            theType: ItemType.Folder,
            title: 'folder',
            detail: 'detail',
        },
        {
            theType: ItemType.Folder,
            title: 'folder',
            detail: 'detail',
        },
        {
            theType: ItemType.Application,
            title: 'app',
            detail: 'detail',
        },
        {
            theType: ItemType.Application,
            title: 'app',
            detail: 'detail',
        },
        {
            theType: ItemType.Application,
            title: 'app',
            detail: 'detail',
        },
        {
            theType: ItemType.Application,
            title: 'app',
            detail: 'detail',
        },
        {
            theType: "...",
            title: 'title',
            detail: 'detail',
        },
    ]
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
    let tmpItemsList: Array<Array<ItemPersistent>>;

    // todo
    if (key.length % 2 === 0 && key.length < 5) {
        tmpItemsList = [];
    } else {
        tmpItemsList = testItems;
    }

    // format actions
    let formated: Array<Array<ItemDescriptor>> = tmpItemsList.map(items => items.map(item => {
        return {
            ...item,
            actions: actionsByType(item.theType),
        };
    }));

    // todo add plugins
    let plugins: ItemDescriptor[] = [];
    formated.splice(1, 0, plugins);
    
    return formated.flat();
}

export { parseInputValue, searchItems }
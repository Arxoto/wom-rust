/// input解析及查找items

import { itemsSelect } from "./persistence";
import { ItemCommon, ItemDescriptor, ItemReduced, ItemTable } from "./womItem";
import { getItemTypeId } from "./womItemType";
import { actionsByType } from "./womExecuter";

let itemsCache: ItemCommon[];

const itemsInit = () => {
    itemsSelect().then(
        items => items as ItemTable[]
    ).then(items => {
        itemsCache = items.sort((a, b) => {
            const { numb: nA } = getItemTypeId(a.theType);
            const { numb: nB } = getItemTypeId(b.theType);
            return nA !== nB ? nA - nB : a.id - b.id;
        }).map(item => ({...item, theKey: item.title.toLowerCase()}));
        console.log(itemsCache);

    });
}

/**
 * 解析后的输入对象
 */
interface Input {
    key: string,
    arg: string,
    hasArg: boolean,
    hasVal: boolean,
}

/**
 * 解析输入
 * @param value 输入内容 一般以空格分割 其中第一个为key 其余为args
 * @returns 解析后的对象
 */
function parseInputValue(value: string): Input {
    if (!value) {
        return { key: '', arg: '', hasArg: false, hasVal: false };
    }
    value = value.replace(/\s+/g, ' ');

    // 无空格 视为无参数
    let spaceIndex = value.indexOf(' ');
    if (spaceIndex < 0) {
        return { key: value, arg: '', hasArg: false, hasVal: true };
    }

    // 空格不在开头 视为有参数
    let key = value.substring(0, spaceIndex);
    let arg = value.substring(spaceIndex + 1);
    if (spaceIndex > 0) {
        return { key, arg, hasArg: true, hasVal: true };
    }

    // 空格开头 必须有参数才有参数
    return { key, arg, hasArg: !!arg, hasVal: true };
}

/**
 * 根据输入找到应该显示的items
 * @param input 解析后的输入对象
 * @returns 符合描述的item描述符
 */
function searchItems(input: Input): ItemDescriptor[] {
    console.log(input);
    if (!input || !input.hasVal) {
        return [];
    }

    // 存储于db中的匹配的item 匹配度高的在前（二维数组的第一个数组）
    let tmpItems: ItemReduced[] = itemsCache.map(item => ({ ...item, selected: false }));
    let itemsMatched = matchFns.map(fn => fn(input, tmpItems));

    // 存储于db中的item 根据类型获取对应的actions
    let formated: Array<Array<ItemDescriptor>> = itemsMatched.map(items => items.map(item => {
        return {
            ...item,
            actions: actionsByType(item.theType),
        };
    }));

    // todo add plugins 自定义内置的item匹配
    let plugins: ItemDescriptor[] = [];
    formated.splice(1, 0, plugins);

    return formated.flat();
}

const matchItemsBase = (fn: (input: Input, tmpItems: ItemReduced[]) => ItemReduced[]) => (input: Input, tmpItems: ItemReduced[]) => {
    let result = fn(input, tmpItems.filter(item => !item.selected));
    result.forEach(item => item.selected = true);
    return result;
};

const matchFns = [
    // todo 根据 hasArg 决定过滤逻辑
    matchItemsBase((input: Input, tmpItems: ItemReduced[]) =>
        tmpItems.filter(item => item.title === input.key)
    ),
    // 若空格 这里会全部显示（匹配''）
    matchItemsBase((input: Input, tmpItems: ItemReduced[]) =>
        tmpItems.filter(item => item.title.startsWith(input.key))
    ),
];

export { itemsInit, parseInputValue, searchItems }
export type { Input }
/// input解析及查找items

import { ItemTable, itemsSelect } from "./persistence";
import { ItemDescriptor, ItemPersistent } from "./womItem";
import { getItemTypeId } from "./womItemType";
import { actionsByType } from "./womExecuter";

let itemsCache: ItemTable[];

const itemsInit = () => {
    itemsSelect().then(
        items => items as ItemTable[]
    ).then(items => {
        itemsCache = items.sort((a, b) => {
            const { numb: nA } = getItemTypeId(a.theType);
            const { numb: nB } = getItemTypeId(b.theType);
            return nA !== nB ? nA - nB : a.id - b.id;
        });
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
    if (!input || !input.hasVal) {
        return [];
    }
    const { key, arg, hasArg } = input;

    console.log(key, arg, hasArg);
    let tmpItemsList: Array<Array<ItemPersistent>>;

    // todo 存储于db中的匹配的item 匹配度高的在前（二维数组的第一个数组）
    if (key.length % 2 === 0 && key.length < 5) {
        tmpItemsList = [];
    } else {
        tmpItemsList = [itemsCache];
    }

    // 存储于db中的item 根据类型获取对应的actions
    let formated: Array<Array<ItemDescriptor>> = tmpItemsList.map(items => items.map(item => {
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

export { itemsInit, parseInputValue, searchItems }
export type { Input }
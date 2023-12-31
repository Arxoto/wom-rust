/// input解析及查找items

import { itemsSelect } from "./persistence";
import { ItemCommon, ItemDescriptor, ItemReduced } from "./womItem";
import { ItemType, dbAallowedTypes, getItemTypeId } from "./womItemType";
import { actionsByType } from "./womExecuter";
import { genPlugins, power_hibernate, power_restart, power_shutdown } from "./womPlugin";
import { listFiles } from "./runtime";
import { variables } from "./env";

// 若有其他类似用法 可以抽成闭包
let outerCache: ItemCommon[] = [];
const getItemsCache = () => outerCache;
const setItemsCache = (next: ItemCommon[]) => { outerCache = next };

const itemsInit = async () => {
    let items = (await itemsSelect()).filter(item => dbAallowedTypes.includes(item.theType));
    let innerCache: ItemCommon[] = [power_hibernate, power_restart, power_shutdown];

    // item like cmd/web/app/folder
    let itemsInDB: ItemCommon[] = items.filter(item => item.theType !== ItemType.File).sort((a, b) => {
        const { numb: nA } = getItemTypeId(a.theType);
        const { numb: nB } = getItemTypeId(b.theType);
        return nA !== nB ? nA - nB : a.id - b.id;
    }).map(item => ({
        ...item,
        theKey: item.title.toLowerCase(),
        // 详见 executer 仅 cmd web 允许有参数
        withArgs: (item.theType === ItemType.Cmd || item.theType === ItemType.Web) && item.detail.includes(variables.input_replace),
    }));
    innerCache.push(...itemsInDB);

    // item like file
    items = items.filter(item => item.theType === ItemType.File);
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        let fileItems: ItemCommon[] = (await listFiles(item.title, item.detail)).map(finfo => ({
            theType: ItemType.File,
            theKey: finfo[0].toLowerCase(),
            withArgs: false,
            title: finfo[0],
            detail: finfo[1],
        }));
        innerCache.push(...fileItems);
    }

    console.log(innerCache);
    setItemsCache(innerCache);
}

/**
 * 解析后的输入对象
 */
interface Input {
    key: string,
    arg: string,
    hasArg: boolean,
    hasVal: boolean, // input 中有键入任何东西则为 true
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
        return { key: value.toLowerCase(), arg: '', hasArg: false, hasVal: true };
    }

    // 空格不在开头 视为有参数
    let key = value.substring(0, spaceIndex).toLowerCase();
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
const searchItems = async (input: Input, inputValue: string) => {
    console.log(input);
    if (!input || !input.hasVal) {
        return [];
    }

    // 存储于db中的匹配的item 匹配度高的在前（二维数组的第一个数组）
    let tmpItems: ItemReduced[] = getItemsCache().map(item => ({ ...item, selected: false }));
    let itemsMatched = matchFns.map(fn => fn(input, tmpItems));

    // 存储于db中的item 根据类型获取对应的actions
    let formated: Array<Array<ItemDescriptor>> = itemsMatched.map(items => items.map(item => {
        return {
            ...item,
            actions: (item as unknown as ItemDescriptor).actions || actionsByType(item.theType),
        };
    }));

    // add plugins 自定义内置的item匹配 如计算器
    let plugins: ItemDescriptor[] = await genPlugins(input, inputValue);

    formated.splice(1, 0, plugins);

    return formated.flat();
}

// todo 根据 hasArg 决定过滤逻辑 可以直接加载fn后面
// 都是浅拷贝 所以能直接for-each修改状态
const matchItems = (fn: (input: Input, tmpItems: ItemReduced[]) => ItemReduced[]) => (input: Input, tmpItems: ItemReduced[]) => {
    let filtered = tmpItems.filter(item => !item.selected);
    if (input.hasArg) {
        filtered = filtered.filter(item => item.withArgs);
    }
    let result = fn(input, filtered);
    result.forEach(item => item.selected = true);
    return result;
};

const matchFns = [
    // equals
    matchItems((input: Input, tmpItems: ItemReduced[]) =>
        tmpItems.filter(item => item.theKey === input.key)
    ),
    // startsWith  若空格 这里会全部显示（匹配''）
    matchItems((input: Input, tmpItems: ItemReduced[]) =>
        tmpItems.filter(item => item.theKey.startsWith(input.key))
    ),
    // includes
    matchItems((input: Input, tmpItems: ItemReduced[]) =>
        tmpItems.filter(item => item.theKey.includes(input.key))
    ),
    // custom match
    matchItems((input: Input, tmpItems: ItemReduced[]) =>
        tmpItems.filter(item => {
            const inKey = input.key;
            const itKey = item.theKey;
            if (inKey.length >= itKey.length) {
                return false;
            }
            let n = 0, t = 0;
            while (n < inKey.length && t < itKey.length) {
                if (inKey[n] === itKey[t]) {
                    n++;
                }
                t++;
            }
            return n === inKey.length;
        })
    ),
];

export { itemsInit, parseInputValue, searchItems }
export type { Input }
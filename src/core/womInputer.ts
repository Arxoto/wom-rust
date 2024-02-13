import { FindedItems, searchItem } from "./runtime";
import { ItemExtend } from "./womItem";
import { configPath, genCalc, gotoPageNav, power_hibernate, power_restart, power_shutdown } from "./womPlugins";

/**
 * 解析后的输入对象
 */
interface Input {
    key: string,
    arg: string,
    hasArg: boolean,
    hasInput: boolean,
}

/**
 * 解析输入
 * @param value 输入内容 一般以空格分割 其中第一个为key 其余为args
 * @returns 解析后的对象
 */
function parseInput(value: string): Input {
    if (!value) {
        return { key: '', arg: '', hasArg: false, hasInput: false };
    }
    value = value.replace(/\s+/g, ' ');

    // 无空格 视为无参数
    let spaceIndex = value.indexOf(' ');
    if (spaceIndex < 0) {
        return { key: value, arg: '', hasArg: false, hasInput: true };
    }

    // 空格不在开头 视为有参数
    let key = value.substring(0, spaceIndex);
    let arg = value.substring(spaceIndex + 1);
    if (spaceIndex > 0) {
        return { key, arg, hasArg: true, hasInput: true };
    }

    // 空格开头 必须有参数才有参数
    return { key, arg, hasArg: !!arg, hasInput: true };
}

const findMatch = (item: ItemExtend, input: Input) => {
    const inkey = input.key;
    const itkey = item.the_key;
    if (inkey.length >= itkey.length) return false;
    let n = 0, t = 0;
    while (n < inkey.length && t < itkey.length) {
        if (inkey[n] === itkey[t]) {
            n++;
        }
        t++;
    }
    return n === inkey.length;
}

const getStaticPlugins = (input: Input) => {
    const source: ItemExtend[] = [configPath, gotoPageNav, power_hibernate, power_restart, power_shutdown];
    const target: FindedItems<ItemExtend> = {
        eq: [],
        sw: [],
        ct: [],
        mc: []
    };
    for (const item of source) {
        if (item.the_key === input.key) {
            target.eq.push(item);
            continue;
        }
        if (item.the_key.startsWith(input.key)) {
            target.sw.push(item);
            continue;
        }
        if (item.the_key.includes(input.key)) {
            target.ct.push(item);
            continue;
        }
        if (findMatch(item, input)) {
            target.mc.push(item);
            continue;
        }
    }
    return target;
}

const genDynamicPlugins = async (input: Input, inputValue: string) => {
    const result: ItemExtend[] = [];
    const gens = [genCalc];
    for (const gen of gens) {
        let plugin = await gen(input, inputValue);
        if (plugin) {
            result.push(plugin);
        }
    }
    return result;
}

/**
 * 根据输入找到应该显示的items
 * @param input 解析后的输入对象
 * @returns 符合描述的item描述符
 */
const searchItemsEx = async (input: Input, inputValue: string) => {
    console.log(input);
    if (!input.hasInput) {
        return [];
    }

    let dynamicP = await genDynamicPlugins(input, inputValue);
    let staticP = getStaticPlugins(input);
    let items = await searchItem(input.key, input.hasArg);

    return [
        ...dynamicP,
        ...staticP.eq, ...items.eq,
        ...staticP.sw, ...items.sw,
        ...staticP.ct, ...items.ct,
        ...staticP.mc, ...items.mc,
    ];
}

export { parseInput, searchItemsEx };
export type { Input };

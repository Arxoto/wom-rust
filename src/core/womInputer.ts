import { searchItem } from "./invoker";
import { ItemExtend } from "./womItem";
import { genCalc, power_hibernate, power_restart, power_shutdown } from "./womPlugins";

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

const matchFns = [
    (input: Input, item: ItemExtend) => item.the_key === input.key,
    (input: Input, item: ItemExtend) => item.the_key.startsWith(input.key),
    (input: Input, item: ItemExtend) => item.the_key.includes(input.key),
]

const getStaticPlugins = (input: Input) => {
    const source: ItemExtend[] = [power_hibernate, power_restart, power_shutdown];
    const target: ItemExtend[] = [];
    const already = new Set<number>();
    for (const fn of matchFns) {
        for (let i = 0; i < source.length; i++) {
            if (already.has(i)) continue;
            const pp = source[i];
            if (fn(input, pp)) {
                target.push(pp);
                already.add(i);
            }
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

    let staticP = getStaticPlugins(input);
    let dynamicP = await genDynamicPlugins(input, inputValue);
    let items = await searchItem(input.key, input.hasArg);

    return [...staticP, ...dynamicP, ...items];
}

export { parseInput, searchItemsEx };
export type { Input };

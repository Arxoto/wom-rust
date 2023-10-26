import { constants, router } from "./env";
import { calc, clipboardWriteTextNotify, ensure, shutdown_power } from "./runtime";
import { Input } from "./womInputer";
import { ItemCommon, ItemDescriptor } from "./womItem";
import { ItemType } from "./womItemType";

const gotoPageTest: ItemCommon = {
    withArgs: false,
    theKey: router.navigation_name,
    theType: ItemType.Page,
    title: router.navigation_name,
    detail: ""
};

const power_trigger = async (action: string, _arg: string) => {
    const shouldShutdown = await ensure(`will ${action}, sure?`);
    shouldShutdown && shutdown_power(action);
}

const power_hibernate: ItemDescriptor = {
    withArgs: false,
    actions: ['hibernate'],
    theKey: "power_xm_hibernate",
    theType: ItemType.Plugin,
    title: "power_XM_hibernate",
    detail: "",
    trigger: power_trigger
}
const power_restart: ItemDescriptor = {
    withArgs: false,
    actions: ['restart'],
    theKey: "power_cq_restart",
    theType: ItemType.Plugin,
    title: "power_CQ_restart",
    detail: "",
    trigger: power_trigger
}
const power_shutdown: ItemDescriptor = {
    withArgs: false,
    actions: ['shutdown'],
    theKey: "power_gj_shutdown",
    theType: ItemType.Plugin,
    title: "power_GJ_shutdown",
    detail: "",
    trigger: power_trigger
}

async function genCalcDescriptor(input: Input, inputValue: string): Promise<ItemDescriptor | null> {
    if (input.hasVal && !input.arg && !input.key) {
        // 适配全量匹配
        return {
            withArgs: true,
            theKey: "",
            theType: ItemType.Plugin,
            title: "calculator",
            detail: constants.plugin_calc_detail,
            actions: [],
        };
    }
    if (!/([0-9]|\.|\+|\-|\*|\/%|\^|\(|\))+/.test(inputValue)) {
        // 1.2+0.1+-2*(3/2)%2+2^3
        return null;
    }
    try {
        let value = await calc(inputValue);
        return {
            withArgs: true,
            theKey: '',
            theType: ItemType.Plugin,
            title: 'calculator',
            detail: '',
            actions: [value],
            trigger: (action: string, _arg: string) => {
                clipboardWriteTextNotify(action);
            }
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

const genPlugins = async (input: Input, inputValue: string) => {
    const result: ItemDescriptor[] = [];
    const gens = [genCalcDescriptor];
    for (let i = 0; i < gens.length; i++) {
        const gen = gens[i];
        let plugin = await gen(input, inputValue);
        if (plugin) {
            result.push(plugin);
        }
    }
    return result;
}

export {
    power_hibernate, power_restart, power_shutdown,
    genPlugins,
    genCalcDescriptor,
}
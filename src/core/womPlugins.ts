import { router } from "./constants";
import { calc, clipboardWriteTextNotify, ensure, shutdown_power } from "./runtime";
import { Input } from "./womInputer";
import { ItemExtend, ItemType } from "./womItem";

// ========= 内嵌页面 =========

const gotoPageNav: ItemExtend = {
    the_type: ItemType.Page,
    title: router.navigation,
    detail: "",
    the_key: router.navigation,
    with_args: false,
    action_list: [],
    action_index: 0
};

// ========= 电源操作 =========

const power_trigger = async (action: string, _arg: string) => {
    const shouldShutdown = await ensure(`will ${action}, sure?`);
    shouldShutdown && shutdown_power(action);
}

const power_hibernate: ItemExtend = {
    the_type: ItemType.Plugin,
    title: "power_休眠_hibernate",
    detail: "",
    the_key: "power_xm_hibernate",
    with_args: false,
    action_list: ['hibernate'],
    action_index: 0,
    trigger: power_trigger
}
const power_restart: ItemExtend = {
    the_type: ItemType.Plugin,
    title: "power_重启_restart",
    detail: "",
    the_key: "power_cq_restart",
    with_args: false,
    action_list: ['restart'],
    action_index: 0,
    trigger: power_trigger
}
const power_shutdown: ItemExtend = {
    the_type: ItemType.Plugin,
    title: "power_关机_shutdown",
    detail: "",
    the_key: "power_gj_shutdown",
    with_args: false,
    action_list: ['shutdown'],
    action_index: 0,
    trigger: power_trigger
}

// ========= 计算器 =========

const genCalc = async (input: Input, inputValue: string): Promise<ItemExtend | null> => {
    if (input.hasInput && !input.arg && !input.key) {
        // 适配全量匹配
        return {
            the_type: ItemType.Plugin,
            title: "calculator",
            detail: 'support: (0.0) +- */ ^%',
            the_key: "",
            with_args: true,
            action_list: [],
            action_index: 0
        };
    }
    if (!/([0-9]|\.|\+|\-|\*|\/%|\^|\(|\))+/.test(inputValue)) {
        // (0.0) +-*/ %^
        return null;
    }
    try {
        let value = await calc(inputValue);
        return {
            the_type: ItemType.Plugin,
            title: 'calculator',
            detail: '',
            the_key: '',
            with_args: true,
            action_list: [value],
            action_index: 0,
            trigger: (action: string, _arg: string) => {
                clipboardWriteTextNotify(action);
            }
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

export {
    gotoPageNav,
    power_hibernate, power_restart, power_shutdown,
    genCalc,
}
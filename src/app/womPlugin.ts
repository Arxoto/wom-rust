import { constants } from "./env";
import { calc, clipboardWriteTextNotify } from "./runtime";
import { Input } from "./womInputer";
import { ItemCommon, ItemDescriptor } from "./womItem";
import { ItemType } from "./womItemType";

const gotoNavigation: ItemCommon = {
    theKey: constants.router_navigation_name,
    theType: ItemType.Navi,
    title: constants.router_navigation_name,
    detail: ""
};

const gotoSetting: ItemCommon = {
    theKey: constants.router_setting_name,
    theType: ItemType.Setting,
    title: constants.router_setting_name,
    detail: ""
};

const genCalcDescriptor = async (_input: Input, inputValue: string) => {
    if (!/([0-9]|\.|\+|\-|\*|\/%|\^|\(|\))+/.test(inputValue)) {
        // 1.2+0.1+-2*(3/2)%2+2^3
        return null;
    }
    try {
        let value = `${await calc(inputValue)}`;
        return {
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
    gotoNavigation, gotoSetting,
    genPlugins,
    genCalcDescriptor,
}
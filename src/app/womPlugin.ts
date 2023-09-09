import { constants } from "./env";
import { ItemCommon } from "./womItem";
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

export {
    gotoNavigation, gotoSetting,
}
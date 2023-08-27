import { ItemType } from "../../app/womExecuter";

import plugin from "../../assets/plugin.svg";
import setting from "../../assets/setting-1.svg";
import cmd from "../../assets/cmd.svg";
import web from "../../assets/web.svg";
import folder from "../../assets/folder-2.svg";
import app from "../../assets/app.svg";
import more from "../../assets/more.svg";

interface ItemIconElement {
    itemType: string,
}

export default function ({ itemType }: ItemIconElement) {
    switch (itemType) {
        case ItemType.Setting:
            return <img src={setting} alt="" style={{ width: '85%' }} />;
        case ItemType.Plugin:
            return <img src={plugin} alt="" style={{ width: '75%' }} />;
        case ItemType.Cmd:
            return <img src={cmd} alt="" style={{ width: '70%' }} />;
        case ItemType.Web:
            return <img src={web} alt="" style={{ width: '65%' }} />;
        case ItemType.Folder:
            return <img src={folder} alt="" style={{ width: '55%' }} />;
        case ItemType.Application:
            return <img src={app} alt="" style={{ width: '65%' }} />;
        default:
            return <img src={more} alt="" style={{ width: '50%' }} />
    }
}

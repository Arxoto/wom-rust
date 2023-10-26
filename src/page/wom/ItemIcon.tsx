import { ItemType } from "../../app/womItemType";

import plugin from "../../assets/plugin.svg";
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
        case ItemType.Plugin:
            return <img src={more} alt="" style={{ width: '50%' }} />
        case ItemType.Cmd:
            return <img src={cmd} alt="" style={{ width: '75%' }} />;
        case ItemType.Web:
            return <img src={web} alt="" style={{ width: '65%' }} />;
        case ItemType.File:
            return <img src={plugin} alt="" style={{ width: '75%' }} />;
        case ItemType.Folder:
            return <img src={folder} alt="" style={{ width: '55%' }} />;
        case ItemType.Application: 
            return <img src={app} alt="" style={{ width: '65%' }} />;
        default:
            return <img src={more} alt="" style={{ width: '50%' }} />
    }
}

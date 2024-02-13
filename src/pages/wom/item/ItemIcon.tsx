import { ItemType } from "../../../core/womItem";

import cmd from "../../../assets/cmd.svg";
import web from "../../../assets/web.svg";
import folder from "../../../assets/folder-2.svg";
import files from "../../../assets/app-1.svg";
import app from "../../../assets/app-2.svg";
import more from "../../../assets/more.svg";

interface ItemIconArgs {
    itemType: string,
}

export default function ({ itemType }: ItemIconArgs) {
    switch (itemType) {
        case ItemType.Cmd:
            return <img src={cmd} alt="" style={{ width: '75%' }} />;
        case ItemType.Web:
            return <img src={web} alt="" style={{ width: '65%' }} />;
        case ItemType.Folder:
            return <img src={folder} alt="" style={{ width: '55%' }} />;
        case ItemType.Files:
            return <img src={files} alt="" style={{ width: '75%' }} />;
        case ItemType.App:
            return <img src={app} alt="" style={{ width: '65%' }} />;
        default:
            return <img src={more} alt="" style={{ width: '50%' }} />
    }
}

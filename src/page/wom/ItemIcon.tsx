import setting from "../../assets/setting-1.svg";
import cmd from "../../assets/cmd.svg";
import web from "../../assets/web.svg";
import folder from "../../assets/folder-2.svg";
import app from "../../assets/app-1.svg";
import app2 from "../../assets/app-2.svg";
import more from "../../assets/more.svg";

enum ItemType {
    Tool,    // 内置选项
    Cmd,     // 命令行
    Web,     // 网页
    App,     // 应用
    Folder,  // 文件夹
}

interface ItemIconElement {
    itemType: ItemType,
}

function ItemIcon({ itemType }: ItemIconElement) {
    switch (itemType) {
        case ItemType.App:
            // return <img src={app} alt="" style={{width: '80%'}} />;
            return <img src={app2} alt="" style={{width: '60%'}} />;
        case ItemType.Folder:
            return <img src={folder} alt="" style={{width: '55%'}} />;
        case ItemType.Web:
            return <img src={web} alt="" style={{width: '65%'}} />;
        case ItemType.Cmd:
            return <img src={cmd} alt="" style={{width: '70%'}} />;
        case ItemType.Tool:
            return <img src={setting} alt="" style={{width: '85%'}} />;
        default:
            return <img src={more} alt="" style={{width: '50%'}} />
    }

}

export { ItemType, ItemIcon }
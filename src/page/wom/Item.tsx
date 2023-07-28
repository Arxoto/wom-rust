import { ItemAction, ItemActionStatus } from "./ItemAction";
import { ItemType, ItemIcon } from "./ItemIcon";
import "./Item.css";

interface ItemDescriptor {
    theType: ItemType,
    theKey: string,
    title: string,
    detail: string,
    action: ItemActionStatus,
    trigger: (action: ItemActionStatus, params: string[] | null) => void,
}

function Item({ theType, theKey, title, detail, action, trigger }: ItemDescriptor) {
    return (
        <div className="line">
            <div className="icon"><ItemIcon itemType={theType} /></div>
            <div className="middle">
                <div className="title">{title}</div>
                <div className="detail">{detail}</div>
            </div>
            <ItemAction actionIndex={action.actionIndex} actions={action.actions}></ItemAction>
        </div>
    )
}

export { Item, ItemType };
export type { ItemDescriptor };

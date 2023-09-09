import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { WomContext } from "./womContext";

import { routerPath } from "../../app/env";
import { ItemState } from "../../app/womItem";
import { itemTypeIsPage } from "../../app/womItemType";
import ItemAction from "./ItemAction";
import ItemIcon from "./ItemIcon";
import "./Item.css";
import "./Item-hover.css"
import "./Item-active.css"


interface ItemElementParam {
    selected: boolean,
    item: ItemState,
    itemIndex: number,
}

const Item = ({ selected, item, itemIndex }: ItemElementParam) => {
    let { theType, title, detail, actions, actionIndex } = item;
    const { dispatch } = useContext(WomContext);
    const navigate = useNavigate();

    const itemRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (selected) {
            // showItem
            itemRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [selected]);  // 只有selected改变时触发

    // 阻止事件冒泡  onClick={(event) => event.stopPropagation()}
    return (
        <div className={selected ? "line line-active" : "line line-hover"} ref={itemRef}>
            <div className="line-clickable" onClick={() => {
                if (itemTypeIsPage(theType)) {
                    navigate(routerPath(title));
                } else {
                    dispatch({ type: 'trigger', itemIndex })
                }
            }}>
                <div className="icon"><ItemIcon itemType={theType} /></div>
                <div className="middle">
                    <div className="title">{title}</div>
                    <div className="detail">{detail}</div>
                </div>
            </div>

            <ItemAction itemIndex={itemIndex} actions={actions} actionIndex={actionIndex}></ItemAction>

        </div>
    )
}

export default Item;

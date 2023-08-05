import { useContext, useEffect, useRef } from "react";
import { ItemState } from "./executer";
import { WomContext } from "./womContext";

import ItemAction from "./ItemAction";
import ItemIcon from "./ItemIcon";
import "./Item.css";


interface ItemElementParam {
    selected: boolean,
    item: ItemState,
    itemIndex: number,
}

const Item = ({ selected, item, itemIndex }: ItemElementParam) => {
    let { theType, title, detail, actions, actionIndex } = item;
    const { dispatch } = useContext(WomContext);

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
        <div className={selected ? "line line-active" : "line"} ref={itemRef}>
            <div onClick={() => dispatch({ type: 'trigger', itemIndex })}>
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

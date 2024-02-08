import { useContext, useEffect, useRef } from "react";
import { ItemExtend } from "../../../core/womItem";
import { WomContext } from "../womContext";
import ItemIcon from "./ItemIcon";
import ItemAction from "./ItemAction";
import "./Item.css";
import "./Item-hover.css";
import "./Item-active.css";

interface ItemElementArgs {
    selected: boolean,
    item: ItemExtend,
    itemIndex: number,
}

const Item = ({ selected, item, itemIndex }: ItemElementArgs) => {
    let { the_type, title, detail, action_list, action_index } = item;
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
    // 这里有个小bug 每次更新时第一项的selected不会变 不会聚焦到第一项
    // 需要注意两点： 1、每次更新输入都需要聚焦 2、每次点击切换action都不能聚焦 （因此不能用new Object()代替true）

    // 阻止事件冒泡  onClick={(event) => event.stopPropagation()}
    return (
        <div className={selected ? "line line-active" : "line line-hover"} ref={itemRef}>
            <div className="line-clickable" onClick={() => dispatch({ type: 'trigger', itemIndex })}>
                <div className="icon"><ItemIcon itemType={the_type} /></div>
                <div className="middle">
                    <div className="title">{title}</div>
                    <div className="detail">{detail}</div>
                </div>
            </div>

            <ItemAction itemIndex={itemIndex} actions={action_list} actionIndex={action_index}></ItemAction>

        </div>
    )
}

export default Item;
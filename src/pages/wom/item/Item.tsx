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
    version: boolean,
}

const Item = ({ selected, item, itemIndex, version }: ItemElementArgs) => {
    let { the_type, title, detail, action_list, action_index } = item;
    const { dispatch } = useContext(WomContext);

    const itemRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (selected) {
            // showItem  注意这里优先级比滚轮的交互低 需要等页面完全停止后才能生效 否则被覆盖
            itemRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [selected, version]);  // 只有selected version改变时触发

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
import { useEffect, useRef } from "react";
import { ItemDescriptor } from "./executer";
import ItemAction from "./ItemAction";
import ItemIcon from "./ItemIcon";
import "./Item.css";


interface ItemElementParam extends ItemDescriptor {
    selected: boolean,
    actionIndex: number,
    setIndex: (nextIndex: number) => void,
}

const Item = (item: ItemElementParam) => {
    let { selected, theType, title, detail, actions, actionIndex, setIndex } = item;

    const itemRef = useRef<HTMLDivElement>(null);
    function showItem() {
        itemRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        })
    }

    useEffect(() => {
        if (selected) {
            showItem();
        }
    }, [selected]);

    return (
        <div className={selected ? "line line-active" : "line"} ref={itemRef}>
            <div className="icon"><ItemIcon itemType={theType} /></div>
            <div className="middle">
                <div className="title">{title}</div>
                <div className="detail">{detail}</div>
            </div>

            <div onClick={(event) => event.stopPropagation()}>
                <ItemAction actions={actions} actionIndex={actionIndex} setIndex={setIndex}></ItemAction>
            </div>

        </div>
    )
}

export default Item;

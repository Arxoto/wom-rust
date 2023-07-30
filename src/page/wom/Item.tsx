import { useRef, useState } from "react";
import ItemAction from "./ItemAction";
import ItemIcon from "./ItemIcon";
import "./Item.css";

// web file no args
import { open } from '@tauri-apps/api/shell';

enum ItemType {
    Setting = "setting",    // 选项
    Plugin = "plugin",          // 内置工具
    Cmd = "cmd",            // 命令行
    Web = "web",            // 网页
    Folder = "folder",      // 文件夹
    Application = "app",    // 应用
}

interface ItemDescriptor {
    selected?: boolean,
    theType: ItemType | string,
    title: string,
    detail: string,
    actions: string[],
    trigger?: (action: string, params: string[] | null) => void,
}

function triggerItem(item: ItemDescriptor, actionIndex: number) {
    console.log(item.theType, item.title, item.detail, item.actions[actionIndex]);
}

function Item(item: ItemDescriptor) {
    let { selected, theType, title, detail, actions, trigger } = item;
    let [actionIndex, setIndex] = useState(0);

    const itemRef = useRef<HTMLDivElement>(null);
    function showItem() {
        itemRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        })
    }
    if (selected) {
        showItem();
    }

    return (
        <div className="line" ref={itemRef}>
            <div className={selected ? "line-active" : undefined} onClick={async () => { triggerItem(item, actionIndex); }}>
                <div className="icon"><ItemIcon itemType={theType} /></div>
                <div className="middle">
                    <div className="title">{title}</div>
                    <div className="detail">{detail}</div>
                </div>
            </div>

            <ItemAction actions={actions} actionIndex={actionIndex} setIndex={setIndex}></ItemAction>
        </div>
    )
}

export { Item, ItemType };
export type { ItemDescriptor };

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

import { ItemTag } from "../../../app/womItemTag";
import { ItemType } from "../../../app/womItemType";
import { ItemConfig } from "../../../app/womItem";
import { itemsDelete, itemsInsert, itemsSelect, itemsTableCreate, itemsTableDrop, itemsUpdate } from "../../../app/persistence"
import { ensure } from "../../../app/runtime";

import ItemFamily from "./ItemFamily";

/* example
cmd|ipconfig|ipconfig
web|youdao-fanyi|https://fanyi.youdao.com/indexLLM.html#/
web|Bilibili-search|https://search.bilibili.com/all?keyword={}
folder|gogg|D:\gongg
folder|ppn-ph|downloadDir:ppn/ph
*/

export default function () {
    const [items, setItems] = useState<ItemConfig[] | null>(null);
    useEffect(() => {
        itemsSelect().then(ais => {
            setItems(ais.map(ai => ({ ...ai, tag: ItemTag.None })));
        });
    }, []);

    const textRef = useRef<HTMLTextAreaElement>(null);
    const navigate = useNavigate();

    if (!items) {
        return <></>;
    }

    const allowedTypes: string[] = [ItemType.Cmd, ItemType.Web, ItemType.Application, ItemType.Folder, ItemType.File];
    const itemsFamily = allowedTypes.map(itemType => ({
        theType: itemType,
        items: items.filter(item => item.theType === itemType)
    }));

    const getAddItems = () => textRef.current!.value.split('\n').map(line => {
        let [theType, title, detail] = line.split('|');
        return { tag: ItemTag.Insert, id: 0, theType: theType?.trim(), title: title?.trim(), detail: detail?.trim() };
    }).filter(item => item.theType && item.title && item.detail && allowedTypes.includes(item.theType));

    const add = () => {
        if (textRef.current!.style.display === 'none') {
            textRef.current!.value = '';
            textRef.current!.style.setProperty('display', 'inline');
        } else {
            textRef.current!.style.setProperty('display', 'none');
            if (!textRef.current!.value) {
                return;
            }

            const newItems = getAddItems();
            if (newItems.length) {
                setItems([...items, ...newItems]);
            }
        }
    }

    const clear = async () => {
        const shouldClear = await ensure('sure?');
        shouldClear && itemsTableDrop().then(() =>
            itemsTableCreate().then(() =>
                navigate('/')));
    }

    const save = async () => {
        items.filter(item => item.tag === ItemTag.Delete).map(item => item.id).forEach(itemsDelete);
        items.filter(item => item.tag === ItemTag.Update).forEach(itemsUpdate);
        items.filter(item => item.tag === ItemTag.Insert).forEach(itemsInsert);
        getAddItems().filter(item => item.tag === ItemTag.Insert).forEach(itemsInsert);
        navigate('/');
    }

    return <div style={{ width: '100%' }}>
        <div className="radian-box common-color " style={{ position: 'fixed' }}>
            <div style={{ display: 'flex' }}>
                <div className="activable-button common-color big-box" style={{ textAlign: 'center' }} onClick={add}>add</div>
                <div className="activable-button common-color big-box" style={{ textAlign: 'center' }}>tips</div>
                <div className="activable-button common-color big-box" style={{ textAlign: 'center' }} onClick={clear}>clear</div>
                <div className="activable-button common-color big-box" style={{ textAlign: 'center' }} onClick={save}>save</div>
            </div>
            <textarea ref={textRef} style={{ display: 'none', position: 'fixed', width: '90%', height: '70%' }} placeholder="{type}|{title}|{detail}"></textarea>
        </div>
        <div style={{ height: '3em' }}></div>
        {itemsFamily.map((itemFamily, i) => <ItemFamily key={i} theType={itemFamily.theType} itemLines={itemFamily.items} allItems={items} setItems={setItems} />)}
    </div>
}
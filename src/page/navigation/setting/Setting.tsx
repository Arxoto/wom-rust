import { useEffect, useRef, useState } from "react"

import { ItemTag } from "../../../app/womItemTag";
import { dbAallowedTypes } from "../../../app/womItemType";
import { ItemConfig, ItemMember } from "../../../app/womItem";
import { itemsDelete, itemsInsert, itemsSelect, itemsTableCreate, itemsTableDrop, itemsUpdate } from "../../../app/persistence"
import { allowedFormatPath, ensure, formatPath } from "../../../app/runtime";

import ItemFamily from "./ItemFamily";
import { itemsInit } from "../../../app/womInputer";
import { constants } from "../../../app/env";

import './Setting.css'

/* example
cmd|ipconfig|ipconfig
web|youdao-fanyi|https://fanyi.youdao.com/indexLLM.html#/
web|Bilibili-search|https://search.bilibili.com/all?keyword={}
folder|gogg|D:\gongg
folder|ppn-ph|downloadDir:ppn/ph
file|.*\.txt$|D:\book
*/

export default function () {
    const [flag, setFlag] = useState(false);
    const [pathMap, setPathMap] = useState<Array<[string, string]>>([]);
    const [items, setItems] = useState<ItemConfig[]>([]);
    useEffect(() => {
        itemsSelect().then(ais => {
            setItems(ais.map(ai => ({ ...ai, tag: ItemTag.None })));
        });
        (async () => {
            const tmpMap: Array<[string, string]> = [];
            for (const path of allowedFormatPath) {
                tmpMap.push([path, await formatPath(path)]);
            }
            setPathMap(tmpMap);
        })();

    }, [flag]);

    const textRef = useRef<HTMLTextAreaElement>(null);
    const tipsRef = useRef<HTMLDivElement>(null);

    const itemFamilies: { theType: string, items: ItemMember[] }[] = dbAallowedTypes.map(itemType => ({
        theType: itemType,
        items: items.map((item, i) => ({ ...item, index: i })).filter(item => item.theType === itemType)
    }));

    const getAddItems = () => textRef.current!.value.split('\n').map(line => {
        const ls = line.split(constants.setting_split);
        let theType = ls[0];
        let title = ls[1];
        let detail = ls.slice(2).join(constants.setting_split);
        return { tag: ItemTag.Insert, id: 0, theType: theType?.trim(), title: title?.trim(), detail: detail?.trim() };
    }).filter(item => item.theType && item.title && item.detail && dbAallowedTypes.includes(item.theType));

    const add = () => {
        if (textRef.current!.style.display === 'none') {
            textRef.current!.style.setProperty('display', 'inline');
        } else {
            textRef.current!.style.setProperty('display', 'none');
            if (!textRef.current!.value) {
                return;
            }

            const newItems = getAddItems();
            textRef.current!.value = '';
            if (newItems.length) {
                setItems([...items, ...newItems]);
            }
        }
    }

    const tips = () => {
        if (tipsRef.current!.style.display === 'none') {
            tipsRef.current!.style.setProperty('display', 'inline');
        } else {
            tipsRef.current!.style.setProperty('display', 'none');
        }
    }

    const clear = async () => {
        const shouldClear = await ensure('sure?');
        shouldClear && itemsTableDrop().then(() =>
            itemsTableCreate().then(() =>
                setFlag(!flag)));
    }

    const save = async () => {
        // 确保顺序更新完成后，刷新缓存
        // id 为 0 表示刚刚新增的不在db中
        let deletes = items.filter(item => item.tag === ItemTag.Delete && item.id).map(item => item.id);
        for (const id of deletes) {
            await itemsDelete(id);
        }
        let updates = items.filter(item => item.tag === ItemTag.Update);
        for (const item of updates) {
            await itemsUpdate(item);
        }
        let inserts = items.filter(item => item.tag === ItemTag.Insert);
        for (const item of inserts) {
            await itemsInsert(item);
        }
        let adds = getAddItems();
        for (const item of adds) {
            await itemsInsert(item);
        }

        await itemsInit();
        setFlag(!flag);
    }

    return <div style={{ width: '100%' }}>
        <div className="setting-box">
            <div className="radian-box common-color setting-bar">
                <div className="activable-text common-color big-box" onClick={add}>add</div>
                <div className="activable-text common-color big-box" onClick={tips}>tips</div>
                <div className="activable-text common-color big-box" onClick={clear}>clear</div>
                <div className="activable-text common-color big-box" onClick={save}>save</div>
            </div>
            <textarea ref={textRef} className="add-text" placeholder={constants.setting_add_placeholder} style={{ display: 'none' }}></textarea>
            <div ref={tipsRef} className="radian-box common-color tips-table" style={{ display: 'none' }}>
                <table>
                    <thead><tr><th>pathTag</th><th>truePath</th></tr></thead>
                    <tbody>
                        {pathMap.map((apath, i) => <tr key={i}><td>{apath[0]}</td><td>{apath[1]}</td></tr>)}</tbody>
                </table>
            </div>
        </div>
        {itemFamilies.map((itemFamily, i) => <ItemFamily key={i} theType={itemFamily.theType} itemLines={itemFamily.items} setItems={setItems} />)}
    </div>
}
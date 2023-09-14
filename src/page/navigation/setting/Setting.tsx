import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

import { ItemTag } from "../../../app/womItemTag";
import { ItemType } from "../../../app/womItemType";
import { ItemConfig } from "../../../app/womItem";
import { itemsDelete, itemsInsert, itemsSelect, itemsTableCreate, itemsTableDrop, itemsUpdate } from "../../../app/persistence"
import { allowedFormatPath, ensure, formatPath } from "../../../app/runtime";

import ItemFamily from "./ItemFamily";
import { itemsInit } from "../../../app/womInputer";
import { constants } from "../../../app/env";

/* example
cmd|ipconfig|ipconfig
web|youdao-fanyi|https://fanyi.youdao.com/indexLLM.html#/
web|Bilibili-search|https://search.bilibili.com/all?keyword={}
folder|gogg|D:\gongg
folder|ppn-ph|downloadDir:ppn/ph
file|.*\.txt$|D:\book
*/

export default function () {
    const [pathMap, setPathMap] = useState<Array<[string, string]>>([]);
    const [items, setItems] = useState<ItemConfig[] | null>(null);
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

    }, []);

    const textRef = useRef<HTMLTextAreaElement>(null);
    const tipsRef = useRef<HTMLDivElement>(null);
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
        const ls = line.split('|');
        let theType = ls[0];
        let title = ls[1];
        let detail = ls.slice(2).join('|');
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
                navigate('/')));
    }

    const save = async () => {
        // 确保顺序更新完成后，刷新缓存
        let deletes = items.filter(item => item.tag === ItemTag.Delete).map(item => item.id);
        for (let i = 0; i < deletes.length; i++) {
            const id = deletes[i];
            await itemsDelete(id);
        }
        let updates = items.filter(item => item.tag === ItemTag.Update);
        for (let i = 0; i < updates.length; i++) {
            const item = updates[i];
            await itemsUpdate(item);
        }
        let inserts = items.filter(item => item.tag === ItemTag.Insert);
        for (let i = 0; i < inserts.length; i++) {
            const item = inserts[i];
            await itemsInsert(item);
        }
        let adds = getAddItems();
        for (let i = 0; i < adds.length; i++) {
            const item = adds[i];
            await itemsInsert(item);
        }

        await itemsInit();
        navigate('/');
    }

    return <div style={{ width: '100%' }}>
        <div className="radian-box common-color " style={{ position: 'fixed' }}>
            <div style={{ display: 'flex' }}>
                <div className="activable-text common-color big-box" onClick={add}>add</div>
                <div className="activable-text common-color big-box" onClick={tips}>tips</div>
                <div className="activable-text common-color big-box" onClick={clear}>clear</div>
                <div className="activable-text common-color big-box" onClick={save}>save</div>
            </div>
            <textarea ref={textRef} placeholder={constants.setting_add_placeholder} style={{ display: 'none', position: 'fixed', width: '90%', height: '70%' }}></textarea>
            <div ref={tipsRef} className="radian-box common-color" style={{ display: 'none', position: 'fixed', width: '90%', height: '70%', overflow: 'auto', userSelect: 'text' }}>
                <table>
                    <thead><tr><th>pathTag</th><th>truePath</th></tr></thead>
                    <tbody>
                        {pathMap.map((apath, i) => <tr key={i}><td>{apath[0]}</td><td>{apath[1]}</td></tr>)}</tbody>
                </table>
            </div>
        </div>
        <div style={{ height: '3em' }}></div>
        {itemsFamily.map((itemFamily, i) => <ItemFamily key={i} theType={itemFamily.theType} itemLines={itemFamily.items} allItems={items} setItems={setItems} />)}
    </div>
}
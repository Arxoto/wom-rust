import { ItemConfig } from "../../../app/womItem";
import { ItemTag } from "../../../app/womItemTag";

interface ItemFamilyParam {
    theType: string,
    itemLines: ItemConfig[],
    allItems: ItemConfig[],
    setItems: (items: ItemConfig[]) => void,
}

export default function ({ theType, itemLines, allItems, setItems }: ItemFamilyParam) {
    return <>
        <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{theType}</div>
        <div className="radian-box common-color" style={{ padding: '8px 0' }}>
            {itemLines.filter(itemLine => itemLine.tag !== ItemTag.Delete).map(itemLine =>
                <div key={itemLine.id} style={{ fontSize: "1.4em", display: 'flex', flexFlow: 'row nowrap', alignItems: 'center' }}>
                    <input className="inputable big-box" style={{ width: '20%', fontSize: '1em' }} defaultValue={itemLine.title} onChange={e => {
                        setItems(allItems.map(item => item.id !== itemLine.id ? item : { ...item, title: e.target.value, tag: ItemTag.Update }));
                    }} />
                    |
                    <input className="inputable big-box" style={{ width: '100%', fontSize: '1em' }} defaultValue={itemLine.detail} onChange={e => {
                        setItems(allItems.map(item => item.id !== itemLine.id ? item : { ...item, detail: e.target.value, tag: ItemTag.Update }));
                    }} />
                    <span className="activable-text common-color" onClick={() => {
                        setItems(allItems.map(item => item.id !== itemLine.id ? item : { ...item, tag: ItemTag.Delete }));
                    }}>delete</span>
                    <br />
                </div>)}
        </div>
    </>
}

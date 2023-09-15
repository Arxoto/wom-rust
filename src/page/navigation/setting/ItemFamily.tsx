import { ItemConfig, ItemMember } from "../../../app/womItem";
import { ItemTag } from "../../../app/womItemTag";

interface ItemFamilyParam {
    theType: string,
    itemLines: ItemMember[],
    setItems: React.Dispatch<React.SetStateAction<ItemConfig[]>>,
}

export default function ({ theType, itemLines, setItems }: ItemFamilyParam) {
    return <>
        <div><h1>{theType}</h1></div>
        <div className="radian-box common-color" style={{ padding: '8px 0' }}>
            {itemLines.filter(itemLine => itemLine.tag !== ItemTag.Delete).map(itemLine =>
                <div key={itemLine.index} style={{ fontSize: "1.4em", display: 'flex', flexFlow: 'row nowrap', alignItems: 'center' }}>
                    <input className="inputable big-box" style={{ width: '20%', fontSize: '1em' }} defaultValue={itemLine.title} onChange={e => {
                        setItems(allItems => allItems.map((item, i) => i !== itemLine.index ? item : { ...item, title: e.target.value, tag: ItemTag.Update }));
                    }} />
                    |
                    <input className="inputable big-box" style={{ width: '100%', fontSize: '1em' }} defaultValue={itemLine.detail} onChange={e => {
                        setItems(allItems => allItems.map((item, i) => i !== itemLine.index ? item : { ...item, detail: e.target.value, tag: ItemTag.Update }));
                    }} />
                    <span className="activable-text common-color" onClick={() => {
                        setItems(allItems => allItems.map((item, i) => i !== itemLine.index ? item : { ...item, tag: ItemTag.Delete }));
                    }}>delete</span>
                    <br />
                </div>)}
        </div>
    </>
}

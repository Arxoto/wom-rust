import { ItemConfig, ItemMember } from '../../../app/womItem';
import { ItemTag } from '../../../app/womItemTag';

interface ItemFamilyParam {
    theType: string,
    itemLines: ItemMember[],
    setItems: React.Dispatch<React.SetStateAction<ItemConfig[]>>,
}

export default function ({ theType, itemLines, setItems }: ItemFamilyParam) {
    return <>
        <div style={{fontWeight: 'bold', fontSize: '2em', padding: '.7em 0 .3em 0'}}>{theType}</div>
        <div className='radian-box common-color' style={{ padding: '8px 0', fontSize: '1em' }}>
            {itemLines.filter(itemLine => itemLine.tag !== ItemTag.Delete).map(itemLine =>
                <div key={itemLine.index} style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center' }}>
                    <input className='inputable big-box' style={{ flexShrink: 0, width: '25%', fontSize: '100%' }} defaultValue={itemLine.title} onChange={e => {
                        setItems(allItems => allItems.map((item, i) => i !== itemLine.index ? item : { ...item, title: e.target.value, tag: ItemTag.Update }));
                    }} />
                    |
                    <input className='inputable big-box' style={{ width: '100%', fontSize: '100%' }} defaultValue={itemLine.detail} onChange={e => {
                        setItems(allItems => allItems.map((item, i) => i !== itemLine.index ? item : { ...item, detail: e.target.value, tag: ItemTag.Update }));
                    }} />
                    <span className='activable-text common-color' style={{ flexShrink: 0 }} onClick={() => {
                        setItems(allItems => allItems.map((item, i) => i !== itemLine.index ? item : { ...item, tag: ItemTag.Delete }));
                    }}>delete</span>
                    <br />
                </div>)}
        </div>
    </>
}

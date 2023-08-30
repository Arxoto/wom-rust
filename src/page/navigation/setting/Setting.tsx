import { useEffect, useState } from "react"
import { itemsSelect } from "../../../app/persistence"
import { ItemTable } from "../../../app/womItem";
import ItemFamily from "./ItemFamily";
import { ItemType } from "../../../app/womItemType";

export default function () {
    const [items, setItems] = useState<ItemTable[] | null>(null);
    useEffect(() => {
        itemsSelect().then(setItems);
    }, []);

    if (!items) {
        return <div></div>;
    }

    const itemsFamily = [ItemType.Cmd, ItemType.Web, ItemType.Folder, ItemType.Application].map(itemType => ({
        theType: itemType,
        items: items.filter(item =>item.theType === itemType)
    }));

    return <div style={{width: '100%'}}>{itemsFamily.map(itemFamily => <ItemFamily theType={itemFamily.theType} items={itemFamily.items} />)}</div>
}
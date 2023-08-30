import { ItemTable } from "../../../app/womItem";

interface ItemFamilyParam {
    theType: string, items: ItemTable[],
}

export default function (itemFamily: ItemFamilyParam) {
    return <><h1>{itemFamily.theType}</h1><hr /></>
}
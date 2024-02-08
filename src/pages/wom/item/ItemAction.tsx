import { useContext } from "react";
import { WomContext } from "../womContext";

interface ItemActionElement {
    itemIndex: number,
    actions: string[],
    actionIndex: number,
}

const ItemAction = ({ itemIndex, actions, actionIndex }: ItemActionElement) => {
    const { dispatch } = useContext(WomContext);

    if (!actions.length) {
        return <div className='action'></div>
    }
    return <div className='action'>
        {actionIndex > 0 && <div className="action-left a-txt" onClick={() => dispatch({ type: 'left', itemIndex })}>◀</div>}
        {actions[actionIndex]}
        {actionIndex < actions.length - 1 && <div className="action-right a-txt" onClick={() => dispatch({ type: 'right', itemIndex })}>▶</div>}
    </div>
}

export default ItemAction;
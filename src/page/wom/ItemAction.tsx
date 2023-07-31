interface ItemActionElement {
    actions: string[],
    actionIndex: number,
    setIndex: (nextIndex: number) => void,
}

const ItemAction = ({ actions, actionIndex, setIndex }: ItemActionElement) => {
    if (!actions.length) {
        return <div className='action'></div>
    }
    return <div className='action'>
        {actionIndex > 0 && <div className="left activable-text"
            onClick={() => setIndex(actionIndex - 1)}>◀</div>}
        {actions[actionIndex]}
        {actionIndex < actions.length - 1 && <div className="right activable-text"
            onClick={() => setIndex(actionIndex + 1)}>▶</div>}
    </div>
}

export default ItemAction;

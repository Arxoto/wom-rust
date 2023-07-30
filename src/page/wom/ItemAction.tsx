interface ItemActionElement {
    actions: string[],
    actionIndex: number,
    setIndex: React.Dispatch<React.SetStateAction<number>>,
}

function safeStepIndex(actionState: ItemActionElement, step: number) {
    const nextIndex = actionState.actionIndex + step;
    const maxIndex = actionState.actions.length - 1;
    const setIndex = actionState.setIndex;
    if (nextIndex < 0) {
        setIndex(0);
    } else if (nextIndex > maxIndex) {
        setIndex(maxIndex);
    } else {
        setIndex(nextIndex);
    }
}

export default function ({ actions, actionIndex, setIndex }: ItemActionElement) {
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

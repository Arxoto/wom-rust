interface ItemActionStatus {
    actionIndex: number,
    actions: string[],
}

function ItemAction({ actionIndex, actions }: ItemActionStatus) {
    if (!actions.length) {
        return <div className='action'></div>
    }
    if (actionIndex < 0) {
        actionIndex = 0;
    } else if (actionIndex >= actions.length) {
        actionIndex = actions.length - 1;
    }
    return <div className='action'>{actions[actionIndex]}</div>
}

export { ItemAction };
export type { ItemActionStatus };

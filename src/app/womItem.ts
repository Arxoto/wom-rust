/**
 * item持久化信息
 */
interface ItemPersistent {
    theType: string,
    title: string,
    detail: string,
}

/**
 * item存储在db中的格式
 */
interface ItemTable extends ItemPersistent {
    id: number
}

/**
 * item描述符
 * - 增加了actions和可选的自定义触发方法
 * - 一般内置的item实现该接口
 */
interface ItemDescriptor extends ItemPersistent {
    actions: string[],
    trigger?: (action: string, arg: string) => void,
}

/**
 * item运行时状态 用于reducer中
 * - 增加了action的显示索引
 */
interface ItemState extends ItemDescriptor {
    actionIndex: number
}

export type {
    ItemPersistent, ItemTable, ItemDescriptor, ItemState
}
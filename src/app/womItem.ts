/**
 * item 最基础的持久化信息
 */
interface ItemBase {
    theType: string,
    title: string,
    detail: string,
}

/**
 * item存储在db中的格式
 */
interface ItemTable extends ItemBase {
    id: number
}

/**
 * item 常规意义上的信息 长期存在于内存中
 * - theKey 用于匹配
 */
interface ItemCommon extends ItemBase {
    theKey: string
}

/**
 * searchItems时【临时】使用的中间状态
 */
interface ItemReduced extends ItemCommon {
    selected: boolean,
}

/**
 * item描述符 匹配期间短暂存在 后成为ItemState被渲染
 * - 增加了actions和可选的自定义触发方法
 * - 一般内置的item实现该接口
 */
interface ItemDescriptor extends ItemCommon {
    actions: string[],
    trigger?: (action: string, arg: string) => void,
}

/**
 * item运行时状态 用于reducer中 显示期间一直存在
 * - 增加了action的显示索引 直接影响渲染
 */
interface ItemState extends ItemDescriptor {
    actionIndex: number
}

export type {
    ItemBase, ItemCommon, ItemTable, ItemReduced, ItemDescriptor, ItemState
}
/// 使用 Context 深层传递参数：无需通过 props 显式传递
/// 一般情况下通过 props 显式传递信息是比较推荐的，能通过组件描述很清晰地看到该组件所使用到的信息
/// 但在组件树中深层传递参数 以及需要在组件间复用相同的参数时，会存在【状态提升】过高、逐层传递 props 的现象

import { Context, Dispatch, createContext } from "react";
import { ItemsReducerAction, WomState } from "./WomReducer";
import { parseInput } from "../../core/womInputer";

interface WomContextType {
    womState: WomState,
    dispatch: Dispatch<ItemsReducerAction>,
}

/** 默认的状态 */
const womState: WomState = {
    input: parseInput(''),
    currentIndex: 0,
    items: [],
    version: false
};

const dispatch = (_action: ItemsReducerAction) => { };

const WomContext: Context<WomContextType> = createContext({ womState, dispatch });

export {
    womState as defaultState,
    WomContext
}
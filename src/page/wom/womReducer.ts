/// 迁移状态逻辑至 Reducer 中：将 useState 重构成 useReducer
/// 当 state 修改的方式高度相似时，用 reducer 可减少代码量
/// 当 state 更新逻辑复杂时，用 reducer 有较高的可读性
/// 将 state 和特定组件解耦合，方便调试测试，也可以配合 Context 深层传递参数

import { ItemDescriptor, ItemState, triggerItem } from "./executer";
import { Input } from "./inputer";

/** 定义状态 */
interface WomState {
    input: Input,
    currentIndex: number,
    items: ItemState[],
}

/** 更新状态的动作描述 */
interface ItemsReducerAction {
    type: string,
    items?: ItemDescriptor[];
    itemIndex?: number,
    input?: Input,
}

/** 是否允许切换至对应的 action */
const movableAction = (actions: string[], nextActionIndex: number): boolean => {
    return nextActionIndex >= 0 && nextActionIndex < actions.length;  // 不需要判断 !!actionsLen
}

/** 安全地切换 action */
const movedAction = (items: ItemState[], currentIndex: number, step: number): ItemState[] => {
    const currentItem = items[currentIndex];
    const nextActionIndex = currentItem.actionIndex + step;
    if (!movableAction(currentItem.actions, nextActionIndex)) {
        return items;
    }
    return items.map((item, i) => i === currentIndex ? { ...item, actionIndex: nextActionIndex } : item);
}

/** 安全地切换 item */
const movedItem = (womState: WomState, step: number): WomState => {
    const maxIndex = womState.items.length - 1;
    const nextIndex = womState.currentIndex + step;
    if (nextIndex < 0) {
        return { ...womState, currentIndex: maxIndex };
    } else if (nextIndex > maxIndex) {
        return { ...womState, currentIndex: 0 };
    } else {
        return { ...womState, currentIndex: nextIndex };
    }
}

/**
 * 使用 reducer 整合状态逻辑
 * @param womState 上一个状态
 * @param action 描述状态应该如何刷新
 * @returns 下一个状态
 */
function womReducer(womState: WomState, action: ItemsReducerAction): WomState {
    switch (action.type) {
        case 'init': {
            let newItems = action.items ? action.items.map(item => ({ ...item, actionIndex: 0 })) : [];
            let newInput = action.input || womState.input;
            return { input: newInput, currentIndex: 0, items: newItems };
        }
        case 'left': {
            let itemIndex = action.itemIndex || womState.currentIndex;
            return {
                ...womState,
                items: movedAction(womState.items, itemIndex, -1)
            }
        }
        case 'right': {
            let itemIndex = action.itemIndex || womState.currentIndex;
            return {
                ...womState,
                items: movedAction(womState.items, itemIndex, 1)
            }
        }
        case 'up': {
            return movedItem(womState, -1);
        }
        case 'down': {
            return movedItem(womState, 1);
        }
        case 'trigger': {
            // 这个没有改变渲染 其实不应该放在这 但是为了能全局使用又只能放在这
            let itemIndex = action.itemIndex || womState.currentIndex;
            let item = womState.items[itemIndex]
            triggerItem(item, womState.input.arg);
            return womState;
        }
        default: {
            return womState;
        }
    }
}

export {
    womReducer, movedAction, movedItem
}

export type {
    WomState, ItemsReducerAction
}
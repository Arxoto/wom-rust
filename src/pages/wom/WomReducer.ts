/// 迁移状态逻辑至 Reducer 中：将 useState 重构成 useReducer
/// 当 state 修改的方式高度相似时，用 reducer 可减少代码量
/// 当 state 更新逻辑复杂时，用 reducer 有较高的可读性
/// 将 state 和特定组件解耦合，方便调试测试，也可以配合 Context 深层传递参数

import { safetyTrigger } from "../../core/womExecuter";
import { Input } from "../../core/womInputer";
import { ItemExtend } from "../../core/womItem";

/** 定义状态 */
interface WomState {
    input: Input,
    currentIndex: number,
    items: ItemExtend[],
}

/** 更新状态的动作描述 */
interface ItemsReducerAction {
    type: string,
    items?: ItemExtend[];
    itemIndex?: number,
    input?: Input,
}

/** 安全地切换 action */
const movedAction = (items: ItemExtend[], currentIndex: number, step: number): ItemExtend[] => {
    if (items.length <= currentIndex) {
        return items;
    }
    const currentItem = items[currentIndex];
    const next = currentItem.action_index + step;
    if (0 <= next && next < currentItem.action_list.length) {
        return items.map((item, i) => i === currentIndex ? { ...item, action_index: next } : item);
    }
    return items;
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
            let newItems = action.items ? action.items : [];
            let newInput = action.input ?? womState.input;
            return { input: newInput, currentIndex: 0, items: newItems };
        }
        case 'left': {
            let itemIndex = action.itemIndex ?? womState.currentIndex;
            return {
                ...womState,
                items: movedAction(womState.items, itemIndex, -1)
            }
        }
        case 'right': {
            let itemIndex = action.itemIndex ?? womState.currentIndex;
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
            let itemIndex = action.itemIndex ?? womState.currentIndex;
            let item = womState.items[itemIndex]
            safetyTrigger(item, womState.input.arg);
            return womState;
        }
        default: {
            return womState;
        }
    }
}

export {
    womReducer
}

export type {
    WomState, ItemsReducerAction
}
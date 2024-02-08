import { invoke } from "@tauri-apps/api/tauri";
import { ItemCommon, ItemExtend } from "./womItem";
import { actions } from "./womExecuter";

// ========= config =========

interface ValueRuler<T> {
    the_default: T,
    the_options?: T[],
}

interface ConfigRuler {
    global_shortcut: ValueRuler<string>,
    window_width: ValueRuler<number>,
    window_height: ValueRuler<number>,
}

interface ConfigCurrent {
    global_shortcut: string,
    window_width: number,
    window_height: number,
}

export const configRuler = (): Promise<ConfigRuler> => invoke('config_ruler');
export const configCurrent = (): Promise<ConfigCurrent> => invoke('config_current');

// ========= item =========

export const searchItem = async (keyword: string, hasArgs: boolean): Promise<ItemExtend[]> => {
    let items: ItemCommon[] = await invoke('search_item', { keyword, hasArgs });
    return items.map(item => ({
        ...item.the_base,
        ...item,
        action_list: actions(item.the_base.the_type),
        action_index: 0,
    }))
}
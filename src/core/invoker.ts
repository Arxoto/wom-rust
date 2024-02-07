import { invoke } from "@tauri-apps/api/tauri";

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

interface ItemBase {
    the_type: string,
    title: string,
    detail: string,
}

interface ItemCommon {
    the_base: ItemBase,
    the_key: string,
    with_args: boolean,
}

interface ItemExtend {
    the_type: string,
    title: string,
    detail: string,
    the_key: string,
    with_args: boolean,
    action_list: string[],
    action_index: number,
}

const a4oc = ['open', 'copy'];
const a4osc = ['open', 'select', 'copy'];
const a4empty: string[] = [''];

const actions = (the_type: string) => {
    switch (the_type) {
        case "folder":
            return a4oc;
        case "files":
        case "app":
            return a4osc;
        default:
            return a4empty;
    }
}

export const searchItem = async (keyword: string, hasArgs: boolean): Promise<ItemExtend[]> => {
    let items: ItemCommon[] = await invoke('search_item', { keyword, hasArgs });
    return items.map(item => ({
        ...item.the_base,
        ...item,
        action_list: actions(item.the_base.the_type),
        action_index: 0,
    }))
}
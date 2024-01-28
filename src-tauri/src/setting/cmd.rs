use super::{core::ItemCommon, search::search};

#[tauri::command]
pub fn search_item(keyword: &str, has_args: bool, item_state: tauri::State<Vec<ItemCommon>>) -> Vec<ItemCommon> {
    search(&item_state, keyword, has_args)
}
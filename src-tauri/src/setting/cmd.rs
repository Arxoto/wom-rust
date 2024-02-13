use super::{
    init::SettingStateMutex,
    search::{search, FindedItems},
};

#[tauri::command]
pub fn search_item(
    keyword: &str,
    has_args: bool,
    item_state: tauri::State<SettingStateMutex>,
) -> Result<FindedItems, String> {
    item_state
        .items
        .lock()
        .map(|items| *search(&items, &keyword.to_ascii_lowercase(), has_args))
        .map_err(|_| "item_state lock failed".to_string())
}

use super::{
    core::{ConfigCurrent, ConfigRuler},
    init::ConfigState,
};

#[tauri::command]
pub fn config_ruler(config_state: tauri::State<ConfigState>) -> ConfigRuler {
    config_state.ruler.clone()
}

#[tauri::command]
pub fn config_current(config_state: tauri::State<ConfigState>) -> Result<ConfigCurrent, String> {
    config_state
        .currrent
        .lock()
        .map(|cs| cs.clone())
        .map_err(|_| "config_state lock failed".to_string())
}

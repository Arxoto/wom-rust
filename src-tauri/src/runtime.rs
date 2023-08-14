use std::path::PathBuf;

pub fn app_data_dir() -> Option<PathBuf> {
    tauri::api::path::data_dir().map(|dir| dir.join(".wom"))
}

pub fn app_data_path(sub_paths: Vec<&str>) -> Option<PathBuf> {
    let mut path = app_data_dir();
    for sub_path in sub_paths.iter() {
        path = path.map(|dir| dir.join(sub_path));
    }
    path
}

pub fn db_path() -> Option<PathBuf> {
    app_data_path(vec!["wom.db"])
}

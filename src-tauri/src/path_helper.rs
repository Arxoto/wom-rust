use std::{
    fs::{read_dir, DirEntry},
    io,
    path::{Path, PathBuf},
};

pub const PUBLIC: &str = "public";
pub const HOME: &str = "home";
pub const DESKTOP: &str = "desktop";
pub const DOWNLOAD: &str = "download";
pub const DOCUMENT: &str = "document";
pub const AUDIO: &str = "audio";
pub const VIDEO: &str = "video";
pub const CACHE: &str = "cache";
pub const APP_CACHE: &str = "app_cache";
pub const LOCAL_DATA: &str = "local_data"; // same as cache in windows
pub const APP_LOCAL_DATA: &str = "app_local_data"; // same as app_cache in windows
pub const DATA: &str = "data";
pub const APP_DATA: &str = "app_data";
pub const CONFIG: &str = "config"; // same as data in windows
pub const APP_CONFIG: &str = "app_config"; // same as app_data in windwos
pub const APP_LOG: &str = "app_log";

fn path_from(app: &tauri::App, var: &str) -> Option<PathBuf> {
    match var {
        PUBLIC => tauri::api::path::public_dir(),
        HOME => tauri::api::path::home_dir(),
        DESKTOP => tauri::api::path::desktop_dir(),
        DOWNLOAD => tauri::api::path::download_dir(),
        DOCUMENT => tauri::api::path::document_dir(),
        AUDIO => tauri::api::path::audio_dir(),
        VIDEO => tauri::api::path::video_dir(),
        CACHE => tauri::api::path::cache_dir(),
        APP_CACHE => tauri::api::path::app_cache_dir(&app.config()),
        LOCAL_DATA => tauri::api::path::local_data_dir(),
        APP_LOCAL_DATA => tauri::api::path::app_local_data_dir(&app.config()),
        DATA => tauri::api::path::data_dir(),
        APP_DATA => tauri::api::path::app_data_dir(&app.config()),
        CONFIG => tauri::api::path::config_dir(),
        APP_CONFIG => tauri::api::path::app_config_dir(&app.config()),
        APP_LOG => tauri::api::path::app_log_dir(&app.config()),
        _ => None,
    }
}

pub fn path_format(app: &tauri::App, path_desc: &str) -> PathBuf {
    let path_split: Vec<&str> = path_desc.split("::").collect();
    if path_split.len() != 2 {
        return Path::new(path_desc).to_path_buf();
    }

    let tag = path_split[0];
    let sub_path = path_split[1];
    if let Some(pure_path) = path_from(app, tag) {
        pure_path.join(sub_path)
    } else {
        Path::new(path_desc).to_path_buf()
    }
}

/// (file_name, file_path)
pub type FileDesc = (String, String);

fn visit_dirs(dir: &PathBuf, into: bool, cb: &mut dyn FnMut(&DirEntry)) -> io::Result<()> {
    if dir.is_dir() {
        for entry in read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() && into {
                visit_dirs(&path, into, cb)?;
            } else if path.is_file() || path.is_symlink() {
                cb(&entry);
            }
        }
    }
    Ok(())
}

pub fn list_files(path: &PathBuf, into: bool, suffixs: &Vec<String>) -> Vec<FileDesc> {
    let mut ll: Vec<FileDesc> = Vec::new();
    if !path.is_dir() {
        return ll;
    }

    let _ = visit_dirs(path, into, &mut |entry| {
        if let Ok(file_name) = entry.file_name().into_string() {
            if let Ok(file_path) = entry.path().into_os_string().into_string() {
                for suffix in suffixs {
                    if file_name.ends_with(suffix) {
                        ll.push((file_name, file_path));
                        break;
                    }
                }
            }
        }
    });

    ll
}

pub fn list_files_by_path_desc(
    app: &tauri::App,
    path_desc: &str,
    into: bool,
    suffixs: &Vec<String>,
) -> Vec<FileDesc> {
    let path = path_format(app, path_desc);
    list_files(&path, into, suffixs)
}

#[cfg(test)]
mod tests {
    use std::path::Path;

    use super::list_files;

    #[test]
    fn test_path_robustness() {
        let path = Path::new(r#"test::AppData\Roaming"#).to_path_buf();
        assert_eq!(false, path.exists());
    }

    #[test]
    fn test_list_files() {
        let path = Path::new(r#"C:\Users\{user}\AppData\Local\Microsoft\WindowsApps"#).to_path_buf();
        let suffixs = vec![".exe".to_string()];
        let ll = list_files(&path, false, &suffixs);
        for l in ll {
            println!("{:?}", l);
        }
    }
}

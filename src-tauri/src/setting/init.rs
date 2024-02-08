use std::path::PathBuf;

use crate::path_helper::{list_files_by_path_desc, path_format};

use super::{
    core::{
        is_general_type, ItemBase, ItemCommon, ITEM_TYPE_APP, ITEM_TYPE_CMD, ITEM_TYPE_FILES,
        ITEM_TYPE_FOLDER, ITEM_TYPE_WEB, PLACEHOLDER_ARGS,
    },
    default::default_items,
    persistence::{load, save},
};

// todo CN_to_EN
pub fn to_key_by_default(title: &str) -> String {
    title.to_ascii_lowercase()
}

pub fn init(path: &PathBuf, to_key_fn: fn(&str) -> String, app: &tauri::App) -> Vec<ItemCommon> {
    let ibs = match load(path) {
        Ok(its) => its,
        Err(_) => {
            let its = default_items();
            let _ = save(path, &its);
            its
        }
    };

    let mut ics: Vec<ItemCommon> = ibs
        .iter()
        .filter(|item| is_general_type(&item.the_type))
        .map(|item| {
            let the_type = &item.the_type;
            let the_key = to_key_fn(&item.title);
            let with_args = (the_type == ITEM_TYPE_CMD || the_type == ITEM_TYPE_WEB)
                && item.detail.contains(PLACEHOLDER_ARGS);

            let mut the_base = item.clone();
            if the_type == ITEM_TYPE_APP || the_type == ITEM_TYPE_FOLDER {
                if let Ok(the_path) = path_format(app, &item.detail)
                    .into_os_string()
                    .into_string()
                {
                    the_base.detail = the_path;
                }
            }
            ItemCommon {
                the_base,
                the_key,
                with_args,
            }
        })
        .collect();

    // e.g. title: "inner.exe|lnk"
    let mut ifs: Vec<ItemCommon> = ibs
        .iter()
        .filter(|item| ITEM_TYPE_FILES == item.the_type)
        .map(|item| {
            let the_desc: Vec<&str> = item.title.split('.').collect();
            if the_desc.len() != 2 {
                return Vec::new();
            }
            let into = match the_desc[0] {
                "inner" => true,
                "outer" => false,
                _ => return Vec::new(),
            };
            let suffixs: Vec<String> = the_desc[1]
                .split("|")
                .map(|suffix| format!(".{}", suffix))
                .collect();
            let path_desc = &item.detail;
            list_files_by_path_desc(app, path_desc, into, &suffixs)
        })
        .flatten()
        .map(|(file_name, file_path)| {
            let the_key = to_key_fn(&file_name);
            ItemCommon {
                the_base: ItemBase {
                    the_type: ITEM_TYPE_FILES.to_string(),
                    title: file_name,
                    detail: file_path,
                },
                the_key,
                with_args: false,
            }
        })
        .collect();
    ics.append(&mut ifs);

    ics
}

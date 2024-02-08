use super::core::ItemBase;

macro_rules! new_item {
    ($the_type:expr, $title:expr, $detail:expr) => {
        ItemBase {
            the_type: $the_type.to_string(),
            title: $title.to_string(),
            detail: $detail.to_string(),
        }
    };
}

pub fn default_items() -> Vec<ItemBase> {
    vec![
        // cmd
        new_item!("cmd", "ipconfig", "ipconfig"),
        new_item!(
            "cmd",
            "mklink_folder",
            r#"mklink /d "Link" "Target_Folder""#
        ),
        new_item!("cmd", "port_search", r#"netstat -ano|findstr "{}""#),
        new_item!("cmd", "process_list", r#"tasklist|findstr "{}""#),
        new_item!("cmd", "process_kill", r#"taskkill /pid "{}" /f /t"#),
        // web
        new_item!("web", "github", "https://github.com/"),
        new_item!("web", "git_search", "https://github.com/search?q={}"),
        // app
        new_item!("app", "remote", "mstsc"),
        new_item!("app", "calc", "calc"),
        // folder
        new_item!("folder", "hosts", r#"C:\Windows\System32\drivers\etc"#),
        new_item!(
            "folder",
            "startup_os",
            r#"C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp"#
        ),
        new_item!(
            "folder",
            "startup_user",
            r#"home::AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup"#
        ),
        // files
        new_item!(
            "files",
            "outer.exe|lnk",
            r#"home::AppData\Local\Microsoft\WindowsApps"#
        ),
        new_item!(
            "files",
            "inner.exe|lnk",
            r#"C:\ProgramData\Microsoft\Windows\Start Menu\Programs"#
        ),
        new_item!(
            "files",
            "inner.exe|lnk",
            r#"home::AppData\Roaming\Microsoft\Windows\Start Menu\Programs"#
        ),
    ]
}

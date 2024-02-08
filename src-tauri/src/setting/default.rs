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
            "mklink directory",
            r#"mklink /d "Link" "Target_Folder""#
        ),
        new_item!("cmd", "port Search", r#"netstat -ano|findstr "{}""#),
        new_item!("cmd", "process List", r#"tasklist|findstr "{}""#),
        new_item!("cmd", "process Kill", r#"taskkill /pid "{}" /f /t"#),
        // web
        new_item!("web", "github", "https://github.com/"),
        new_item!("web", "YouTube", "https://www.youtube.com/"),
        new_item!("web", "Bilibili", "https://www.bilibili.com/"),
        new_item!("web", "github Search", "https://github.com/search?q={}"),
        new_item!("web", "YouTube Search", "https://www.youtube.com/results?search_query={}"),
        new_item!("web", "Bilibili Search", "https://search.bilibili.com/all?keyword={}"),
        new_item!("web", "bn Search", "https://www.bing.com/search?q={}"),
        new_item!("web", "gg Search", "https://www.google.com/search?q={}"),
        new_item!("web", "zh Search", "https://www.zhihu.com/search?type=content&q={}"),
        new_item!("web", "icon Search", "https://www.iconfont.cn/search/index?searchType=icon&q={}"),
        // app
        new_item!("app", "calc", "calc"),
        new_item!("app", "wTerminal", "wt"),
        new_item!("app", "remote", "mstsc"),
        // folder
        new_item!("folder", "hosts", r#"C:\Windows\System32\drivers\etc"#),
        new_item!(
            "folder",
            "StartUp OS",
            r#"C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp"#
        ),
        new_item!(
            "folder",
            "StartUp User",
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

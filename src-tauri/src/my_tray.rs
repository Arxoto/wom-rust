use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
};

pub fn system_tray() -> SystemTray {
    // 这里 `"quit".to_string()` 定义菜单项 ID，第二个参数是菜单项标签。
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let tray_menu = SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(show)
        .add_item(hide);
    SystemTray::new().with_menu(tray_menu)
}

pub fn on_system_tray_event(app: &tauri::AppHandle, event: tauri::SystemTrayEvent) {
    // 在 tauri.conf.json 里的 tauri.windows[].label
    let window = app.get_window("main").unwrap();
    // // switch visible
    // window
    //     .is_visible()
    //     .and_then(|is_visible| {
    //         if is_visible {
    //             window.hide()
    //         } else {
    //             window.show().and_then(|()| window.set_focus())
    //         }
    //     })
    //     .unwrap();
    
    match event {
        SystemTrayEvent::LeftClick { .. } => {
            window.show().and_then(|()| window.set_focus()).unwrap();
        }
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "quit" => {
                std::process::exit(0);
            }
            "show" => {
                window.show().and_then(|()| window.set_focus()).unwrap();
            }
            "hide" => {
                window.hide().unwrap();
            }
            _ => {}
        },
        _ => {}
    }
}

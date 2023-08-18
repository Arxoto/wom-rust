use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

pub fn system_tray() -> SystemTray {
    SystemTray::new().with_menu(
        SystemTrayMenu::new()
            .add_item(CustomMenuItem::new("show", "Show"))
            .add_item(CustomMenuItem::new("hide", "Hide"))
            .add_native_item(SystemTrayMenuItem::Separator)
            .add_item(CustomMenuItem::new("register", "register global shortcut"))
            .add_item(CustomMenuItem::new("unregister", "unregister"))
            .add_native_item(SystemTrayMenuItem::Separator)
            .add_item(CustomMenuItem::new("quit", "Quit"))
    )
}

pub fn on_system_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    // 在 tauri.conf.json 里的 tauri.windows[].label
    let window = app.get_window("main").unwrap();

    match event {
        SystemTrayEvent::LeftClick { .. } => {
            window.show().and_then(|()| window.set_focus()).unwrap();
        }
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "quit" => {
                std::process::exit(0);
            }
            "show" => {
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            "hide" => {
                window.hide().unwrap();
            }
            "register" => {
                window.emit("register", ()).unwrap();
            }
            "unregister" => {
                window.emit("unregister", ()).unwrap();
            }
            _ => {}
        },
        _ => {}
    }
}

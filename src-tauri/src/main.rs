// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;
mod event;
mod path_helper;
mod setting;

use config::core::{CONFIG_FILE, MAIN_WINDOW_LABEL, SETTING_FILE};
use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

use event::MAIN_EVENT;

fn new_system_tray() -> SystemTray {
    SystemTray::new().with_menu(
        SystemTrayMenu::new()
            .add_item(CustomMenuItem::new("center", "BeCenter"))
            .add_native_item(SystemTrayMenuItem::Separator)
            .add_item(CustomMenuItem::new("register", "register global shortcut"))
            .add_item(CustomMenuItem::new("unregister", "unregister"))
            .add_native_item(SystemTrayMenuItem::Separator)
            .add_item(CustomMenuItem::new("quit", "Quit")),
    )
}

fn on_system_tray_event(app: &AppHandle, event: SystemTrayEvent) -> tauri::Result<()> {
    match event {
        SystemTrayEvent::LeftClick { .. } => {
            if let Some(w) = app.get_window(MAIN_WINDOW_LABEL) {
                w.show()?;
                w.set_focus()
            } else {
                Err(tauri::Error::WebviewNotFound)
            }
        }
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "quit" => {
                app.exit(0);
                Ok(())
            }
            "center" => {
                if let Some(w) = app.get_window(MAIN_WINDOW_LABEL) {
                    w.center()
                } else {
                    Err(tauri::Error::WebviewNotFound)
                }
            }
            "register" => app.emit_to(MAIN_WINDOW_LABEL, MAIN_EVENT.do_global_shortcut, ()),
            "unregister" => app.emit_to(MAIN_WINDOW_LABEL, MAIN_EVENT.un_global_shortcut, ()),
            _ => Ok(()),
        },
        _ => Ok(()),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            config::cmd::config_ruler,
            config::cmd::config_current,
            setting::cmd::search_item,
        ])
        .system_tray(new_system_tray())
        .on_system_tray_event(|app, event| match on_system_tray_event(app, event) {
            Ok(()) => (),
            Err(_) => todo!(),
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                // hide window when request close
                if event.window().label() == MAIN_WINDOW_LABEL {
                    api.prevent_close();
                    let _ = event.window().hide();
                }
            }
            #[cfg(not(debug_assertions))]
            tauri::WindowEvent::Focused(_focused) => {
                // hide window whenever it loses focus
                if !_focused && event.window().label() == MAIN_WINDOW_LABEL {
                    let _ = event.window().hide();
                }
            }
            _ => {}
        })
        .setup(|app| {
            // build main window
            let w = tauri::WindowBuilder::new(
                app,
                MAIN_WINDOW_LABEL,
                tauri::WindowUrl::App("index.html".into()),
            )
            .title("wom")
            .decorations(false) // 原生框架
            .transparent(true) // 透明
            .fullscreen(false) // 全屏
            .resizable(false) // 大小可变
            .center() // 居中
            .always_on_top(true) // 置顶
            .visible(false) // 可见
            .build()
            .expect("build main windows failed");

            #[cfg(debug_assertions)]
            {
                w.show()?;
                w.set_focus()?;
                w.set_always_on_top(false)?;
            }

            // load persistent files
            let base_path = app
                .path_resolver()
                .app_data_dir()
                .ok_or("failed to get dir")?;
            if !base_path.exists() {
                std::fs::create_dir_all(&base_path)
                    .map_err(|_| "failed to create app config dir")?;
            }

            // load config
            let config_path = base_path.join(CONFIG_FILE);
            let config_state = config::init::init(&config_path);
            app.manage(config_state);

            // load setting
            let setting_path = base_path.join(SETTING_FILE);
            let setting_state =
                setting::init::init(&setting_path, setting::init::to_key_by_default, &app);
            app.manage(setting_state);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

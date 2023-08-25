// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod my_tray;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// todo
/// 开机启动 https://github.com/tauri-apps/plugins-workspace/tree/v1/plugins/autostart
/// 单例启动 https://github.com/tauri-apps/plugins-workspace/tree/v1/plugins/single-instance
/// db       https://github.com/tauri-apps/plugins-workspace/tree/v1/plugins/sql
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .system_tray(my_tray::system_tray())
        .on_system_tray_event(my_tray::on_system_tray_event)
        .invoke_handler(tauri::generate_handler![greet])
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                if event.window().label().eq("main") {
                    event.window().hide().unwrap();
                    api.prevent_close();
                }
            }
            // dev
            // tauri::WindowEvent::Focused(focused) => {
            //     if event.window().label().eq("main") && !focused {
            //         event.window().hide().unwrap();
            //     }
            // }
            _ => {}
        })
        // .build(tauri::generate_context!())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

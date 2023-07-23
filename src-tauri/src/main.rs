// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod my_tray;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    // dev
    // "title": "wom",
    // "fullscreen": false,
    // "resizable": false,
    // "width": 800,
    // "height": 600,
    // "center": true,
    // "alwaysOnTop": true,
    // "visible": false

    tauri::Builder::default()
        .system_tray(my_tray::system_tray())
        .on_system_tray_event(my_tray::on_system_tray_event)
        .invoke_handler(tauri::generate_handler![greet])
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            // dev
            // tauri::WindowEvent::Focused(is_focused) => {
            //     if !is_focused {
            //         event.window().hide().unwrap();
            //     }
            // }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

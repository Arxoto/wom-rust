// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::platform::{shell_execute, shutdown_power, open_folder_and_select_items};

mod my_tray;
mod platform;

/// 开机启动 https://github.com/tauri-apps/plugins-workspace/tree/v1/plugins/autostart
/// 单例启动 https://github.com/tauri-apps/plugins-workspace/tree/v1/plugins/single-instance
/// db       https://github.com/tauri-apps/plugins-workspace/tree/v1/plugins/sql
/// 
/// pnpm tauri dev
/// pnpm tauri build
///     not used  set http_proxy=http://127.0.0.1:10809
///     not used  set https_proxy=http://127.0.0.1:10809
/// 
/// https://github.com/tauri-apps/tauri/blob/dev/tooling/bundler/src/bundle/windows/msi.rs#L28
/// https://github.com/tauri-apps/tauri/blob/dev/tooling/bundler/src/bundle/windows/msi/wix.rs#L33
/// https://github.com/tauri-apps/tauri/blob/dev/tooling/bundler/src/bundle/windows/nsis.rs#L47
/// 下载 WIX_URL NSIS_URL NSIS_APPLICATIONID_URL NSIS_TAURI_UTILS
/// %LocalAppData%
/// mkdir .\tauri\WixTools .\tauri\NSIS
/// %LocalAppData%\tauri\WixTools  解压 wix311-binaries.zip 至目录下
/// %LocalAppData%\tauri\NSIS      解压 nsis-3.zip 至目录下
/// %LocalAppData%\tauri\NSIS\Plugins\x86-unicode      复制 NSIS-ApplicationID.zip/ReleaseUnicode/ApplicationID.dll 至目录下
/// %LocalAppData%\tauri\NSIS\Plugins\x86-unicode      复制 nsis_tauri_utils.dll 至目录下

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .system_tray(my_tray::system_tray())
        .on_system_tray_event(my_tray::on_system_tray_event)
        .invoke_handler(tauri::generate_handler![shell_execute, shutdown_power, open_folder_and_select_items])
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

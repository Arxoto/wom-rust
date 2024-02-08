// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;
mod event;
mod path_helper;
mod platform;
mod setting;

use config::core::{CONFIG_FILE, MAIN_WINDOW_LABEL, SETTING_FILE};
use tauri::{
    AppHandle, CustomMenuItem, Manager, Runtime, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

use event::MAIN_EVENT;

fn build_main_window<R: Runtime, M: Manager<R>>(
    manager: &M,
    width: f64,
    height: f64,
) -> Result<(), tauri::Error> {
    let w = tauri::WindowBuilder::new(
        manager,
        MAIN_WINDOW_LABEL,
        tauri::WindowUrl::App("index.html".into()),
    )
    .title("wom")
    .decorations(false) // 原生框架
    .transparent(true) // 透明
    .fullscreen(false) // 全屏
    .resizable(false) // 大小可变
    .inner_size(width, height)
    .center() // 居中
    .always_on_top(true) // 置顶
    .visible(false) // 可见
    .build()?;

    #[cfg(debug_assertions)]
    {
        w.show()?;
        w.set_focus()?;
        w.set_always_on_top(false)?;
    }
    Ok(())
}

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
            // 这里因为app所有权的原因不宜用 app.global_shortcut_manager()
            "register" => app.emit_to(MAIN_WINDOW_LABEL, MAIN_EVENT.do_global_shortcut, ()),
            "unregister" => app.emit_to(MAIN_WINDOW_LABEL, MAIN_EVENT.un_global_shortcut, ()),
            _ => Ok(()),
        },
        _ => Ok(()),
    }
}

/// ========= package =========
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
///
///
/// ========= todo =========
///
/// 完善command能力
/// 设置页面  wom item
/// 配置页面  快捷键 窗口大小 样式
/// 在App中实现动态主题 如 document.documentElement.style.setProperty(`--color-xxx`, 'black');  需要注意黑暗主题可能会导致白色闪瞎眼 可考虑延迟显示窗口
///
/// 根据编译原理使用rust手写计算器  文法消除左递归及提取左公因子 递归下降分析器 ...
/// 中文转拼音
///
/// 根据主窗口适配有无窗口框架 或者实现简单框架(offspring)
/// 内置页面  调色盘 编码转换 富文本便签(contenteditable)
/// 联动或者页面  OCR接口（ShareX_or_Umi-OCR）、翻译接口（寻找api）、密码箱（加密算法/明文提示）
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            config::cmd::config_ruler,
            config::cmd::config_current,
            setting::cmd::search_item,
            platform::shutdown_power,
            platform::open_folder_and_select_items,
            platform::shell_execute,
        ])
        .system_tray(new_system_tray())
        .on_system_tray_event(|app, event| match on_system_tray_event(app, event) {
            Ok(()) => (),
            Err(_) => todo!(),
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                // hide window when request close
                // 在主窗口直接w.close()好像拦截不到
                if event.window().label() == MAIN_WINDOW_LABEL {
                    api.prevent_close();
                    let _ = event.window().hide();
                }
            }
            #[cfg(not(debug_assertions))]
            tauri::WindowEvent::Focused(focused) => {
                // hide window whenever it loses focus
                if !focused && event.window().label() == MAIN_WINDOW_LABEL {
                    let _ = event.window().hide();
                }
            }
            _ => {}
        })
        .setup(|app| {
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
            let config_current = config_state
                .currrent
                .lock()
                .expect("fetch config_current failed")
                .clone();
            app.manage(config_state);

            // load setting
            let setting_path = base_path.join(SETTING_FILE);
            let setting_state =
                setting::init::init(&setting_path, setting::init::to_key_by_default, &app);
            app.manage(setting_state);

            build_main_window(
                app,
                config_current.window_width,
                config_current.window_height,
            )?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

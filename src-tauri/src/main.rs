// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;
mod event;
mod path_helper;
mod platform;
mod setting;

use std::sync::Mutex;

use tauri::{
    AppHandle, CustomMenuItem, Manager, Runtime, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

use config::{core::MAIN_WINDOW_LABEL, init::ConfigStateMutex};
use event::MAIN_EVENT;
use path_helper::{get_base_path, get_config_path, get_setting_path};
use setting::init::SettingStateMutex;

#[tauri::command]
async fn build_a_window(
    app_handle: tauri::AppHandle,
    label: String,
    url: String,
    title: String,
) -> Result<(), tauri::Error> {
    // to use `window.__TAURI__` in js
    // Be sure to set `build.withGlobalTauri` in `tauri.conf.json` to true

    // to load file://asset
    // set `tauri.allowlist.protocol` to `{"asset": true, "assetScope": ["**"]}`
    // see https://tauri.app/zh-cn/v1/api/js/tauri/#convertfilesrc

    // allow external or file://asset to use `window.__TAURI__`
    // set `tauri.security.dangerousRemoteDomainIpcAccess`
    // see https://tauri.app/zh-cn/v1/api/config/#securityconfig.dangerousremotedomainipcaccess
    // set `tauri.security.dangerousRemoteDomainIpcAccess.[].domain` to `asset.localhost` in Windows
    // P.S., Windows url is `https://asset.localhost`, MacOS url maybe `asset://localhost`

    // let _w = tauri::WindowBuilder::new(
    //     &app_handle,
    //     "external", /* the unique window label */
    //     tauri::WindowUrl::External("https://tauri.app/".parse().unwrap()),
    // )
    // .build()?;

    if let Some(w) = app_handle.get_window(&label) {
        // w.close()?;
        // 关闭后不能马上新建  a window with label `xxx` already exists
        // 在js中这么用没事

        w.show()?;
        w.set_focus()?;
        return Ok(());
    }
    // cannot use window.__TAURI__ in iframe, see https://github.com/tauri-apps/tauri/issues/6204
    let _w = tauri::WindowBuilder::new(&app_handle, &label, tauri::WindowUrl::App(url.into()))
        .title(title)
        // .decorations(false)
        // .transparent(true)
        // .visible(false)
        .center()
        // load file to str  注意 preload 中直接获取 window.__TAURI__ 是 undefined 需要 setTimeout 0 延后下
        .initialization_script(include_str!("./preload.js"))
        .build()?;
    Ok(())
}

fn build_main_window<R: Runtime, M: Manager<R>>(
    manager: &M,
    width: f64,
    height: f64,
) -> Result<(), tauri::Error> {
    let _w = tauri::WindowBuilder::new(
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

    // _w.open_devtools(); // add features "devtools" in Cargo.toml if debug in release

    #[cfg(debug_assertions)]
    {
        _w.show()?;
        _w.set_focus()?;
        _w.set_always_on_top(false)?;
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
            .add_item(CustomMenuItem::new("reload", "Reload Setting"))
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
            "reload" => {
                if let Some(base_path) = get_base_path(app) {
                    let setting_path = get_setting_path(&base_path);
                    let setting_items =
                        setting::init::init(&setting_path, setting::init::to_key_by_default, app);

                    if let Some(setting_state) = app.try_state::<SettingStateMutex>() {
                        if let Ok(mut items) = setting_state.items.lock() {
                            *items = setting_items;
                        }
                    }
                }
                Ok(())
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
/// js中console.*规范
/// js中增加try保护
/// item支持自动横向滚动
/// 可通过 rref.scrollLeft + rref.clientWidth === rref.scrollWidth 实现
/// setInterval 100 rref.scrollLeft++  setTimeout 400 turn left
/// 但是不知为何后两个总是恒等于 应该与样式有关 待研究
///
/// 设置页面  wom item
/// 配置页面  快捷键 窗口大小 样式
///
/// 根据编译原理使用rust手写计算器  文法消除左递归及提取左公因子 递归下降分析器 ...
/// todo 该复习下编译原理了
/// 可以用ANTLR4生成lexer和parser 或者生成其他语言学习后转成rust
///
/// 汉语转拼音（遥遥无期 懒）
///     模式 normal普通 surname姓名（不知道咋实现）
///     风格 normal无声调 tone声调再韵母第一个字母上
/// 可基于以下两个库实现
///     汉字  https://github.com/mozillazg/pinyin-data
///     词语  https://github.com/mozillazg/phrase-pinyin-data/
/// 方案一（完整分词）（参考pinyin-pro的算法）（tips: algorithm 一般是计算机领域 arithmetic 一般是数学领域）：
///     database 构建字词对拼音的映射关系（多音字的话是集合）
///     algorithm 假设最长的词的长度为n 先取前n个字视为一个词 进行查找 若找不到再取n-1个字
/// 方案二（最短分词）：
///     database 将词分割为字 依次映射最后是拼音（树） 若中途遇到分词一致且拼音一致的情况直接跳过（如果是实现完整分词的话就不跳）
///     algorithm 从前向后依次遍历 若后一个字无法再子树中找到 则把前面的视为一个词
///     特殊情况 假设abcd、ab有拼音 abc没有 需要查找的短句为abce  这时候遍历发现e不在c的子树里 而abc不是词 这时候需要回溯至ab
///
/// 截图贴图
/// 使用 cpp 参考 ScreenCapture 基于 Skia 实现截图绘制工具 打开即表示开始截图
/// 图片管理、贴图、OCR、翻译、上传 等能力基于插件实现
///
/// 插件框架
/// 规范的基础信息i18n（id、hash、名称、版本、作者、描述、原址、图标、依赖）
/// 入口文件
///     关键字搜索、个性化搜索&优先级、允许返回多个结果
///     多种触发方式：打开应用、剪贴板、独立窗口、网络请求。。
///     插件间 pipeline
///     通用配置页面
///     定时任务
///     注册全局快捷键
///     持久化存储 明文/加密
///     应用生命周期 hook
/// 插件市场&服务器
/// 插件实现方案（系统命令、脚本注入、显示自定义资源）
///     initialization_script+withGlobalTauri 实测不行脚本中无法找到 window.__TAURI__ 且如何打开外部html也是个难题
///     iframe 也许可以通过 iframe.contentWindow 挂载系统命令 但是在 react 框架下无法做到
///     也许可以参考 https://github.com/tauri-apps/tauri/issues/5682
///
/// 内置页面  调色盘 编码转换 富文本便签(contenteditable)
/// 联动或者页面  OCR接口（ShareX_or_Umi-OCR）、翻译接口（寻找api）、密码箱（加密算法/明文提示）
///
///
/// ========= undo =========
///
/// 显示文件图标  参考 extract-file-icon 将图片数据写入到缓存文件中 然后显示
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            config::cmd::config_ruler,
            config::cmd::config_current,
            setting::cmd::search_item,
            platform::shutdown_power,
            platform::open_folder_and_select_items,
            platform::shell_execute,
            build_a_window,
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
            let base_path = get_base_path(&app.handle()).ok_or("failed to get dir".to_string())?;
            if !base_path.exists() {
                std::fs::create_dir_all(&base_path)
                    .map_err(|_| "failed to create app config dir")?;
            }

            // load config
            let config_path = get_config_path(&base_path);
            let config_state = config::init::init(&config_path);
            let window_width = config_state.currrent.window_width;
            let window_height = config_state.currrent.window_height;
            // 运行时能被修改  详见 app.manage<T>(&self, state: T) -> bool
            app.manage(ConfigStateMutex {
                ruler: config_state.ruler,
                currrent: Mutex::new(config_state.currrent),
            });

            // load setting
            let setting_path = get_setting_path(&base_path);
            let setting_items = setting::init::init(
                &setting_path,
                setting::init::to_key_by_default,
                &app.handle(),
            );
            app.manage(SettingStateMutex {
                items: Mutex::new(setting_items),
            });

            build_main_window(app, window_width, window_height)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

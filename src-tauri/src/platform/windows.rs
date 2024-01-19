use windows::{
    core::{w, HSTRING},
    Win32::{
        System::Com::{CoInitialize, CoUninitialize},
        UI::{
            Shell::{ILCreateFromPathW, SHOpenFolderAndSelectItems, ShellExecuteW},
            WindowsAndMessaging::{SW_HIDE, SW_SHOW},
        },
    },
};

#[tauri::command]
pub fn open_folder_and_select_items(path: String) {
    unsafe {
        _ = CoInitialize(None).and_then(|()| {
            // let pszpath = windows::core::h!("something");
            let pszpath = &windows::core::HSTRING::from(path);
            let pidlfolder = ILCreateFromPathW(pszpath);
            let result = SHOpenFolderAndSelectItems(pidlfolder, None, 0);
            // or shell_execute open dir when failed

            CoUninitialize();
            result
        });
    }
}

#[tauri::command]
pub fn shutdown_power(action: String) {
    match action.as_str() {
        "hibernate" => unsafe {
            ShellExecuteW(None, None, w!("shutdown"), w!("-h"), None, SW_HIDE);
        },
        "restart" => unsafe {
            ShellExecuteW(None, None, w!("shutdown"), w!("-r -t 0"), None, SW_HIDE);
        },
        "shutdown" => unsafe {
            ShellExecuteW(None, None, w!("shutdown"), w!("-s -t 0"), None, SW_HIDE);
        },
        _ => {}
    }
}

#[tauri::command]
pub fn shell_execute(file: String) {
    let file = &HSTRING::from(file);

    // see operation in https://learn.microsoft.com/en-us/windows/win32/api/shellapi/nf-shellapi-shellexecutew
    // see showcmd in https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindow
    unsafe {
        ShellExecuteW(None, None, file, None, None, SW_SHOW);
    }
}

// unsafe extern "system" fn hook_callback(
//     code: i32,
//     w_param: windows::Win32::Foundation::WPARAM,
//     l_param: windows::Win32::Foundation::LPARAM,
// ) -> windows::Win32::Foundation::LRESULT {
//     if code == windows::Win32::UI::WindowsAndMessaging::HC_ACTION as i32 {
//         let pkh = std::mem::transmute::<
//             windows::Win32::Foundation::LPARAM,
//             *const windows::Win32::UI::WindowsAndMessaging::KBDLLHOOKSTRUCT,
//         >(l_param);
//         if w_param.0 == windows::Win32::UI::WindowsAndMessaging::WM_KEYDOWN as usize
//             || w_param.0 == windows::Win32::UI::WindowsAndMessaging::WM_SYSKEYDOWN as usize
//         {
//             if ((*pkh).vkCode as u16) == windows::Win32::UI::Input::KeyboardAndMouse::VK_SPACE.0 {
//                 // 用 GetAsyncKeyState 判断高阶位是否为1 失败 c是可以的 可能是rust用法不对
//                 if (*pkh).flags == windows::Win32::UI::WindowsAndMessaging::LLKHF_ALTDOWN {
//                     // println!("Alt + Space");
//                     // do something
//                     return windows::Win32::Foundation::LRESULT(1);
//                 }
//             }
//         }
//     }

//     windows::Win32::UI::WindowsAndMessaging::CallNextHookEx(None, code, w_param, l_param)
// }

// pub fn do_hook() -> windows::core::Result<windows::Win32::UI::WindowsAndMessaging::HHOOK> {
//     unsafe {
//         windows::Win32::UI::WindowsAndMessaging::SetWindowsHookExA(
//             windows::Win32::UI::WindowsAndMessaging::WH_KEYBOARD_LL,
//             Some(hook_callback),
//             None,
//             0,
//         )
//     }
// }

// pub fn un_hook(
//     hook_id_result: windows::core::Result<windows::Win32::UI::WindowsAndMessaging::HHOOK>,
// ) {
//     let _ = hook_id_result.map(|hook_id| unsafe {
//         windows::Win32::UI::WindowsAndMessaging::UnhookWindowsHookEx(hook_id)
//     });
// }

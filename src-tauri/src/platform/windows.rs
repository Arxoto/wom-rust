use windows::{
    core::w,
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
    let file = &windows::core::HSTRING::from(file);

    // see operation in https://learn.microsoft.com/en-us/windows/win32/api/shellapi/nf-shellapi-shellexecutew
    // see showcmd in https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindow
    unsafe {
        ShellExecuteW(None, None, file, None, None, SW_SHOW);
    }
}

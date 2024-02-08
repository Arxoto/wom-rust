#[cfg(target_os = "windows")]
#[path = "platform/windows.rs"]
mod platform;

pub(crate) use self::platform::*;

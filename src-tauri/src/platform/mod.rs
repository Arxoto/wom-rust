#[cfg(target_os = "windows")]
#[path = "windows.rs"]
mod platform;

pub(crate) use self::platform::*;
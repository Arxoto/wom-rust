use std::{path::PathBuf, sync::Mutex};

use super::{
    core::{ConfigCurrent, ConfigOrigin, ConfigRuler},
    default::default_config_ruler,
    persistence::{load, save},
};

pub struct ConfigState {
    pub ruler: ConfigRuler,
    pub currrent: Mutex<ConfigCurrent>,
}

pub fn init(path: &PathBuf) -> ConfigState {
    let config_ruler = default_config_ruler();

    match load(path) {
        Ok(config_origin) => {
            let (modify, config_current) = config_origin.generate_current(&config_ruler);
            if modify {
                let _ = save(path, &config_current);
            }
            // println!("load: {:#?}, {:#?}", path, config_current);
            ConfigState {
                ruler: config_ruler,
                currrent: Mutex::new(config_current),
            }
        }
        Err(_) => {
            let config_origin = ConfigOrigin::default();
            let (_, config_current) = config_origin.generate_current(&config_ruler);
            let _ = save(path, &config_current);
            // println!("init: {:#?}, {:#?}", path, config_current);
            ConfigState {
                ruler: config_ruler,
                currrent: Mutex::new(config_current),
            }
        }
    }
}

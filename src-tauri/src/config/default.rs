use super::core::{ConfigRuler, ValueRuler};

pub fn default_config_ruler() -> ConfigRuler {
    ConfigRuler {
        global_shortcut: ValueRuler {
            the_default: "Alt+Space".to_string(),
            the_options: Some(vec!["Shift+Space".to_string()]),
        },
        window_width: ValueRuler {
            the_default: 800.0,
            the_options: None,
        },
        window_height: ValueRuler {
            the_default: 600.0,
            the_options: None,
        },
    }
}

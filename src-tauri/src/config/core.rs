pub const MAIN_WINDOW_LABEL: &str = "main";
pub const CONFIG_FILE: &str = "config.json";
pub const SETTING_FILE: &str = "setting.txt";

macro_rules! config_with_ruler {
    ($($field_name:ident : $field_type:ty),* $(,)?) => {
        #[derive(std::clone::Clone, serde::Serialize, serde::Deserialize)]
        pub struct ValueRuler<T>
        {
            pub(crate) the_default: T,
            pub(crate) the_options: Option<Vec<T>>,
        }

        #[derive(std::clone::Clone, serde::Serialize, serde::Deserialize)]
        pub struct ConfigRuler {
            $(
                pub(crate) $field_name: ValueRuler<$field_type>,
            )*
        }

        #[derive(std::fmt::Debug, std::default::Default, serde::Serialize, serde::Deserialize)]
        pub struct ConfigOrigin {
            $(
                pub(crate) $field_name: Option<$field_type>,
            )*
        }

        #[derive(std::fmt::Debug, std::clone::Clone, serde::Serialize, serde::Deserialize)]
        pub struct ConfigCurrent {
            $(
                pub(crate) $field_name: $field_type,
            )*
        }

        impl ConfigCurrent {
            $(
                #[allow(dead_code)]
                pub fn $field_name(&self) -> &$field_type {
                    &self.$field_name
                }
            )*
        }

        impl ConfigOrigin {
            pub fn generate_current(self, ruler: &ConfigRuler) -> (bool, ConfigCurrent) {
                let mut modified = false;
                let config_current = ConfigCurrent{
                    $($field_name: if let Some(v) = self.$field_name {
                        if let Some(options) = &ruler.$field_name.the_options {
                            if v != ruler.$field_name.the_default && !options.contains(&v) {
                                modified = true;
                                ruler.$field_name.the_default.clone()
                            } else {
                                v
                            }
                        } else {
                            v
                        }
                    } else {
                        modified = true;
                        ruler.$field_name.the_default.clone()
                    },)*
                };
                (modified, config_current)
            }
        }

    };
}

config_with_ruler!(
    global_shortcut: String,
    window_width: f64,
    window_height: f64,
);

#[cfg(test)]
mod tests {

    config_with_ruler!(
        a: String,
        b: i32,
        c: i32,
        d: i32
    );

    #[test]
    fn test_default() {
        let config_origin = ConfigOrigin::default();
        assert_eq!(config_origin.a, None);
        assert_eq!(config_origin.b, None);
    }

    /// current None -> default  
    /// current Some && options None -> origin  
    /// current Some && options Some && in -> origin  
    /// current Some && options Some && not-in -> defalut  
    #[test]
    fn test_correct() {
        let mut config_origin = ConfigOrigin::default();
        config_origin.a = None;
        config_origin.b = Some(2);
        config_origin.c = Some(3);
        config_origin.d = Some(4);
        let config_ruler = ConfigRuler {
            a: ValueRuler {
                the_default: "aaa".into(), // to_string & into -> from -> to_owned
                the_options: None,
            },
            b: ValueRuler {
                the_default: 222,
                the_options: None,
            },
            c: ValueRuler {
                the_default: 333,
                the_options: Some(vec![3, 33]),
            },
            d: ValueRuler {
                the_default: 444,
                the_options: Some(vec![44, 444]),
            },
        };

        let (modify, config_current) = config_origin.generate_current(&config_ruler);
        assert_eq!(modify, true); // modified
        assert_eq!(*config_current.a(), "aaa".to_string()); // default
        assert_eq!(*config_current.b(), 2); // origin
        assert_eq!(*config_current.c(), 3); // origin
        assert_eq!(*config_current.d(), 444); // default
    }

    #[test]
    fn test_json_2_config() {
        let str = r#"{"a": "aaa", "ffff": "123"}"#;
        let config_origin: ConfigOrigin = serde_json::from_str(str).unwrap();
        assert_eq!(config_origin.a, Some("aaa".to_string()));
        assert_eq!(config_origin.b, None);
    }
}

macro_rules! dict {
    ($static_name:ident : $struct_name:ident { $($field_name:ident),* $(,)?}) => {
        #[derive(serde::Serialize, serde::Deserialize)]
        pub struct $struct_name<'a> {
            $(
                pub $field_name: &'a str,
            )*
        }

        pub static $static_name: $struct_name = $struct_name {
            $(
                $field_name: stringify!($field_name),
            )*
        };
    }
}

dict!(MAIN_EVENT: MainEvent {
    do_global_shortcut,
    un_global_shortcut,
});

#[cfg(test)]
mod tests {

    dict!(TEST_DICT: TestDict {aaa});

    #[test]
    fn dict() {
        assert_eq!(TEST_DICT.aaa, "aaa");
    }
}

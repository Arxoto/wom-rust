pub const PLACEHOLDER_SPLIT: &str = "___";
pub const PLACEHOLDER_ARGS: &str = "{}";

// 类型
pub const ITEM_TYPE_CMD: &str = "cmd"; // 复制命令
pub const ITEM_TYPE_WEB: &str = "web"; // 默认浏览器打开
pub const ITEM_TYPE_APP: &str = "app"; // 默认方式打开应用
pub const ITEM_TYPE_FOLDER: &str = "folder"; // 默认方式打开文件夹
pub const ITEM_TYPE_FILES: &str = "files"; // 自动扫描文件夹下的文件

// 持久化允许
pub fn is_type(the_type: &str) -> bool {
    ITEM_TYPE_CMD == the_type
        || ITEM_TYPE_WEB == the_type
        || ITEM_TYPE_APP == the_type
        || ITEM_TYPE_FOLDER == the_type
        || ITEM_TYPE_FILES == the_type
}

// 一般类型 <-> 特殊类型 is_special_type
pub fn is_general_type(the_type: &str) -> bool {
    ITEM_TYPE_CMD == the_type
        || ITEM_TYPE_WEB == the_type
        || ITEM_TYPE_APP == the_type
        || ITEM_TYPE_FOLDER == the_type
}

/// 持久化信息
#[derive(std::fmt::Debug, std::clone::Clone, serde::Serialize, serde::Deserialize)]
pub struct ItemBase {
    pub(crate) the_type: String,
    pub(crate) title: String,
    pub(crate) detail: String,
}

/// 内存格式
#[derive(std::fmt::Debug, std::clone::Clone, serde::Serialize, serde::Deserialize)]
pub struct ItemCommon {
    pub(crate) the_base: ItemBase,
    pub(crate) the_key: String,
    pub(crate) with_args: bool,
}

// impl ItemCommon {
//     pub fn as_base(&self) -> &ItemBase {
//         &self.the_base
//     }
// }

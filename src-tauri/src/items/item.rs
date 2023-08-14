
// #[derive(serde::Serialize, serde::Deserialize)]
pub struct Item {
    pub id: i32,
    pub the_type: String,
    pub title: String,
    pub detail: String,
}

pub struct ItemService {
}
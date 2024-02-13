use super::core::ItemCommon;

#[inline]
fn find_equal(item: &ItemCommon, keyword: &str) -> bool {
    item.the_key == keyword
}

#[inline]
fn find_starts_with(item: &ItemCommon, keyword: &str) -> bool {
    item.the_key.starts_with(keyword)
}

#[inline]
fn find_contains(item: &ItemCommon, keyword: &str) -> bool {
    item.the_key.contains(keyword)
}

fn find_match(item: &ItemCommon, keyword: &str) -> bool {
    let mut source = keyword.chars();
    let mut target = item.the_key.chars();
    'outer: loop {
        if let Some(s) = source.next() {
            loop {
                if let Some(t) = target.next() {
                    if s == t {
                        continue 'outer;
                    }
                    continue;
                }
                return false;
            }
        }
        return true;
    }
}

#[derive(std::fmt::Debug, std::clone::Clone, serde::Serialize, serde::Deserialize)]
pub struct FindedItems {
    eq: Vec<ItemCommon>,
    sw: Vec<ItemCommon>,
    ct: Vec<ItemCommon>,
    mc: Vec<ItemCommon>,
}

impl Default for FindedItems {
    fn default() -> Self {
        Self {
            eq: Default::default(),
            sw: Default::default(),
            ct: Default::default(),
            mc: Default::default(),
        }
    }
}

impl FindedItems {
    pub fn add_if_finded(self: &mut Self, item: &ItemCommon, keyword: &str) {
        if find_equal(item, keyword) {
            self.eq.push(item.clone())
        }
        if find_starts_with(item, keyword) {
            self.sw.push(item.clone())
        }
        if find_contains(item, keyword) {
            self.ct.push(item.clone())
        }
        if find_match(item, keyword) {
            self.mc.push(item.clone())
        }
    }
}

/// 在后端保存实例和查询
/// 优点：保证在app维度全局唯一 不会因新建窗口/页面切换导致重新载入设置
/// 缺点：内存占用变大（后端和前端数据是独立的） 无法通过trigger函数变量定制化item
pub fn search(items: &[ItemCommon], keyword: &str, has_args: bool) -> Box<FindedItems> {
    let mut finded_items = Box::new(FindedItems::default());
    for item in items {
        if has_args && !item.with_args {
            continue;
        }
        finded_items.add_if_finded(item, keyword);
    }

    // vector 展开
    // finded.into_iter().flatten().collect()

    finded_items
}

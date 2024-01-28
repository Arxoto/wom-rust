use super::core::ItemCommon;

fn find_equal(item: &ItemCommon, keyword: &str) -> bool {
    item.the_key == keyword
}

fn find_starts_with(item: &ItemCommon, keyword: &str) -> bool {
    item.the_key.starts_with(keyword)
}

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
                    } else {
                        continue;
                    }
                } else {
                    return false;
                }
            }
        } else {
            return true;
        }
    }
}

pub fn search(items: &[ItemCommon], keyword: &str, has_args: bool) -> Vec<ItemCommon> {
    let funcs = vec![find_equal, find_starts_with, find_contains, find_match];

    let mut finded: Vec<Vec<ItemCommon>> = Vec::new();
    for _ in funcs.iter() {
        finded.push(Vec::new());
    }

    for item in items {
        if has_args && !item.with_args {
            continue;
        }
        for (i, func) in funcs.iter().enumerate() {
            if func(item, keyword) {
                finded[i].push(item.clone());
                break;
            }
        }
    }

    finded.into_iter().flatten().collect()
}

use std::{
    error::Error,
    fs::File,
    io::{BufRead, BufReader, BufWriter, Write},
    path::PathBuf,
};

use super::core::{is_type, ItemBase, PLACEHOLDER_SPLIT};

pub fn load(path: &PathBuf) -> Result<Vec<ItemBase>, Box<dyn Error>> {
    let file = File::open(path)?;

    let mut result: Vec<ItemBase> = vec![];
    let reader = BufReader::new(file);
    for ele in reader.lines() {
        let line = ele?;
        let ll: Vec<&str> = line.split(PLACEHOLDER_SPLIT).collect();
        if ll.len() != 3 {
            continue;
        }
        let the_type = ll[0];
        if !is_type(the_type) {
            continue;
        }
        result.push(ItemBase {
            the_type: the_type.to_string(),
            title: ll[1].to_string(),
            detail: ll[2].to_string(),
        });
    }
    Ok(result)
}

pub fn save(path: &PathBuf, conf: &Vec<ItemBase>) -> Result<(), Box<dyn Error>> {
    let file = File::create(path)?;
    let mut writer = BufWriter::new(file);
    for item in conf {
        writeln!(
            &mut writer,
            "{}{sp}{}{sp}{}",
            item.the_type,
            item.title,
            item.detail,
            sp = PLACEHOLDER_SPLIT
        )?;
    }
    Ok(())
}

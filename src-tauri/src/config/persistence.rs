use std::{
    error::Error,
    fs::File,
    io::{BufReader, BufWriter},
    path::PathBuf,
};

use super::core::{ConfigCurrent, ConfigOrigin};

pub fn load(path: &PathBuf) -> Result<ConfigOrigin, Box<dyn Error>> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);
    let conf = serde_json::from_reader(reader)?;
    Ok(conf)
}

pub fn save(path: &PathBuf, conf: &ConfigCurrent) -> Result<(), Box<dyn Error>> {
    let file = File::create(path)?;
    let writer = BufWriter::new(file);
    Ok(serde_json::to_writer_pretty(writer, conf)?)
}

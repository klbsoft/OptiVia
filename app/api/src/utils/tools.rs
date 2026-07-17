use chrono::{Utc, FixedOffset};
use rand::RngCore;
use uuid::Uuid;

pub fn get_dr_time() -> String {
    let dr_offset = FixedOffset::west_opt(4 * 3600).unwrap(); // UTC-4
    let now = Utc::now().with_timezone(&dr_offset);
    now.format("%Y-%m-%d %H:%M:%S").to_string()
}

// Or if you just need the formatted string for timestamps
pub fn dr_now() -> String {
    let dr_offset = FixedOffset::west_opt(4 * 3600).unwrap();
    Utc::now().with_timezone(&dr_offset).to_rfc3339()
}


pub fn random_uuid(prefix: &str) -> String {
    format!("{}_{}", prefix, Uuid::new_v4().to_string().replace("-", "")[..16].to_string())
}

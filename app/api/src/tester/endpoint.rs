
 
use chrono::Local;

 

pub async fn test_end_point() -> String {
    let now = Local::now();
    let formatted = now.format("%Y-%m-%d %H:%M:%S").to_string();
    format!("Opti-Via-API Current date and time: {}", formatted)
}

pub async fn test_db()->String{
    // let db = Sqlitedb::test_connection().await; 
    let now = Local::now();
    let formatted = now.format("%Y-%m-%d %H:%M:%S").to_string();
    format!("Opti-Via-API Current date and time: {}", formatted)
}
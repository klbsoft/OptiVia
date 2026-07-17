// use serde::{Deserialize, Serialize};
// use std::{fs, sync::OnceLock};
 
    

// #[derive(Debug, Serialize, Deserialize)]
// pub struct Config {
//     pub db_path: String,
//     pub db_scheme: String,
// }
 

// // Global static configuration
// static CONFIG: OnceLock<Config> = OnceLock::new();

// pub fn load_config() -> &'static Config {
//     CONFIG.get_or_init(|| {
//         let config_path = "config.json";
        
//         match fs::read_to_string(config_path) {
//             Ok(contents) => {
//                 match serde_json::from_str(&contents) {
//                     Ok(config) => {
//                         println!("Configuration loaded successfully");
//                         config
//                     }
//                     Err(e) => {
//                         eprintln!("Error parsing config.json: {}", e);
//                         println!("Using default configuration");
//                         Config {
//                             db_path: "test.db".to_string(),
//                             db_scheme: "scheme.sql".to_string(),
//                         }
//                     }
//                 }
//             }
//             Err(e) => {
//                 eprintln!("Error reading config.json: {}", e);
//                 println!("Using default configuration");
//                 Config {
//                     db_path: "test.db".to_string(),
//                     db_scheme: "scheme.sql".to_string(),
//                 }
//             }
//         }
//     })
// }

// // Method to get the loaded config from memory
// pub fn get_config() -> &'static Config {
//     CONFIG.get().expect("Config not initialized. Call load_config() first.")
// }

// // Alternative getter that initializes if not already done
// pub fn get_or_init_config() -> &'static Config {
//     load_config()    
// }
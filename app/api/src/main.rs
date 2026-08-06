mod identity;
mod components;
mod tester; 
mod actions;
mod config;
mod utils;

// use config::{load_config};
 

// use std::fmt;
// use chrono::{DateTime, NaiveDateTime, Utc};
// use rusqlite::{Connection, Result};
// use serde::{Deserialize, Serialize};
use axum::{
    Router, extract::DefaultBodyLimit, routing::{get, post}
 
};
use tower_http::cors::{Any, CorsLayer};
 
use crate::{actions::{add_payment_method, get_user_session, update_user_session}, components::dbfactory::{Mongo, db, init_db, list_users}, tester::endpoint::{test_db, test_end_point}}; 
use crate::actions::{signup,upload,login};



 
#[tokio::main]
async fn main() {
    // let config = load_config();
    init_db().await; 
    // list_users().await;
    let PORT = 3299; 
    let URL = format!("0.0.0.0:{}",PORT);
     
    
    // let db_path = &config.db_path;
    // let db_scheme = &config.db_scheme;
    
    // println!("Database path: {}", db_path);
    // println!("Database scheme: {}", db_scheme);
    let app = Router::new()
        // .route("/test_db", get(test_db)) // Removed extra ()
        .route("/", get(test_end_point))
        .route("/test",get(test_end_point))
         //.route("/login", post())
    
        .route("/session",post(get_user_session))
        .route("/sync",post(update_user_session))
        .route("/apm",post(add_payment_method))
        .route("/upload", post(upload))
    
        .route("/signup", post(signup))
    
        .route("/login", post(login));
    


    println!("Server running on http://{}", URL);  
    
    let listener = tokio::net::TcpListener::bind(URL).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
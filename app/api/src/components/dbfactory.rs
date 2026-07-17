use axum::Json;
use mongodb::{Client, Collection, Database as MongoDatabase};
use mongodb::bson::doc;
// use once_cell::sync::OnceCell;
// use rusqlite::Transaction;
use serde::{Deserialize, Serialize};


use crate::identity::{Bus, Transaction, User, UserClient, Wallet};

use std::sync::OnceLock;

static DB: OnceLock<Mongo> = OnceLock::new();
// static DB: OnceCell<Database> = OnceCell::new();

#[derive(Debug, Clone)]
pub struct Mongo {
    db: MongoDatabase,
}

impl Mongo {
    pub async fn open() -> Self {
        let client = Client::with_uri_str("mongodb://localhost:27017")
            .await
            .expect("Failed to connect");
        
        // Ping to verify
        client
            .database("admin")
            .run_command(doc! { "ping": 1 })
            .await
            .expect("Failed to ping");
        
        let db = client.database("opti-via");
        
        Mongo { db }
    }
    
    
    pub fn users(&self) -> Collection<User> {
        self.db.collection("users")
    }
    
    pub fn wallets(&self) -> Collection<Wallet> {
        self.db.collection("wallets")
    }
    
    
    pub fn transactions(&self) -> Collection<Transaction> {
        self.db.collection("transactions")
    }
    
    pub fn buses(&self) -> Collection<Bus> {
        self.db.collection("buses")
    }
}

pub async fn init_db() {
    let database = Mongo::open().await;
    DB.set(database).expect("Already initialized");
}

pub fn db() -> &'static Mongo {
    DB.get().expect("Database not initialized")
}

 



 

pub async fn list_users() {
    println!("\n=== ALL USERS ===\n");
    
    let mut cursor = match db().users().find(doc! {}).await {
        Ok(cursor) => cursor,
        Err(e) => {
            println!("Error: {}", e);
            return;
        }
    };
    
    let mut count = 0;
    while cursor.advance().await.unwrap_or(false) {
        match cursor.deserialize_current() {
            Ok(user) => {
                count += 1;
                println!("User {}: {:#?}", count, user);
            }
            Err(e) => {
                println!("Error deserializing: {}", e);
            }
        }
    }
    println!("Total: {}", count);
}


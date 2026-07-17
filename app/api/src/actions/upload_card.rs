
use axum::Json;
use mongodb::bson::doc;
use crate::utils::{random_uuid,get_dr_time};

// use crate::config::load_config;

use crate::{components::{dbfactory::{Mongo, db}, encrypt::CryptoService}, identity::{User,UserClient}};
// use crate::components::dbfactory::Sqlitedb;
 
// singup
pub async fn upload_card(Json(user): Json<UserClient>) -> String {
    println!("{:#?}", user);
    
    // Check if email already exists
    let existing = db()
        .users()
        .find_one(doc! { "email": &user.email })
        .await;
    match existing {
    Ok(Some(_)) => {
        println!("Email already exists");
        return "FAILED:El correo ya está registrado".to_string();
    }
    Err(e) => {
        println!("Database error: {}", e);
        return "FAILED:Error en la base de datos".to_string();
    }
    Ok(None) => {
        let crypto = CryptoService::new(); 
        let date = get_dr_time(); 
        let re_hash = crypto.non_deterministic_hash(&user.password_hash); 
        let mut rehash_value = String::new(); 
        let user_id = random_uuid("user");
        if re_hash.is_ok() {
            rehash_value = re_hash.unwrap(); 
        } else {
            println!("Hashing error: {:?}", re_hash.err());
            return "FAILED:Error al procesar la contraseña".to_string();
        }
        let new_user = User {
            email: user.email,
            name: user.name,
            last_name: user.last_name,
            password_hash: rehash_value,
            salt: CryptoService::salt(),
            id: user_id.clone(),
            date_of_birth: user.date_of_birth,
            phone: user.phone,
            user_type: user.user_type,
            discount_percentage: 0,
            is_active: true,
            verified: false,
            created_at: date.clone(),
            updated_at: date,
        };
        
        match db().users().insert_one(new_user).await {
            Ok(result) => {
                println!("User created with ID: {:?}", result.inserted_id);
                format!("OK:{}", user_id)
            }
            Err(e) => {
                println!("Failed to create user: {}", e);
                "FAILED:No se pudo crear el usuario".to_string()
            }
        }
    }
}
}
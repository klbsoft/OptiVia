use axum::Json;
use mongodb::bson::doc;

use crate::{components::{dbfactory::db, encrypt::CryptoService}, identity::identities::UserLogin};
 

pub async fn login(Json(credentials): Json<UserLogin>) -> String {
    println!("LOGIN: Attempt for email '{}'", credentials.email);

    let user = match db().users().find_one(doc! { "email": &credentials.email }).await {
        Ok(Some(user)) => user,
        Ok(None) => {
            return "FAIL:Usuario no encontrado".to_string();
        }
        Err(e) => {
            println!("LOGIN: Database error: {}", e);
            return "FAIL:Error en la base de datos".to_string();
        }
    };

    let crypto = CryptoService::new();
    match crypto.verify_non_deterministic_hash(&credentials.password, &user.password_hash) {
        Ok(true) => {
            format!("OK:{}", user.id)
        }
        Ok(false) => {
            "FAIL:Contraseña incorrecta".to_string()
        }
        Err(_) => {
            "FAIL:Error al verificar contraseña".to_string()
        }
    }
}
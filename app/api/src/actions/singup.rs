
use axum::Json;
use mongodb::bson::doc;
use crate::identity::identities::{NotificationSettings, UserSettings};
use crate::identity::{PaymentMethod, Wallet};
use crate::utils::{random_uuid,get_dr_time};

// use crate::config::load_config;

use crate::{components::{dbfactory::{Mongo, db}, encrypt::CryptoService}, identity::{User,UserClient}};
// use crate::components::dbfactory::Sqlitedb;
 
// singup
pub async fn signup(Json(user): Json<UserClient>) -> String {
    println!("{:#?}", user);
    
    //  heck if email already exists
    let existing = db()
        .users()
        .find_one(doc! { "email": &user.email })
        .await;
    match existing {
    Ok(Some(_)) => {
        println!("Email already exists");
        return "FAIL:El correo ya está registrado".to_string();
    }
    Err(e) => {
        println!("Database error: {}", e);
        return "FAIL:Error en la base de datos".to_string();
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
            return "FAIL:Error al procesar la contraseña".to_string();
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
            updated_at: date.clone(),
        };
        
        match db().users().insert_one(new_user).await {
            Ok(result) => {
                println!("User created with ID: {:?}", result.inserted_id);
                
                let now = get_dr_time();
                let balance_id = random_uuid("pm");
                let wallet = Wallet {
                    default_id:balance_id.clone(),
                    id: user_id.clone(),
                    user_id: user_id.clone(),
                    payment_methods: vec![
                        PaymentMethod::Balance {
                            id: balance_id,
                            amount: 0.0,
                            created_at: date.clone(),
                            updated_at: date.clone(),
                        }
                    ],
                    created_at: date.clone(),
                    updated_at: date.clone(),
                };
                
                match db().wallets().insert_one(wallet).await {
                    Ok(_) => println!("Wallet created for user {}", user_id.clone()),
                    Err(e) => {
                        println!("FAIL to create wallet: {}", e);
                        return "FAIL:No se pudo crear el usuario".to_string();
                    }
                }
                // return format!("OK:{}", user_id.clone());
            }
            Err(e) => {
                println!("FAIL to create user: {}", e);
                return "FAIL:No se pudo crear el usuario".to_string();
            }
        }

        let notifications = NotificationSettings{
            trip_updates:true,
            security_alerts:true,
            price_changes:true,
            promotions:true
        };
        let user_settings = UserSettings{
            id:user_id.clone(),
            notifications,
            language:"Español".to_string(),
            created_at:date.clone(),
            updated_at:date.clone()
        };
        match db().user_settings().insert_one(user_settings).await {
            Ok(_) => println!("User Settings created for user {}", user_id),
            Err(e) => {
                println!("FAIL to create wallet: {}", e);
                return "FAIL:No se pudo crear el usuario".to_string();
            }
        }
        return format!("OK:{}",user_id)
    }
}
}
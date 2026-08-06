use axum::Json;
use chacha20poly1305::consts::U64;
use mongodb::bson::doc;
use crate::identity::{PaymentMethod, Wallet};
use crate::utils::{random_uuid,get_dr_time};

// use crate::config::load_config;

use crate::{components::{dbfactory::{Mongo, db}, encrypt::CryptoService}, identity::{User,UserClient}};
// use crate::components::dbfactory::Sqlitedb;

pub async fn add_payment_method(
    Json(payment_method): Json<PaymentMethod>,
) -> String {
    println!("[APM] Starting add_payment_method");

    // Only cards for now.
    let user_id = match &payment_method {
        PaymentMethod::Card {
            id,
            name_on_card,
            card_number,
            card_type,
            ..
        } => {
            println!(
                "[APM] Card received | User ID: {} | Cardholder: {} | Brand: {} | Last Four: {}",
                id, name_on_card, card_type, card_number
            );
            id
        }
        _ => {
            println!("[APM] Unsupported payment method");
            return "FAIL:Método de pago no soportado".to_string();
        }
    };

    println!("[APM] Connecting to database");
    let db = db();

    println!("[APM] Looking for wallet with ID: {}", user_id);

    // Find the user's wallet.
    let mut wallet = match db.wallets().find_one(doc! { "id": user_id }).await {
        Ok(Some(wallet)) => {
            println!("[APM] Wallet found");
            wallet
        }
        Ok(None) => {
            println!("[APM] Wallet not found");
            return "FAIL:No se encontró la billetera".to_string();
        }
        Err(err) => {
            println!("[APM] Database error while finding wallet: {:?}", err);
            return "FAIL:No se encontró la billetera".to_string();
        }
    };

    println!("[APM] Checking for duplicate cards in user's wallet");

    // Check only this user's wallet for duplicate cards.
    for method in &wallet.payment_methods {
        if let (
            PaymentMethod::Card { card_number: existing, .. },
            PaymentMethod::Card { card_number: incoming, .. },
        ) = (method, &payment_method)
        {
            println!(
                "[APM] Comparing cards | Existing: {} | Incoming: {}",
                existing, incoming
            );

            if existing == incoming {
                println!("[APM] Duplicate card found in user's wallet");
                return "FAIL:La tarjeta ya existe".to_string();
            }
        }
    }

    println!("[APM] Adding payment method to wallet");
    wallet.payment_methods.push(payment_method);

    println!("[APM] Saving updated wallet");

    if let Err(err) = db
        .wallets()
        .replace_one(doc! { "id": &wallet.id }, &wallet)
        .await
    {
        println!("[APM] FAIL to save wallet: {:?}", err);
        return "FAIL:No se pudo guardar la billetera".to_string();
    }

    println!("[APM] Payment method added successfully");

    "OK".to_string()
}   
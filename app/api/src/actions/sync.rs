
use axum::Json;
use mongodb::bson::doc;
use crate::{components::dbfactory::db, identity::{PaymentMethod, Wallet, identities::{Card, TripHistory, UserInfo, UserSession, UserSessionRequest}}, utils::get_dr_time};
 
// use crate::config::load_config;

// use crate::components::dbfactory::Sqlitedb;
 
// singup

pub async fn update_user_session(Json(session): Json<UserSession>) -> String {
    println!("UPDATE SESSION");

    // ------------------------------------------------------------
    // USER
    // ------------------------------------------------------------
    let mut user = match db()
        .users()
        .find_one(doc! { "id": session.user.id.clone() })
        .await
    {
        Ok(Some(user)) => user,
        Ok(None) => {
            return "FAIL:Usuario no encontrado".to_string();
        }
        Err(e) => {
            println!("UPDATE SESSION: User database error: {}", e);
            return "FAIL:Error en la base de datos".to_string();
        }
    };

    user.name = session.user.name.clone();
    user.last_name = session.user.last_name.clone();
    user.date_of_birth = session.user.date_of_birth.clone();
    user.email = session.user.email.clone();
    user.phone = session.user.phone.clone();
    user.updated_at = get_dr_time();

    if let Err(e) = db()
        .users()
        .replace_one(doc! { "id": user.id.clone() }, &user)
        .await
    {
        println!("UPDATE SESSION: Failed updating user: {}", e);
        return "FAIL:No se pudo actualizar el usuario".to_string();
    }

    // ------------------------------------------------------------
    // WALLET
    // ------------------------------------------------------------
    let mut wallet = match db()
        .wallets()
        .find_one(doc! { "user_id": session.user.id.clone() })
        .await
    {
        Ok(Some(wallet)) => wallet,
        Ok(None) => {
            return "FAIL:Cartera no encontrada".to_string();
        }
        Err(e) => {
            println!("UPDATE SESSION: Wallet database error: {}", e);
            return "FAIL:Error en la base de datos".to_string();
        }
    };

    let now = get_dr_time();

    for incoming in &session.cards {
        for payment in &mut wallet.payment_methods {
            match payment {

                PaymentMethod::Balance {
                    id,
                    amount,
                    updated_at,
                    ..
                } => {
                    if incoming.id == *id {
                        *amount = incoming.card_number.parse::<f64>().unwrap_or(*amount);
                        *updated_at = now.clone();
                    }
                }

                PaymentMethod::Card {
                    id,
                    name_on_card,
                    expiry_date,
                    cvv,
                    card_type,
                    updated_at,
                    ..
                } => {
                    if incoming.id == *id {

                        // Preserve the real card number already stored.
                        *name_on_card = incoming.name_on_card.clone();
                        *expiry_date = incoming.expiry_date.clone();
                        *cvv = incoming.cvv.clone();
                        *card_type = incoming.card_type.clone();
                        *updated_at = now.clone();
                    }
                }
            }
        }
    }

    wallet.updated_at = now.clone();

    if let Err(e) = db()
        .wallets()
        .replace_one(doc! { "id": wallet.id.clone() }, &wallet)
        .await
    {
        println!("UPDATE SESSION: Failed updating wallet: {}", e);
        return "FAIL:No se pudo actualizar la cartera".to_string();
    }

    // ------------------------------------------------------------
    // SETTINGS
    // ------------------------------------------------------------
    let mut settings = match db()
        .user_settings()
        .find_one(doc! { "id": session.user.id.clone() })
        .await
    {
        Ok(Some(settings)) => settings,
        Ok(None) => {
            return "FAIL:Configuración del usuario no encontrada".to_string();
        }
        Err(e) => {
            println!("UPDATE SESSION: Settings database error: {}", e);
            return "FAIL:Error en la base de datos".to_string();
        }
    };

    settings.notifications = session.settings.notifications.clone();
    settings.language = session.settings.language.clone();
    settings.updated_at = now;

    if let Err(e) = db()
        .user_settings()
        .replace_one(doc! { "id": settings.id.clone() }, &settings)
        .await
    {
        println!("UPDATE SESSION: Failed updating settings: {}", e);
        return "FAIL:No se pudo actualizar la configuración".to_string();
    }

    "OK".to_string()
}
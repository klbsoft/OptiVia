
use axum::Json;
use mongodb::bson::doc;
use crate::{components::dbfactory::db, identity::{PaymentMethod, Wallet, identities::{Card, TripHistory, UserInfo, UserSession, UserSessionRequest}}, utils::get_dr_time};
 
// use crate::config::load_config;

// use crate::components::dbfactory::Sqlitedb;
 
// singup

pub async fn update_user_session(Json(session): Json<UserSession>) -> String {
    
    println!("UPDATE SESSION REQUEST");
    println!("RAW REQUEST: {:#?}",session);
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

   wallet.payment_methods.clear();

for card in &session.cards {
    if card.card_type.to_lowercase() == "balance" {
        wallet.payment_methods.push(
            PaymentMethod::Balance {
                id: card.id.clone(),
                amount: card.card_number.parse::<f64>().unwrap_or(0.0),
                created_at: now.clone(),
                updated_at: now.clone(),
            }
        );
    } else {
        wallet.payment_methods.push(
            PaymentMethod::Card {
                id: card.id.clone(),
                name_on_card: card.name_on_card.clone(),
                card_number: card.card_number.clone(),
                expiry_date: card.expiry_date.clone(),
                cvv: card.cvv.clone(),
                card_type: card.card_type.clone(),
                created_at: now.clone(),
                updated_at: now.clone(),
            }
        );
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
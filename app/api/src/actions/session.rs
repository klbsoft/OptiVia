
use axum::Json;
use mongodb::bson::doc;
use crate::{components::dbfactory::db, identity::{PaymentMethod, Wallet, identities::{Card, TripHistory, UserInfo, UserSession, UserSessionRequest}}};
 
// use crate::config::load_config;

// use crate::components::dbfactory::Sqlitedb;
 
// singup
pub async fn get_user_session(Json(user_info): Json<UserSessionRequest>) -> String {
    println!("Session start request");
    let user = match db().users().find_one(doc! { "id": user_info.user_id.clone() }).await {
        Ok(Some(user)) => user,
        Ok(None) => {
            return "FAIL:Usuario no encontrado".to_string();
        }
        Err(e) => {
            println!("SESSION START: Database error: {}", e);
            return "FAIL:Error en la base de datos".to_string();
        }
    };

    let person = UserInfo{
        id:user.id,
        name:user.name,
        last_name:user.last_name,
        date_of_birth:user.date_of_birth,
        email:user.email,
        phone:user.phone};
    
   let wallet = match db().wallets().find_one(doc! { "id": user_info.user_id.clone() }).await {
        Ok(Some(w)) => w,
        Ok(None) => {
            return "FAIL:Cartera no encontrada".to_string();
        }
        Err(e) => {
            println!("WALLET SEARCH: Database error: {}", e);
            return "FAIL:Error en la base de datos".to_string();
        }
    };
    let mut cards : Vec<Card> = Vec::new(); 
    for method in &wallet.payment_methods{
        match method{
                PaymentMethod::Card { id,card_type,cvv, name_on_card, card_number, expiry_date, created_at, updated_at }=>{
                    let last_four = card_number[card_number.len() - 4..].to_string();
                       cards.push(Card {
                        id: id.clone(),
                        name_on_card: name_on_card.clone(),
                        card_number: format!("**** **** **** {}", last_four),
                        expiry_date: expiry_date.clone(),
                        cvv: cvv.clone(),
                        card_type: card_type.clone(),
                    });


                }
                PaymentMethod::Balance { id, amount, created_at, updated_at }=>{
                    cards.push(Card {
                        id: id.clone(),
                        name_on_card: "BALANCE".to_string(),
                        card_number: format!("{}",amount),
                        expiry_date: String::new(),
                        cvv: String::new(),
                        card_type: "Balance".to_string(),
                    });

                }
        }


    }
  
    let mut history: Vec<TripHistory> = Vec::new();

    let mut passenger_trips = match db()
        .passenger_trips()
        .find(doc! { "user_id": user_info.user_id.clone() })
        .await
    {
        Ok(cursor) => cursor,
        Err(e) => {
            println!("SESSION START: Passenger trips database error: {}", e);
            return "FAIL:Error en la base de datos".to_string();
        }
    };

    while passenger_trips.advance().await.unwrap_or(false) {
        match passenger_trips.deserialize_current() {
            Ok(passenger_trip) => {
                let transaction = match db()
                    .transactions()
                    .find_one(doc! { "id": passenger_trip.transaction_id.clone() })
                    .await
                {
                    Ok(Some(transaction)) => transaction,
                    Ok(None) => {
                        return "FAIL:Transaction not found".to_string();
                    }
                    Err(e) => {
                        println!("SESSION START: Transaction database error: {}", e);
                        return "FAIL:Error en la base de datos".to_string();
                    }
                };

                

                let mut card = match transaction.payment_method {
                    PaymentMethod::Card { id, name_on_card, cvv,card_number, card_type, expiry_date, created_at, updated_at }=>{
                      let last_four = card_number[card_number.len() - 4..].to_string();
                      let pm = Card { 
                        id, 
                        name_on_card,
                        card_number: format!("**** **** **** {}", last_four),
                        expiry_date:expiry_date, 
                        cvv: cvv,
                        card_type: card_type
                     };
                      pm
                    }
                    PaymentMethod::Balance { id, amount, created_at, updated_at }=>{
                        let pm = Card { 
                                   id: id.clone(),
                                    name_on_card: "BALANCE".to_string(),
                                    card_number: format!("{}",amount),
                                    expiry_date: String::new(),
                                    cvv: String::new(),
                                    card_type: "Balance".to_string(),
                            };
                        pm
                    }
                };
                let trip_history = TripHistory {
                    id: passenger_trip.id,
                    route_name: String::new(),
                    driver: String::new(),
                    drop_off_point: String::new(),
                    price: passenger_trip.final_amount,
                    payment_method: card,
                    date: passenger_trip.boarded_at,
                    status: passenger_trip.status,
                };

                history.push(trip_history);
            }

            Err(e) => {
                println!("SESSION START: Passenger trip parse error: {}", e);
                return "FAIL:Error procesando viajes".to_string();
            }
        }
    }



    let settings = match db()
        .user_settings()
        .find_one(doc! { "id": user_info.user_id.clone() })
        .await
    {
        Ok(Some(settings)) => settings,
        Ok(None) => {
            return "FAIL:Configuración del usuario no encontrada".to_string();
        }
        Err(e) => {
            println!("SESSION START: User settings database error: {}", e);
            return "FAIL:Error en la base de datos".to_string();
        }
    };


    let session  = UserSession{
        user:person,
        cards:cards,
        history:history,
        settings:settings
    };
    let json = match serde_json::to_string(&session) {
        Ok(json) => json,
        Err(e) => {
            println!("SESSION START: Serialization error: {}", e);
            return "FAIL:Error al serializar la sesión".to_string();
        }
    };


    
    return json; 
    

}


use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct VerificationDocumentInput {
    pub user_id: String,
    pub file_data: Vec<u8>,      // The file as bytes
    pub file_name: String,       // Original filename with extension
    pub file_type: String,       // MIME type (e.g., "image/jpeg", "application/pdf")
}
 

#[derive(Debug, Serialize, Deserialize)]
pub struct VerificationDocument {
    pub id: String,
    pub user_id: String,
    pub file_data: Vec<u8>,      // The actual file content
    pub file_name: String,       // Original filename
    pub file_type: String,       // MIME type
    pub file_size: i64,          // Size in bytes (useful for limits)
    pub verification_status: String, // "pending", "approved", "rejected"
    pub verified_by: Option<String>, // Admin who verified it
    pub verified_at: Option<String>, // When it was verified
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserLogin{
    pub email:String,
    pub password:String,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct UserClient {
    pub name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub email: String,
    pub phone: String,
    pub password_hash: String,
    pub user_type: String, // "gov", "student", or "police"
}


#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub email: String,
    pub phone: String,
    pub password_hash: String,
    pub salt : String  , 
    pub user_type: String, // "gov", "student", or "police"
    pub discount_percentage: i32,
    pub is_active: bool,
    pub verified: bool,
    pub created_at: String,
    pub updated_at: String,
}


#[derive(Debug, Serialize, Deserialize)]
pub struct Wallet {
    pub id: String,
    pub user_id: String,
    pub default_id: String,
    pub payment_methods: Vec<PaymentMethod>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "method_type")]
pub enum PaymentMethod {
    #[serde(rename = "card")]
    Card {
        id: String,
        name_on_card: String,
        card_number: String,
        card_type:String,
        cvv: String,
        expiry_date: String,
        created_at: String,
        updated_at: String,
    },
    #[serde(rename = "balance")]
    Balance {
        id: String,
        amount: f64,
        created_at: String,
        updated_at: String,
    },
}


#[derive(Debug, Serialize, Deserialize)]
pub struct Transaction {
    pub id: String,
    pub user_id: String,
    pub payment_method: PaymentMethod,  
    pub amount: f64,
    pub discount_applied: f64,
    pub status: String, // "completed"
    pub trip_id: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Driver {
    pub id: String,
    pub name: String,
    pub email: String,
    pub phone: String,
    pub license_number: String,
    pub license_expiry: String,
    pub status: String, // "active"
    pub rating: f64,
    pub hire_date: String,
    pub created_at: String,
    pub updated_at: String,
}

    #[derive(Debug, Serialize, Deserialize)]
    pub struct Bus {
        pub id: String,
        pub plate_number: String,
        pub model: String,
        pub capacity: i32,
        pub year: i32,
        pub maintenance_status: String, // "operational"
        pub current_latitude: f64,
        pub current_longitude: f64,
        pub speed: f64,
        pub status: String, // "in_service"
        pub last_updated: String,
        pub created_at: String,
        pub updated_at: String,
    }

#[derive(Debug, Serialize, Deserialize)]
pub struct RouteStop {
    pub id: String,
    pub route_id: String,
    pub stop_name: String,
    pub latitude: f64,
    pub longitude: f64,
    pub stop_order: i32,
    pub is_active: bool,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DriverAssignment {
    pub id: String,
    pub driver_id: String,
    pub bus_id: String,
    pub route_id: String,
    pub assigned_date: String,
    pub shift_start: String,
    pub shift_end: String,
    pub status: String, // "active"
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Trip {
    pub id: String,
    pub bus_id: String,
    pub route_id: String,
    pub driver_id: String,
    pub start_time: String,
    pub end_time: Option<String>,
    pub status: String, // "in_progress"
    pub current_stop_order: i32,
    pub passenger_count: i32,
    pub total_revenue: f64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PassengerTrip {
    pub id: String,
    pub user_id: String,
    pub trip_id: String,
    pub transaction_id: String,
    pub boarded_at: String,
    pub exited_at: String,
    pub status: String, // "in_transit"
    pub fare_amount: f64,
    pub discount_applied: f64,
    pub final_amount: f64,
    pub created_at: String,
    pub updated_at: String, 
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FareHistory {
    pub id: String,
    pub route_id: String,
    pub base_fare: f64,
    pub effective_date: String,
    pub end_date: Option<String>,
    pub reason: String,
    pub modified_by: String,
    pub created_at: String,
    pub updated_at: String,
}













#[derive(Debug, Serialize, Deserialize)]
pub struct UserInfo {
    pub id: String,
    pub name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub email: String,
    pub phone: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Card {
    pub id: String,
    pub name_on_card: String,
    pub card_number: String,
    pub expiry_date: String,
    pub cvv: String,
    pub card_type: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TripHistory {
    pub id: String,
    pub route_name: String,
    pub driver: String,
    pub drop_off_point: String,
    pub price: f64,
    pub payment_method: Card,
    pub date: String,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize,Clone)]
pub struct NotificationSettings {
    pub trip_updates: bool,
    pub price_changes: bool,
    pub security_alerts: bool,
    pub promotions: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserSettings {
    pub id: String, 
    pub notifications: NotificationSettings,
    pub language: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserSession {
    pub user: UserInfo,
    pub cards: Vec<Card>,
    pub history: Vec<TripHistory>,
    pub settings: UserSettings,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserSessionRequest {
    pub user_id: String,
}
use chrono::{Utc, Duration, DateTime};
use serde::{Deserialize, Serialize};
use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey};

// ================ JWT TOKEN STRUCTS ================

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,        // Subject (user_id)
    pub exp: usize,         // Expiration time
    pub iat: usize,         // Issued at
    pub token_type: String, // "access" or "refresh"
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenPair {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_in: i64,    // Seconds until access token expires
}

// ================ JWT SERVICE ================

pub struct JwtService {
    secret: String,
    access_expiration: i64,  // 15 minutes usually
    refresh_expiration: i64, // 7 days usually
}

impl JwtService {
    pub fn new(secret: String) -> Self {
        Self {
            secret,
            access_expiration: 900,      // 15 minutes
            refresh_expiration: 2592000,  // 30 days
        }
    }
    
    // Generate both access and refresh tokens
    pub fn generate_token_pair(&self, user_id: i64) -> Option<TokenPair> {
        let now = Utc::now().timestamp() as usize;
        
        // Create access token
        let access_claims = Claims {
            sub: user_id.to_string(),
            exp: now + self.access_expiration as usize,
            iat: now,
            token_type: "access".to_string(),
        };
        
        let access_token = encode(
            &Header::default(),
            &access_claims,
            &EncodingKey::from_secret(self.secret.as_ref()),
        ).ok()?;
        
        // Create refresh token
        let refresh_claims = Claims {
            sub: user_id.to_string(),
            exp: now + self.refresh_expiration as usize,
            iat: now,
            token_type: "refresh".to_string(),
        };
        
        let refresh_token = encode(
            &Header::default(),
            &refresh_claims,
            &EncodingKey::from_secret(self.secret.as_ref()),
        ).ok()?;
        
        Some(TokenPair {
            access_token,
            refresh_token,
            expires_in: self.access_expiration,
        })
    }
    
    // Verify a token and return the claims
    pub fn verify_token(&self, token: &str) -> Option<Claims> {
        let validation = Validation::default();
        
        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.secret.as_ref()),
            &validation,
        ).ok()?;
        
        Some(token_data.claims)
    }
    
    // Refresh the access token using a valid refresh token
    pub fn refresh_access_token(&self, refresh_token: &str) -> Option<String> {
        let claims = self.verify_token(refresh_token)?;
        
        // Make sure it's actually a refresh token
        if claims.token_type != "refresh" {
            return None;
        }
        
        // Generate new access token
        let now = Utc::now().timestamp() as usize;
        let new_access_claims = Claims {
            sub: claims.sub,
            exp: now + self.access_expiration as usize,
            iat: now,
            token_type: "access".to_string(),
        };
        
        let new_access_token = encode(
            &Header::default(),
            &new_access_claims,
            &EncodingKey::from_secret(self.secret.as_ref()),
        ).ok()?;
        
        Some(new_access_token)
    }
}

// ================ SESSION STRUCT ================

#[derive(Debug, Serialize, Deserialize)]
pub struct Session {
    pub id: i64,
    pub user_id: i64,
    pub refresh_token: String,
    pub expires_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}

impl Session {
    pub fn new(id: i64, user_id: i64, refresh_token: String, expires_at: DateTime<Utc>, created_at:DateTime<Utc>) -> Self {
        Self {
            id,
            user_id,
            refresh_token,
            expires_at,
            created_at,
        }
    }
    
    pub fn from_refresh_token(user_id: i64, refresh_token: String, expires_in_seconds: i64) -> Self {
        let now = Utc::now();
        let expires_at = now + Duration::seconds(expires_in_seconds);
        
        Self {
            id: 0,
            user_id,
            refresh_token,
            expires_at,
            created_at: now,
        }
    }
}
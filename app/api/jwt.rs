// Example using Axum web framework
use axum::{
    Json, extract::{TypedHeader, Path}, http::StatusCode,
    response::IntoResponse, headers::Authorization, headers::authorization::Bearer
};

// ================ LOGIN ENDPOINT ================

pub async fn login_handler(
    Json(payload): Json<LoginRequest>,
    jwt_service: JwtService,
    db: DatabasePool,
) -> impl IntoResponse {
    // 1. Verify username/password (your existing auth logic)
    let user = verify_user_credentials(payload.username, payload.password).await?;
    
    // 2. Generate JWT tokens
    let tokens = match jwt_service.generate_token_pair(user.id) {
        Some(t) => t,
        None => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    
    // 3. Store refresh token in database
    let session = Session::from_refresh_token(
        user.id, 
        tokens.refresh_token.clone(), 
        jwt_service.refresh_expiration
    );
    
    // Save to DB (using sqlx in this example)
    sqlx::query!(
        "INSERT INTO sessions (user_id, refresh_token, expires_at) VALUES (?, ?, ?)",
        session.user_id,
        session.refresh_token,
        session.expires_at
    )
    .execute(&db)
    .await
    .ok()?;
    
    // 4. Send tokens back to client
    Json(LoginResponse {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
        token_type: "Bearer".to_string(),
    }).into_response()
}

// ================ PROTECTED ENDPOINT ================

pub async fn get_messages_handler(
    // Extract Bearer token from Authorization header
    TypedHeader(auth): TypedHeader<Authorization<Bearer>>,
    jwt_service: JwtService,
) -> impl IntoResponse {
    // 1. Get token from header
    let token = auth.token();
    
    // 2. Verify the access token
    let claims = match jwt_service.verify_token(token) {
        Some(c) => c,
        None => return (StatusCode::UNAUTHORIZED, "Invalid token").into_response(),
    };
    
    // 3. Make sure it's an access token, not refresh
    if claims.token_type != "access" {
        return (StatusCode::UNAUTHORIZED, "Invalid token type").into_response();
    }
    
    // 4. Token is valid! Get user_id from claims
    let user_id = claims.sub.parse::<i64>().unwrap_or(0);
    
    // 5. Fetch messages for this user
    let messages = get_messages_for_user(user_id).await;
    
    // 6. Return data
    Json(messages).into_response()
}

// ================ REFRESH TOKEN ENDPOINT ================

pub async fn refresh_token_handler(
    Json(payload): Json<RefreshRequest>,
    jwt_service: JwtService,
    db: DatabasePool,
) -> impl IntoResponse {
    // 1. Get refresh token from request body
    let refresh_token = payload.refresh_token;
    
    // 2. Check if refresh token exists in database
    let session = sqlx::query_as!(
        Session,
        "SELECT * FROM sessions WHERE refresh_token = ? AND expires_at > CURRENT_TIMESTAMP",
        refresh_token
    )
    .fetch_optional(&db)
    .await
    .ok()?;
    
    let session = match session {
        Some(s) => s,
        None => return (StatusCode::UNAUTHORIZED, "Invalid refresh token").into_response(),
    };
    
    // 3. Generate new access token
    let new_access_token = match jwt_service.refresh_access_token(&refresh_token) {
        Some(t) => t,
        None => return (StatusCode::UNAUTHORIZED, "Invalid refresh token").into_response(),
    };
    
    // 4. Return new access token
    Json(RefreshResponse {
        access_token: new_access_token,
        expires_in: jwt_service.access_expiration,
        token_type: "Bearer".to_string(),
    }).into_response()
}

// ================ REQUEST/RESPONSE STRUCTS ================

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    username: String,
    password: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    access_token: String,
    refresh_token: String,
    expires_in: i64,
    token_type: String,
}

#[derive(Debug, Deserialize)]
pub struct RefreshRequest {
    refresh_token: String,
}

#[derive(Debug, Serialize)]
pub struct RefreshResponse {
    access_token: String,
    expires_in: i64,
    token_type: String,
}
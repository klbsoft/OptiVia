use axum::{
    extract::Multipart,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tokio::fs;
use tokio::io::AsyncWriteExt;

use crate::components::dbfactory::db;

#[derive(Debug, Serialize, Deserialize)]
pub struct UploadResponse {
    pub status: String,
    pub message: String,
}

/*
curl -v -X POST http://0.0.0.0:3299/upload   -F "user_id=user_dba3e96c7edd4baa"   -F "file=@OPTIVIA.pdf;type=application/pdf"
*/
pub async fn upload(mut multipart: Multipart) -> impl IntoResponse {
    println!("=== UPLOAD: Request received ===");

    let upload_dir = "files";
    let mut user_id = String::new();
    let mut file_saved = false;

    // Create upload directory
    match fs::create_dir_all(upload_dir).await {
        Ok(_) => println!("UPLOAD: Directory '{}' ready", upload_dir),
        Err(e) => {
            println!("UPLOAD: FAILED to create directory: {}", e);
            let response = UploadResponse {
                status: "FAIL:Error del servidor".to_string(),
                message: format!("No se pudo crear el directorio de archivos: {}", e),
            };
            return (StatusCode::INTERNAL_SERVER_ERROR, Json(response)).into_response();
        }
    }

    // Process fields
    let mut field_count = 0;
    while let Ok(Some(field)) = multipart.next_field().await {
        field_count += 1;
        let field_name = field.name().unwrap_or("").to_string();
        let content_type = field.content_type().map(|c| c.to_string()).unwrap_or("none".to_string());
        let file_name = field.file_name().map(|f| f.to_string()).unwrap_or("none".to_string());

        println!("UPLOAD: Field #{} - name='{}', content_type='{}', filename='{}'",
            field_count, field_name, content_type, file_name);

        if field_name == "user_id" {
            // Read user_id
            user_id = match field.text().await {
                Ok(text) => {
                    let trimmed = text.trim().to_string();
                    println!("UPLOAD: user_id received = '{}'", trimmed);
                    trimmed
                }
                Err(e) => {
                    println!("UPLOAD: FAILED to read user_id: {}", e);
                    let response = UploadResponse {
                        status: "FAIL:ID inválido".to_string(),
                        message: "El user_id proporcionado no es válido".to_string(),
                    };
                    return (StatusCode::BAD_REQUEST, Json(response)).into_response();
                }
            };

            // Verify user exists
            println!("UPLOAD: Looking up user '{}' in database...", user_id);
            match db().users().find_one(mongodb::bson::doc! { "id": &user_id }).await {
                Ok(None) => {
                    println!("UPLOAD: User '{}' NOT FOUND", user_id);
                    let response = UploadResponse {
                        status: "FAIL:Usuario no encontrado".to_string(),
                        message: "El usuario no existe en el sistema".to_string(),
                    };
                    return (StatusCode::NOT_FOUND, Json(response)).into_response();
                }
                Err(e) => {
                    println!("UPLOAD: Database error: {}", e);
                    let response = UploadResponse {
                        status: "FAIL:Error de base de datos".to_string(),
                        message: format!("Error al consultar la base de datos: {}", e),
                    };
                    return (StatusCode::INTERNAL_SERVER_ERROR, Json(response)).into_response();
                }
                Ok(Some(user)) => {
                    println!("UPLOAD: User '{}' verified (name: {} {})",
                        user_id, user.name, user.last_name);
                }
            }

        } else if field_name == "file" {
            if user_id.is_empty() {
                println!("UPLOAD: File received but no user_id yet!");
                let response = UploadResponse {
                    status: "FAIL:Orden incorrecto".to_string(),
                    message: "El user_id debe enviarse antes del archivo".to_string(),
                };
                return (StatusCode::BAD_REQUEST, Json(response)).into_response();
            }

            // Read bytes FIRST - before doing anything else
            println!("UPLOAD: Reading file bytes...");
            let data = match field.bytes().await {
                Ok(bytes) => {
                    println!("UPLOAD: Read {} bytes", bytes.len());
                    bytes
                }
                Err(e) => {
                    println!("UPLOAD: FAILED to read bytes: {}", e);
                    let response = UploadResponse {
                        status: "FAIL:Error de lectura".to_string(),
                        message: format!("No se pudo leer el archivo: {}", e),
                    };
                    return (StatusCode::INTERNAL_SERVER_ERROR, Json(response)).into_response();
                }
            };

            // Extract extension from original filename
            let ext = std::path::Path::new(&file_name)
                .extension()
                .and_then(|e| e.to_str())
                .unwrap_or("bin");
            println!("UPLOAD: Extension: '{}'", ext);

            // Build filepath
            let filename = format!("{}.{}", user_id, ext);
            let filepath = PathBuf::from(upload_dir).join(&filename);
            println!("UPLOAD: Saving as: {:?}", filepath);

            // Create file
            let mut file = match fs::File::create(&filepath).await {
                Ok(file) => {
                    println!("UPLOAD: File created");
                    file
                }
                Err(e) => {
                    println!("UPLOAD: FAILED to create file: {}", e);
                    let response = UploadResponse {
                        status: "FAIL:Error al crear archivo".to_string(),
                        message: format!("No se pudo crear el archivo en disco: {}", e),
                    };
                    return (StatusCode::INTERNAL_SERVER_ERROR, Json(response)).into_response();
                }
            };

            // Write to disk
            if let Err(e) = file.write_all(&data).await {
                println!("UPLOAD: FAILED to write: {}", e);
                let response = UploadResponse {
                    status: "FAIL:Error al escribir".to_string(),
                    message: format!("No se pudo guardar el archivo: {}", e),
                };
                return (StatusCode::INTERNAL_SERVER_ERROR, Json(response)).into_response();
            }

            println!("UPLOAD: File saved successfully! ({} bytes)", data.len());
            file_saved = true;
        }
    }

    println!("UPLOAD: Total fields: {}, file_saved: {}", field_count, file_saved);

    if !file_saved {
        println!("UPLOAD: No file was saved");
        let response = UploadResponse {
            status: "FAIL:Sin archivo".to_string(),
            message: "No se proporcionó ningún archivo".to_string(),
        };
        return (StatusCode::BAD_REQUEST, Json(response)).into_response();
    }

    println!("UPLOAD: SUCCESS");
    let response = UploadResponse {
        status: "OK:Archivo subido".to_string(),
        message: "El archivo se subió correctamente".to_string(),
    };
    (StatusCode::OK, Json(response)).into_response()
}
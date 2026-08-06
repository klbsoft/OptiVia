use axum::{
    extract::Multipart,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};
use tokio::fs;

use crate::components::dbfactory::db;

#[derive(Debug, Serialize, Deserialize)]
pub struct UploadResponse {
    pub status: String,
    pub message: String,
}

/*
curl -v -X POST http://0.0.0.0:3299/upload \
  -F "user_id=user_dba3e96c7edd4baa" \
  -F "file=@OPTIVIA.pdf;type=application/pdf"
*/
pub async fn upload(mut multipart: Multipart) -> impl IntoResponse {
    println!("========== UPLOAD START ==========");

    let upload_dir = "files";
    let mut user_id = String::new();
    let mut file_saved = false;

    println!("UPLOAD: Ensuring upload directory exists...");

    if let Err(err) = fs::create_dir_all(upload_dir).await {
        println!("UPLOAD: FAIL to create directory: {:?}", err);

        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(UploadResponse {
                status: "FAIL:Error del servidor".to_string(),
                message: "No se pudo crear el directorio.".to_string(),
            }),
        )
            .into_response();
    }

    println!("UPLOAD: Directory ready");

    while let Ok(Some(field)) = multipart.next_field().await {
        let field_name = field.name().unwrap_or("").to_string();

        println!("UPLOAD: Processing field '{}'", field_name);

        match field_name.as_str() {
            "user_id" => {
                println!("UPLOAD: Reading user_id...");

                user_id = match field.text().await {
                    Ok(text) => text.trim().to_string(),
                    Err(err) => {
                        println!("UPLOAD: FAIL reading user_id: {:?}", err);

                        return (
                            StatusCode::BAD_REQUEST,
                            Json(UploadResponse {
                                status: "FAIL:ID inválido".to_string(),
                                message: "El user_id proporcionado no es válido.".to_string(),
                            }),
                        )
                            .into_response();
                    }
                };

                println!("UPLOAD: user_id = {}", user_id);

                match db()
                    .users()
                    .find_one(mongodb::bson::doc! { "id": &user_id })
                    .await
                {
                    Ok(Some(user)) => {
                        println!(
                            "UPLOAD: User verified: {} {}",
                            user.name, user.last_name
                        );
                    }

                    Ok(None) => {
                        println!("UPLOAD: User not found");

                        return (
                            StatusCode::NOT_FOUND,
                            Json(UploadResponse {
                                status: "FAIL:Usuario no encontrado".to_string(),
                                message: "El usuario no existe.".to_string(),
                            }),
                        )
                            .into_response();
                    }

                    Err(err) => {
                        println!("UPLOAD: Database error: {:?}", err);

                        return (
                            StatusCode::INTERNAL_SERVER_ERROR,
                            Json(UploadResponse {
                                status: "FAIL:Error de base de datos".to_string(),
                                message: "Error consultando la base de datos.".to_string(),
                            }),
                        )
                            .into_response();
                    }
                }
            }

            "file" => {
                if user_id.is_empty() {
                    println!("UPLOAD: File received before user_id");

                    return (
                        StatusCode::BAD_REQUEST,
                        Json(UploadResponse {
                            status: "FAIL:Orden incorrecto".to_string(),
                            message: "Debe enviar primero el user_id.".to_string(),
                        }),
                    )
                        .into_response();
                }

                // FIX: Own the filename before consuming `field`.
                let original_name = field
                    .file_name()
                    .unwrap_or("file.bin")
                    .to_string();

                println!("UPLOAD: Original filename: {}", original_name);

                let data = match field.bytes().await {
                    Ok(bytes) => bytes,
                    Err(err) => {
                        println!("UPLOAD: FAIL reading file: {:?}", err);

                        return (
                            StatusCode::INTERNAL_SERVER_ERROR,
                            Json(UploadResponse {
                                status: "FAIL:Error de lectura".to_string(),
                                message: "No se pudo leer el archivo.".to_string(),
                            }),
                        )
                            .into_response();
                    }
                };

                println!("UPLOAD: File size: {} bytes", data.len());

                let extension = Path::new(&original_name)
                    .extension()
                    .and_then(|e| e.to_str())
                    .unwrap_or("bin");

                let filename = format!("{}.{}", user_id, extension);
                let filepath = PathBuf::from(upload_dir).join(filename);

                println!("UPLOAD: Saving to {:?}", filepath);

                if let Err(err) = fs::write(&filepath, &data).await {
                    println!("UPLOAD: FAIL saving file: {:?}", err);

                    return (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(UploadResponse {
                            status: "FAIL:Error al guardar".to_string(),
                            message: "No se pudo guardar el archivo.".to_string(),
                        }),
                    )
                        .into_response();
                }

                println!("UPLOAD: File saved successfully");

                file_saved = true;
            }

            _ => {
                println!("UPLOAD: Ignoring unknown field '{}'", field_name);
            }
        }
    }

    if !file_saved {
        println!("UPLOAD: No file uploaded");

        return (
            StatusCode::BAD_REQUEST,
            Json(UploadResponse {
                status: "FAIL:Sin archivo".to_string(),
                message: "No se proporcionó ningún archivo.".to_string(),
            }),
        )
            .into_response();
    }

    println!("UPLOAD: Success");
    println!("=========== UPLOAD END ===========");

    (
        StatusCode::OK,
        Json(UploadResponse {
            status: "OK:Archivo subido".to_string(),
            message: "El archivo se subió correctamente.".to_string(),
        }),
    )
        .into_response()
}
use aes_gcm::{
    aead::{Aead, AeadCore, KeyInit, OsRng},
    Aes256Gcm, Nonce
};
use argon2::{
    password_hash::{SaltString},
    Argon2
};
use base64::engine::general_purpose::STANDARD;
use base64::Engine;
use anyhow::{Result, anyhow};
use sha2::{Sha256, Sha512, Digest};
use sha3::Sha3_256;
use rand::RngCore;

pub struct CryptoService {
    master_key: [u8; 32],
}

impl CryptoService {

    pub fn new() -> Self {
        let mut key = [0u8; 32];
        OsRng.fill_bytes(&mut key);
        Self { master_key: key }
    }

    pub fn from_key(key: [u8; 32]) -> Self {
        Self { master_key: key }
    }

    pub fn salt() -> String {
        let salt = SaltString::generate(&mut OsRng);
        salt.as_str().to_string()
    }
    /// Deterministic hash with SHA-256
    pub fn deterministic_hash(&self, data: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(data.as_bytes());
        hasher.update(self.master_key);
        let result = hasher.finalize();
        hex::encode(result)
    }

    /// Deterministic hash with SHA-512/256
    pub fn deterministic_hash_sha512(&self, data: &str) -> String {
        let mut hasher = Sha512::new();
        hasher.update(data.as_bytes());
        hasher.update(self.master_key);
        let result = hasher.finalize();
        hex::encode(&result[0..32])
    }

    /// Deterministic hash with SHA3-256
    pub fn deterministic_hash_sha3(&self, data: &str) -> String {
        let mut hasher = Sha3_256::new();
        hasher.update(data.as_bytes());
        hasher.update(self.master_key);
        let result = hasher.finalize();
        hex::encode(result)
    }

    /// Non-deterministic hash (salted)
    pub fn non_deterministic_hash(&self, data: &str) -> Result<String> {
        let mut salt = [0u8; 16];
        OsRng.fill_bytes(&mut salt);
        
        let argon2 = Argon2::default();
        let salt_string = SaltString::encode_b64(&salt)
            .map_err(|_| anyhow!("Failed to encode salt"))?;
        
        let mut output = [0u8; 32];
        argon2.hash_password_into(
            data.as_bytes(), 
            salt_string.as_str().as_bytes(), 
            &mut output
        ).map_err(|_| anyhow!("Hashing failed"))?;
        
        let mut result = salt.to_vec();
        result.extend(output);
        
        Ok(STANDARD.encode(result))
    }

    /// Verify non-deterministic hash
    pub fn verify_non_deterministic_hash(&self, data: &str, hash: &str) -> Result<bool> {
        let hash_bytes = STANDARD.decode(hash)?;
        
        if hash_bytes.len() < 16 + 32 {
            return Err(anyhow!("Invalid hash format"));
        }
        
        let (salt_bytes, original_hash) = hash_bytes.split_at(16);
        
        let argon2 = Argon2::default();
        let salt_string = SaltString::encode_b64(salt_bytes)
            .map_err(|_| anyhow!("Failed to decode salt"))?;
        
        let mut computed_hash = [0u8; 32];
        argon2.hash_password_into(
            data.as_bytes(), 
            salt_string.as_str().as_bytes(), 
            &mut computed_hash
        ).map_err(|_| anyhow!("Hashing failed"))?;
        
        Ok(computed_hash == original_hash)
    }

    /// Encrypt with salt
    pub fn encrypt_with_salt(&self, plaintext: &str, password: &str) -> Result<String> {
        let salt: SaltString = SaltString::generate(&mut OsRng);
        
        let argon2 = Argon2::default();
        let mut derived_key = [0u8; 32];
        argon2.hash_password_into(
            password.as_bytes(), 
            salt.as_str().as_bytes(), 
            &mut derived_key
        ).map_err(|_| anyhow!("Key derivation failed"))?;
        
        let cipher = Aes256Gcm::new_from_slice(&derived_key)
            .map_err(|_| anyhow!("Failed to create cipher"))?;
        
        let nonce = Aes256Gcm::generate_nonce(&mut OsRng);
        let ciphertext = cipher.encrypt(&nonce, plaintext.as_bytes())
            .map_err(|_| anyhow!("Encryption failed"))?;
        
        let mut result = salt.as_str().as_bytes().to_vec();
        result.extend(nonce.to_vec());
        result.extend(ciphertext);
        
        Ok(STANDARD.encode(result))
    }

    /// Decrypt with salt
    pub fn decrypt_with_salt(&self, encrypted_data: &str, password: &str) -> Result<String> {
    let data = STANDARD.decode(encrypted_data)?;
    
    if data.len() < 22 + 12 {
        return Err(anyhow!("Invalid encrypted data"));
    }
    
    let salt_bytes = &data[0..22];
    let salt = SaltString::from_b64(std::str::from_utf8(salt_bytes)?)
        .map_err(|e| anyhow!("Invalid salt: {}", e))?;  // Convert error here
    
    let (nonce_bytes, ciphertext) = data[22..].split_at(12);
    let nonce = Nonce::from_slice(nonce_bytes);
    
    let argon2 = Argon2::default();
    let mut derived_key = [0u8; 32];
    argon2.hash_password_into(
        password.as_bytes(), 
        salt.as_str().as_bytes(), 
        &mut derived_key
    ).map_err(|_| anyhow!("Key derivation failed"))?;
    
    let cipher = Aes256Gcm::new_from_slice(&derived_key)
        .map_err(|_| anyhow!("Failed to create cipher"))?;
    
    let plaintext = cipher.decrypt(nonce, ciphertext)
        .map_err(|_| anyhow!("Decryption failed"))?;
    
    Ok(String::from_utf8(plaintext)?)
}
}
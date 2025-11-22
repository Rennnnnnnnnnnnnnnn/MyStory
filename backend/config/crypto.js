// crypto.js
import crypto from "crypto";

const SECRET_SALT = process.env.SECRET_SALT;        // Keep in .env
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'base64');    // Store securely (e.g., ENV)
const IV_LENGTH = 16;

// Encrypt
export function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return iv.toString("base64") + ":" + encrypted;
}

// Decrypt
export function decrypt(data) {
    const parts = data.split(":");
    const iv = Buffer.from(parts.shift(), "base64");
    const encryptedText = parts.join(":");

    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}

// Blind index (SHA-256 + secret salt)
export function blindIndex(value) {
    return crypto
        .createHash("sha256")
        .update(value + SECRET_SALT)
        .digest("hex");
}



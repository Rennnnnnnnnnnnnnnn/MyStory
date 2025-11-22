import db from '../config/db.js';
import dotenv from 'dotenv';
import argon2 from 'argon2';
import { blindIndex, encrypt, decrypt } from "../config/crypto.js";

dotenv.config();

// REGISTER USER
export const registerUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required!" });
    }
    try {
        // Generate blind index
        const emailIndex = blindIndex(email);
        // Check if encrypted email index already exists
        const [existing] = await db.query(
            "SELECT * FROM users WHERE email_index = ?",
            [emailIndex]
        );
        if (existing.length > 0) {
            return res.status(409).json({ error: "Email already exists" });
        }
        // Encrypt email
        const encryptedEmail = encrypt(email);
        // Hash password with pepper (your existing logic)
        const passwordWithPepper = password + process.env.PEPPER_KEY;
        const hashedPassword = await argon2.hash(passwordWithPepper);
        // Insert encrypted email + blind index
        await db.query(
            "INSERT INTO users (email_encrypted, email_index, password) VALUES (?, ?, ?)",
            [encryptedEmail, emailIndex, hashedPassword]
        );
        return res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};


// LOGIN USER
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required!" });
    }

    try {
        // Generate blind index from provided email
        const emailIndex = blindIndex(email);

        const [rows] = await db.query(
            'SELECT * FROM users WHERE email_index = ?',
            [emailIndex]
        );

        if (rows.length === 0) {
            return res.status(400).json({ error: "User not found!" });
        }

        const user = rows[0];
    
        // Verify password
        const valid = await argon2.verify(user.password, password + process.env.PEPPER_KEY);

        if (!valid) {
            return res.status(401).json({ error: "Invalid password!" });
        }

        // Decrypt email for return
        const decryptedEmail = decrypt(user.email_encrypted);

        const userData = {
            user_id: user.user_id,
            email: decryptedEmail
        };
    
        return res.status(200).json({ message: "Login successful!", userData });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};


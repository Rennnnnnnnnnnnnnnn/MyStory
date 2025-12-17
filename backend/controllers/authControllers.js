import db from '../config/db.js';
import dotenv from 'dotenv';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { blindIndex, encrypt, decrypt } from "../config/crypto.js";

dotenv.config();

// REGISTER USER
export const registerUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required!" });
    }
    try {
        const emailIndex = blindIndex(email);
        const [existing] = await db.query(
            "SELECT * FROM users WHERE email_index = ?",
            [emailIndex]
        );
        if (existing.length > 0) {
            return res.status(409).json({ error: "Email already exists" });
        }

        const encryptedEmail = encrypt(email);

        const passwordWithPepper = password + process.env.PEPPER_KEY;
        const hashedPassword = await argon2.hash(passwordWithPepper);

        await db.query(
            "INSERT INTO users (email_encrypted, email_index, password) VALUES (?, ?, ?)",
            [encryptedEmail, emailIndex, hashedPassword]
        );
        return res.status(201).json({ message: "Account registered successfully." });
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
        const valid = await argon2.verify(user.password, password + process.env.PEPPER_KEY);
        if (!valid) {
            return res.status(401).json({ error: "Invalid password!" });
        }

        const decryptedEmail = decrypt(user.email_encrypted);
        const userData = {
            user_id: user.user_id,
            email: decryptedEmail
        };
        const accessToken = jwt.sign(userData, process.env.JWT_SECRET_ACCESS_KEY, {
            expiresIn: '5m',
            algorithm: 'HS256'
        })
        const refreshToken = jwt.sign(userData, process.env.JWT_SECRET_REFRESH_KEY, {
            expiresIn: '7d',
            algorithm: 'HS256'
        });
        //VALUES STILL TO BE CHANGED
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        //VALUES STILL TO BE CHANGED
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 5000
        })
        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);
        return res.status(200).json({ message: "Login successful!", userData });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};


export const verifyUser = (req, res) => {
    res.json({
        message: 'Access token refreshed successfully',
    });
};


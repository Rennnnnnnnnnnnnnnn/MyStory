import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { verify } from 'argon2';
import { verifyJwt } from './verifyJwt.js';

dotenv.config();

const authenticate = (req, res, next) => {

    const accessToken = req.cookies.accessToken;

    if (accessToken) {
        const result = verifyJwt(accessToken, process.env.JWT_SECRET_ACCESS_KEY);

        if (result.valid) {
            req.user = result.decoded;
            next();
        }
    }

    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && refreshToken) {

        if (!refreshToken) {
            return res.status(401).json({ error: "Unauthorized1. No refresh token!" })
        }

        const refreshResult = verifyJwt(refreshToken, process.env.JWT_SECRET_REFRESH_KEY);

        if (!refreshResult.valid) {
            return res.status(401).json({ error: "Unauthorized2. No refresh token!" })
        }

        const newAccessToken = jwt.sign(
            { user_id: refreshResult.decoded.user_id, email: refreshResult.decoded.email },
            process.env.JWT_SECRET_ACCESS_KEY,
            { expiresIn: "15m" }
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        console.log("New acces token issued")
        req.user = refreshResult.decoded;
        return next();
    }

    return res.status(401).json({ error: "Unauthorized3. No valid token provided." })
}





export default authenticate;
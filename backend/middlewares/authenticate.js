import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { verifyJwt } from './verifyJwt.js';

dotenv.config();

const authenticate = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    try {
        if (accessToken) {
            const result = verifyJwt(accessToken, process.env.JWT_SECRET_ACCESS_KEY);

            if (result.valid) {
                req.userData = result.decoded;
                return next();
            } else if (result.expired) {
                console.log('Access token expired. Attempting refresh token...');
            } else {
                return res.status(401).json({ error: 'Unauthorized: Invalid access token.' });
            }
        }

        if (refreshToken) {
            const refreshResult = verifyJwt(refreshToken, process.env.JWT_SECRET_REFRESH_KEY);

            if (!refreshResult.valid) {
                return res.status(401).json({ error: 'Unauthorized: Invalid refresh token.' });
            }

            if (refreshResult.expired) {
                return res.status(401).json({ error: 'Unauthorized: Refresh token expired.' });
            }

            const newAccessToken = jwt.sign(
                { user_id: refreshResult.decoded.user_id, email: refreshResult.decoded.email },
                process.env.JWT_SECRET_ACCESS_KEY,
                { expiresIn: '15m' }
            );

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000
            });

            console.log('New access token issued via refresh token.');

            req.userData = refreshResult.decoded;
            return next();
        }

        return res.status(401).json({ error: 'Unauthorized: No valid token provided.' });

    } catch (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export default authenticate;

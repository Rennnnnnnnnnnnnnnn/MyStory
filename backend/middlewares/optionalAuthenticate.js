import { verifyJwt } from "./verifyJwt.js";

const optionalAuthenticate = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    try {
        if (accessToken) {
            const result = verifyJwt(accessToken, process.env.JWT_SECRET_ACCESS_KEY);
            if (result.valid) {
                req.userData = result.decoded;
            }
            // if invalid/expired, just ignore and continue
        } else if (refreshToken) {
            const refreshResult = verifyJwt(refreshToken, process.env.JWT_SECRET_REFRESH_KEY);
            if (refreshResult.valid && !refreshResult.expired) {
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
                req.userData = refreshResult.decoded;
            }
        }

        // Always call next, even if no valid token exists
        next();
    } catch (err) {
        console.error('optionalAuthenticate Authentication error:', err);
        // still continue for optional auth
        next();
    }
};

export default optionalAuthenticate;
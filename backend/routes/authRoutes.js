import express from 'express';
import { registerUser, loginUser } from '../controllers/authControllers.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get('/verifyUser', authenticate, (req, res) => {
    res.json({ message: 'User is verified!', user: req.user });
    console.log("BERIPAYD USER");
});

export default router;


// Environment variables
import dotenv from 'dotenv';
// Core libraries
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
// Database
import db from './config/db.js';
// Middlewares
import loggerHandling from './middlewares/loggerHandling.js';
import errorHandling from './middlewares/errorHandling.js';
import notFoundHandling from './middlewares/notFoundHandling.js';
import authenticate from './middlewares/authenticate.js';
// Routes
import authRoutes from './routes/authRoutes.js';
import storyRoutes from './routes/storyRoutes.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 1000;


app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true               
}));

app.use(loggerHandling);
app.use(express.json());
app.use(cookieParser());
async function testDbConnection() {
    try {
        const connection = await db.getConnection();
        connection.release();
        console.log("Database connection successful!");
    } catch (err) {
        console.error("Database connection failed: ", err);
        process.exit(1);
    }
}

app.use("/api/auth", authRoutes);
app.use("/api/story", authenticate, storyRoutes);

app.use(errorHandling);
app.use(notFoundHandling);

app.listen(PORT, async () => {
    console.log(`server is running on port ${PORT}`);
    await testDbConnection();
});


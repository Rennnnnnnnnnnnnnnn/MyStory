import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import errorHandling from './middlewares/errorHandling.js';
import loggerHandling from './middlewares/loggerHandling.js';
import notFoundHandling from './middlewares/errorHandling.js';
import cors from 'cors';
import db from './config/db.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 1000;


app.use(cors());
app.use(loggerHandling);
app.use(express.json());

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

app.use("/api/auth" , authRoutes);


app.use(errorHandling);
app.use(notFoundHandling);

app.listen(PORT, async () => {
    console.log(`server is running on port ${PORT}`);
    await testDbConnection();
});



import logger from "#config/logger.js";
import securityMiddleware from "#middleware/security.middleware.js";
import authRoutes from "#routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(helmet())
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }));

app.use(securityMiddleware);

app.get("/", (req, res) => {
    logger.info("Hello from acquisitions!");
    res.status(200).send("Hello from acquisitions!");
})
app.get("/health", (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
})
app.get("/api", (req, res) => {
    res.status(200).json({
        message: "Acquisitions API is Running!",
    });
})

app.use('/api/auth', authRoutes);

export default app;
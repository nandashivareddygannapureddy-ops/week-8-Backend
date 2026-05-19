/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import exp from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import { UserApp } from "./APIs/UserAPI.js";
import cors from "cors";

config();

const app = exp();

// Enable CORS
app.use(cors({
    origin: [process.env.FRONTEND_URL, /\.vercel\.app$/],
    credentials: true
}));

// Parse JSON
app.use(exp.json());

// Mount API routes
app.use("/user-api", UserApp);

// Root route for health check
app.get("/", (req, res) => {
    res.send("User Management API is running...");
});

const port = process.env.PORT || 4000;
app.listen(port, () =>
    console.log(`Server started on port ${port}`)
);
// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    if (err.name === "ValidationError") {
        return res.status(400).json({ message: "Validation failed", errors: err.errors });
    }
    if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    if (err.code === 11000) {
        return res.status(409).json({ message: "Duplicate field value" });
    }
    res.status(500).json({ message: "Internal Server Error" });
});

export default app;
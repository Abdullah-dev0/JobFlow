import connectDB from "./lib/db";
import express from "express";
import authRouter from "./routes/auth.route";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import jobRouter from "./routes/job.route";
import { authenticate } from "./middleware";
import cors from "cors";

export const app = express();

app.use(
	cors({
		origin: "http://localhost:5173",
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true, // only if you're sending cookies/auth headers
	}),
);

app.use(express.json()); // lets you read req.body as
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/job", authenticate, jobRouter);

app.get("/", (_req, res) => {
	res.json({ message: "Job Application Tracker API is running" });
});

connectDB(); // your mongoose connection

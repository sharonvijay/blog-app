import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

import { fileURLToPath } from "url"; // Import fileURLToPath
import { dirname } from "path"; // Import dirname

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

//Middlewares

// Configure CORS to allow requests from 'https://sharonvijay-blog-app.vercel.app'
// app.use(
// 	cors({
// 		origin: "https://sharonvijay-blog-app.vercel.app",
// 		credentials: true, // Allow credentials (cookies) to be sent
// 	})
// );
app.use(cors());

// Handle preflight requests
app.options("*", (req, res) => {
	res.setHeader(
		"Access-Control-Allow-Origin",
		"https://sharonvijay-blog-app.vercel.app"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS"
	);
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.status(200).end();
});

app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));

const PORT = 5000;
// DB Connection
connectDB().catch((error) => {
	console.error(`Failed to connect to MongoDB: ${error.message}`);
	process.exit(1);
});
// API ROUTES
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.listen(PORT, () => {
	console.log(`Server is running on Port ${PORT}`);
});

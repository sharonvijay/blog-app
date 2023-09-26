import express from "express";
const router = express.Router();
import {
	registerUser,
	loginUser,
	logoutUser,
	getUser,
} from "../controllers/userControllers.js";
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", getUser);
export default router;

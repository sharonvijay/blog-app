import express from "express";
import multer from "multer";
import {
	uploadPost,
	updatePost,
	getPosts,
	getPost,
} from "../controllers/postControllers.js";
const router = express.Router();
const uploadMiddleware = multer({ dest: "uploads/" });
router.post("/upload", uploadMiddleware.single("file"), uploadPost);
router.put("/update", uploadMiddleware.single("file"), updatePost);
router.get("/", getPosts);
router.get("/:id", getPost);
export default router;

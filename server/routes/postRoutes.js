import express from "express";
import multer from "multer";
import {
	uploadPost,
	updatePost,
	getPosts,
	getPost,
} from "../controllers/postControllers.js";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post("/upload", upload.single("file"), uploadPost);
router.put("/update", upload.single("file"), updatePost);
router.get("/", getPosts);
router.get("/:id", getPost);
export default router;

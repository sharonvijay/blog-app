import express from "express";
import multer from "multer";
import {
	uploadPost,
	updatePost,
	getPosts,
	getPost,
} from "../controllers/postControllers.js";
const router = express.Router();

router.post("/upload", uploadPost);
router.put("/update", updatePost);
router.get("/", getPosts);
router.get("/:id", getPost);
export default router;

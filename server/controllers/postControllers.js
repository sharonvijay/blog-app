import asyncHandler from "express-async-handler";
import fs from "fs";
import jwt from "jsonwebtoken";
import Post from "../models/Post.js";
import cloudinary from "cloudinary";

const secret = "asdfe45we45w345wegw345werjktjwertkj";

// Configure Cloudinary
cloudinary.config({
	cloud_name: "sharonvijay", // Your cloud name
	api_key: "your_api_key", // Your API key
	api_secret: "your_api_secret", // Your API secret
});

// uploadPost
const uploadPost = asyncHandler(async (req, res) => {
	var token = req.headers.authorization.split(" ")[1];

	jwt.verify(token, secret, {}, async (err, info) => {
		if (err) throw err;
		const { title, summary, content, cover } = req.body;

		try {
			const postDoc = await Post.create({
				title,
				summary,
				content,
				cover,
				author: info.id,
			});
			res.json(postDoc);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	});
});

// updatePost
const updatePost = asyncHandler(async (req, res) => {
	var token = req.headers.authorization.split(" ")[1];

	jwt.verify(token, secret, {}, async (err, info) => {
		if (err) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const { id, title, summary, content, cover } = req.body;

		const postDoc = await Post.findById(id);

		if (!postDoc) {
			return res.status(404).json({ error: "Post not found" });
		}

		const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

		if (!isAuthor) {
			return res.status(400).json({ error: "You are not the author" });
		}

		try {
			postDoc.title = title;
			postDoc.summary = summary;
			postDoc.content = content;
			postDoc.cover = cover;

			// Save the updated document
			await postDoc.save();
			res.json(postDoc);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	});
});

// getPosts
const getPosts = asyncHandler(async (req, res) => {
	res.json(
		await Post.find()
			.populate("author", ["username"])
			.sort({ createdAt: -1 })
			.limit(20)
	);
});

// getPost
const getPost = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const postDoc = await Post.findById(id).populate("author", ["username"]);
	res.json(postDoc);
});

export { uploadPost, updatePost, getPosts, getPost };

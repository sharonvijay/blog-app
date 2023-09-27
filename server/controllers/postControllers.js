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
	const { originalname, path } = req.file;
	console.log("Path " + path);
	console.log("Original Name " + originalname);
	const parts = originalname.split(".");
	const ext = parts[parts.length - 1];
	const newPath = path + "." + ext;
	fs.renameSync(path, newPath);

	const { token } = req.cookies;
	jwt.verify(token, secret, {}, async (err, info) => {
		if (err) throw err;
		const { title, summary, content } = req.body;

		try {
			// Upload the image to Cloudinary
			const cloudinaryResult = await cloudinary.uploader.upload(newPath);

			const postDoc = await Post.create({
				title,
				summary,
				content,
				cover: cloudinaryResult.secure_url, // Store Cloudinary URL
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
	let cloudinaryResult = null;

	if (req.file) {
		const { originalname, buffer } = req.file;
		const parts = originalname.split(".");
		const ext = parts[parts.length - 1];

		try {
			// Upload the new image to Cloudinary
			cloudinaryResult = await cloudinary.uploader.upload_stream(
				{ resource_type: "image", format: ext },
				(error, result) => {
					if (error) {
						console.error(error);
						return res
							.status(500)
							.json({ error: "File upload to Cloudinary failed" });
					}
					cloudinaryResult = result; // Update cloudinaryResult with the result
				}
			);
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.json({ error: "File upload to Cloudinary failed" });
		}
	}

	const { token } = req.cookies;
	jwt.verify(token, secret, {}, async (err, info) => {
		if (err) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const { id, title, summary, content } = req.body;
		const postDoc = await Post.findById(id);

		if (!postDoc) {
			return res.status(404).json({ error: "Post not found" });
		}

		const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

		if (!isAuthor) {
			return res.status(400).json({ error: "You are not the author" });
		}

		try {
			if (cloudinaryResult) {
				// Update the document fields with the new Cloudinary URL
				postDoc.title = title;
				postDoc.summary = summary;
				postDoc.content = content;
				postDoc.cover = cloudinaryResult.secure_url;
			} else {
				// No new image uploaded, update other fields only
				postDoc.title = title;
				postDoc.summary = summary;
				postDoc.content = content;
			}

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

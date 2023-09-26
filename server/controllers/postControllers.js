import asycnHandler from "express-async-handler";
import fs from "fs";
import jwt from "jsonwebtoken";
import Post from "../models/Post.js";

const secret = "asdfe45we45w345wegw345werjktjwertkj";

//uploadPost
const uploadPost = asycnHandler(async (req, res) => {
	const { originalname, path } = req.file;
	const parts = originalname.split(".");
	const ext = parts[parts.length - 1];
	const newPath = path + "." + ext;
	fs.renameSync(path, newPath);

	const { token } = req.cookies;
	jwt.verify(token, secret, {}, async (err, info) => {
		if (err) throw err;
		const { title, summary, content } = req.body;
		const postDoc = await Post.create({
			title,
			summary,
			content,
			cover: newPath,
			author: info.id,
		});
		res.json(postDoc);
	});
});

//updatePost
const updatePost = asycnHandler(async (req, res) => {
	let newPath = null;

	if (req.file) {
		const { originalname, path } = req.file;
		const parts = originalname.split(".");
		const ext = parts[parts.length - 1];
		newPath = path + "." + ext;
		fs.renameSync(path, newPath);
	}

	const { token } = req.cookies;
	jwt.verify(token, secret, {}, async (err, info) => {
		if (err) throw err;
		const { id, title, summary, content } = req.body;
		const postDoc = await Post.findById(id);
		const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
		if (!isAuthor) {
			return res.status(400).json("you are not the author");
		}
		// Update the document fields
		postDoc.title = title;
		postDoc.summary = summary;
		postDoc.content = content;
		if (newPath) {
			postDoc.cover = newPath;
		}

		// Save the updated document
		await postDoc.save();

		res.json(postDoc);
	});
});

//getPosts
const getPosts = asycnHandler(async (req, res) => {
	res.json(
		await Post.find()
			.populate("author", ["username"])
			.sort({ createdAt: -1 })
			.limit(20)
	);
});

//getPost
const getPost = asycnHandler(async (req, res) => {
	const { id } = req.params;
	const postDoc = await Post.findById(id).populate("author", ["username"]);
	res.json(postDoc);
});
export { uploadPost, updatePost, getPosts, getPost };

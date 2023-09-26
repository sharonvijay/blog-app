import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const salt = bcrypt.genSaltSync(10);
const secret = "asdfe45we45w345wegw345werjktjwertkj";

//Register
const registerUser = asyncHandler(async (req, res) => {
	const { username, password } = req.body;
	try {
		const userDoc = await User.create({
			username,
			password: bcrypt.hashSync(password, salt),
		});
		res.json(userDoc);
	} catch (e) {
		console.log(e);
		res.status(400).json(e);
	}
});

//Login
const loginUser = asyncHandler(async (req, res) => {
	const { username, password } = req.body;
	const userDoc = await User.findOne({ username });
	const passOk = bcrypt.compareSync(password, userDoc.password);
	if (passOk) {
		// logged in
		jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
			if (err) throw err;
			res.cookie("token", token).json({
				id: userDoc._id,
				username,
			});
		});
	} else {
		res.status(400).json("wrong credentials");
	}
});

//Logout
const logoutUser = asyncHandler(async (req, res) => {
	res.cookie("token", "").json("ok");
});

//Profile
const getUser = asyncHandler(async (req, res) => {
	const { token } = req.cookies;

	try {
		const info = jwt.verify(token, secret, {});
		res.json(info);
	} catch (error) {
		console.error("JWT verification error:", error);
		res.status(401).json({ message: "Unauthorized" });
	}
});
export { registerUser, loginUser, logoutUser, getUser };

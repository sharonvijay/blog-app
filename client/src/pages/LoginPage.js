import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const LoginPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [redirect, setRedirect] = useState(false);

	const navigate = useNavigate();
	const { setUserInfo } = useContext(UserContext);

	async function login(ev) {
		ev.preventDefault();
		const response = await fetch(
			"https://sharonvijay-blog-app-api.vercel.app/api/user/login",
			{
				method: "POST",
				body: JSON.stringify({ username, password }),
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			}
		);
		if (response.ok) {
			response.json().then((userInfo) => {
				// setUserInfo(userInfo);
				setRedirect(true);

				// Fetch user information here and update the context
				fetchUserInfoAndSetContext();
			});
		} else {
			alert("wrong credentials");
		}
	}
	async function fetchUserInfoAndSetContext() {
		try {
			const response = await fetch(
				"https://sharonvijay-blog-app-api.vercel.app/api/user/profile",
				{
					credentials: "include",
				}
			);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const userInfo = await response.json();
			setUserInfo(userInfo);
			navigate("/");
		} catch (error) {
			console.error("Error fetching user profile:", error);
		}
	}
	if (redirect) {
		return null;
	}
	return (
		<form className="login" onSubmit={login}>
			<h1>Login</h1>
			<input
				type="text"
				placeholder="username"
				value={username}
				onChange={(ev) => setUsername(ev.target.value)}
			/>
			<input
				type="password"
				placeholder="password"
				value={password}
				onChange={(ev) => setPassword(ev.target.value)}
			/>
			<button>Login</button>
		</form>
	);
};

export default LoginPage;

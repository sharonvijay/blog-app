import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const LoginPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	//const [redirect, setRedirect] = useState(false);

	const navigate = useNavigate();
	const { setUserInfo } = useContext(UserContext);

	useEffect(() => {
		const token = localStorage.getItem("authToken");
		if (token) {
			const userInfo = JSON.parse(localStorage.getItem("userInfo"));
			if (userInfo) {
				setUserInfo(userInfo);
			}
			navigate("/");
		}
	}, [navigate, setUserInfo]);

	async function login(ev) {
		ev.preventDefault();
		const response = await fetch(
			"https://sharonvijay-blog-app-api.onrender.com/api/user/login",
			{
				method: "POST",
				body: JSON.stringify({ username, password }),
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			}
		);
		if (response.ok) {
			const userInfo = await response.json();
			console.log(userInfo.token);

			// Store the user info in localStorage
			localStorage.setItem("userInfo", JSON.stringify(userInfo));

			// Store the authentication token in localStorage
			localStorage.setItem("authToken", userInfo.token);

			setUserInfo(userInfo);
			navigate("/");
		} else {
			alert("wrong credentials");
		}
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

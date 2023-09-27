import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
const Header = () => {
	const { setUserInfo, userInfo } = useContext(UserContext);

	function logout() {
		// Clear the authentication token from localStorage
		localStorage.removeItem("authToken");

		fetch("https://sharonvijay-blog-app-api.onrender.com/api/user/logout", {
			credentials: "include",
			method: "POST",
		})
			.then(() => {
				setUserInfo(null);
			})
			.catch((error) => {
				console.error("Logout error:", error);
			});
	}

	const username = userInfo?.username;

	return (
		<header>
			<Link to="/" className="logo">
				MyBlog
			</Link>
			<nav>
				{username && (
					<>
						<Link to="/create">Create new post</Link>
						<button
							onClick={logout}
							style={{
								background: "grey",
								border: "none",
								cursor: "pointer",
								textDecoration: "none",
							}}>
							Logout ({username})
						</button>
					</>
				)}
				{!username && (
					<>
						<Link to="/login">Login</Link>
						<Link to="/register">Register</Link>
					</>
				)}
			</nav>
		</header>
	);
};

export default Header;

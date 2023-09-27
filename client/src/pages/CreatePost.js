import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";
import "react-quill/dist/quill.snow.css";
const CreatePost = () => {
	const [title, setTitle] = useState("");
	const [summary, setSummary] = useState("");
	const [content, setContent] = useState("");
	const [files, setFiles] = useState("");
	const [redirect, setRedirect] = useState(false);

	async function createNewPost(ev) {
		ev.preventDefault();

		// Upload the image to Cloudinary
		const cloudinaryUrl =
			"https://api.cloudinary.com/v1_1/sharonvijay/image/upload";
		const formData = new FormData();
		console.log("Selected File: ", files[0]);

		formData.append("file", files[0]);
		formData.append("upload_preset", "blog-app");
		formData.append("cloud_name", "sharonvijay");

		const cloudinaryResponse = await fetch(cloudinaryUrl, {
			method: "POST",
			body: formData,
		});

		if (!cloudinaryResponse.ok) {
			// Handle Cloudinary upload error
			console.error("Error uploading image to Cloudinary");
			return;
		}

		const cloudinaryData = await cloudinaryResponse.json();
		const imageUrl = cloudinaryData.secure_url;

		console.log(imageUrl);

		const data = new FormData();
		data.set("title", title);
		data.set("summary", summary);
		data.set("content", content);
		data.set("file", imageUrl);

		// Include cookies in the fetch request
		const cookies = document.cookie; // Get cookies from the document
		const headers = new Headers({
			Cookie: cookies, // Pass the cookies in the request headers
		});

		const response = await fetch(
			"https://sharonvijay-blog-app-api.onrender.com/api/post/upload",
			{
				method: "POST",
				body: data,
				credentials: "include",
				headers: headers,
			}
		);
		if (response.ok) {
			setRedirect(true);
		}
	}

	if (redirect) {
		return <Navigate to={"/"} />;
	}

	return (
		<form onSubmit={createNewPost}>
			<input
				type="title"
				placeholder={"Title"}
				value={title}
				onChange={(ev) => setTitle(ev.target.value)}
			/>
			<input
				type="summary"
				placeholder={"Summary"}
				value={summary}
				onChange={(ev) => setSummary(ev.target.value)}
			/>
			<input
				type="file"
				accept=".jpg, .jpeg, .png"
				onChange={(ev) => setFiles(ev.target.files)}
			/>
			<Editor value={content} onChange={setContent} />
			<button style={{ marginTop: "5px" }}>Create post</button>
		</form>
	);
};

export default CreatePost;

import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";
const EditPost = () => {
	const { id } = useParams();
	const [title, setTitle] = useState("");
	const [summary, setSummary] = useState("");
	const [content, setContent] = useState("");
	const [files, setFiles] = useState("");
	const [redirect, setRedirect] = useState(false);

	useEffect(() => {
		fetch("https://sharonvijay-blog-app-api.onrender.com/api/post/" + id).then(
			(response) => {
				response.json().then((postInfo) => {
					setTitle(postInfo.title);
					setContent(postInfo.content);
					setSummary(postInfo.summary);
				});
			}
		);
	}, [id]);

	async function updatePost(ev) {
		ev.preventDefault();

		// Upload the image to Cloudinary if a new image is selected
		let imageUrl = "";
		if (files?.[0]) {
			const cloudinaryUrl =
				"https://api.cloudinary.com/v1_1/sharonvijay/image/upload";
			const formData = new FormData();
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
			imageUrl = cloudinaryData.secure_url;
		}

		// Now, update the post data including the image URL
		const data = new FormData();
		data.set("title", title);
		data.set("summary", summary);
		data.set("content", content);
		data.set("id", id);
		data.set("cover", imageUrl); // Image URL from Cloudinary

		const token = localStorage.getItem("authToken");

		const headers = new Headers({
			Authorization: `Bearer ${token}`, // Set the Authorization header with the token
		});

		const response = await fetch(
			"https://sharonvijay-blog-app-api.onrender.com/api/post/update",
			{
				method: "PUT",
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
		return <Navigate to={"/post/" + id} />;
	}

	return (
		<form onSubmit={updatePost}>
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
			<input type="file" onChange={(ev) => setFiles(ev.target.files)} />
			<Editor onChange={setContent} value={content} />
			<button style={{ marginTop: "5px" }}>Update post</button>
		</form>
	);
};

export default EditPost;

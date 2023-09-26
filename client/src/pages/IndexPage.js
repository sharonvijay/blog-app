import { useEffect, useState } from "react";
import Post from "../components/Post";
const IndexPage = () => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		fetch("https://sharonvijay-blog-app-api.vercel.app/api/post").then(
			(response) => {
				response.json().then((posts) => {
					setPosts(posts);
				});
			}
		);
	}, []);

	return (
		<>
			{posts.length > 0 &&
				posts.map((post) => <Post key={post._id} {...post} />)}
		</>
	);
};

export default IndexPage;

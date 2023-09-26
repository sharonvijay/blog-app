import { useEffect, useState } from "react";
import Post from "../components/Post";
const IndexPage = () => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		fetch("http://localhost:5000/api/post").then((response) => {
			response.json().then((posts) => {
				setPosts(posts);
			});
		});
	}, []);

	return (
		<>
			{posts.length > 0 &&
				posts.map((post) => <Post key={post._id} {...post} />)}
		</>
	);
};

export default IndexPage;

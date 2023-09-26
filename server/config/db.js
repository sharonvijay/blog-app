import mongoose from "mongoose";

const connectDB = async () => {
	try {
		await mongoose.connect(
			"mongodb+srv://sharonvijay2003:sharonvijay2003@mern.72x3pbl.mongodb.net/blogappdb?retryWrites=true&w=majority"
		);
		console.log(`MongoDB Connected ${mongoose.connection.host}`);
	} catch (error) {
		console.log(`Error : ${error.message}`);
		process.exit(1);
	}
};

export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
	if (!process.env.MONGO_URI) {
		throw new Error("Missing Mongo url");
	}
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("MongoDB connected!");
	} catch (err) {
		if (err instanceof Error) {
			console.error("Error connecting to MongoDB:", err.message);
		} else {
			console.error("Error connecting to MongoDB:", err);
		}
		process.exit(1); // kill the server if DB fails
	}
};

export default connectDB;

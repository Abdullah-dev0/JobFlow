import type { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
	const { email, password, name } = req.body;

	try {
		if (!name || !password || !email) {
			throw new Error("fields should not be empty");
		}

		// check if there is an email in db or not
		const user = await User.findOne({ email });
		if (user) {
			throw new Error("there was an error while signup");
		}
		// has password if no user with this email
		const hashedPassword = await Bun.password.hash(password);

		//save into db

		await User.create({ name, email, password: hashedPassword });

		res.status(200).json({
			message: "signup successfully",
		});
	} catch (error) {
		res.status(500).json({ message: error instanceof Error ? error.message : "Something went worng while signup" });
	}
};

export const singin = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		if (!email || !password) {
			throw new Error("No email or password was given");
		}
		// first check if there is user in the db

		const user = await User.findOne({ email });

		if (!user) {
			throw new Error("incorret email or password");
		}
		// check the hashedPassword
		const isMatch = await Bun.password.verify(password, user.password);

		if (!isMatch) {
			throw new Error("password or Email incoorect");
		}
		// prepare the jwt

		const payload = { userId: user.id, email: user.email, id: user.id };

		const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

		const token = jwt.sign(payload, JWT_SECRET);

		// sent the jwt

		res.cookie("token", token, {
			httpOnly: true, // JS in browser CANNOT access it (prevents XSS attacks)
			secure: process.env.NODE_ENV === "production", // only HTTPS in prod
			sameSite: "strict", // prevents CSRF attacks
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
		});

		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
		});
	} catch (error) {
		res.status(500).json({ message: error instanceof Error ? error.message : "Something went worng while signup" });
	}
};

import type { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
	const { email, password, name } = req.body ?? {};

	if (!name || !password || !email) {
		return res.status(400).json({ message: "Name, email, and password are required." });
	}

	try {
		const user = await User.findOne({ email });
		if (user) {
			return res.status(409).json({ message: "An account with this email already exists." });
		}
		const hashedPassword = await Bun.password.hash(password);
		await User.create({ name, email, password: hashedPassword });

		return res.status(201).json({
			message: "signup successfully",
		});
	} catch {
		return res.status(500).json({ message: "Something went wrong while signing up" });
	}
};

export const singin = async (req: Request, res: Response) => {
	const { email, password } = req.body ?? {};

	if (!email || !password) {
		return res.status(400).json({ message: "Email and password are required." });
	}

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(401).json({ message: "Incorrect email or password." });
		}

		const isMatch = await Bun.password.verify(password, user.password);

		if (!isMatch) {
			return res.status(401).json({ message: "Incorrect email or password." });
		}

		const JWT_SECRET = process.env.JWT_SECRET;
		if (!JWT_SECRET) {
			return res.status(500).json({ message: "Server auth configuration is missing." });
		}

		const payload = { userId: user.id, email: user.email };
		const token = jwt.sign(payload, JWT_SECRET);

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
		});
	} catch {
		return res.status(500).json({ message: "Something went wrong while signing in" });
	}
};

export const logout = async (_req: Request, res: Response) => {
	try {
		res.clearCookie("token", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});

		return res.status(200).json({ message: "Logged out successfully" });
	} catch {
		return res.status(500).json({ message: "Something went wrong while logging out" });
	}
};

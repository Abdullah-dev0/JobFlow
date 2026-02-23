import type { AuthRequest } from "../middleware";
import User from "../models/user.model";
import type { Response } from "express";

export const getUser = async (req: AuthRequest, res: Response) => {
	if (!req.user) {
		return res.status(401).json({ message: "No token, unauthorized" });
	}

	try {
		const user = await User.findOne({ _id: req.user.userId });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.status(200).json({
			id: user?.id,
			email: user?.email,
			name: user?.name,
		});
	} catch {
		return res.status(500).json({ message: "Failed to fetch user" });
	}
};

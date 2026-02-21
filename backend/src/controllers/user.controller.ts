import type { AuthRequest } from "../middleware";
import User from "../models/user.model";
import type { Request, Response } from "express";

export const getUser = async (req: AuthRequest, res: Response) => {
	if (!req.user) {
		return res.status(401).json({ message: "No token, unauthorized" });
	}

	try {
		const user = await User.findOne({ _id: req.user.userId });

		if (!user) {
			throw new Error("User not found");
		}

		return res.status(200).json({
			userId: user?.id,
			email: user?.email,
			name: user?.name,
		});
	} catch (error) {
		return res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch jobs" });
	}
};

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
	userId: string;
	email: string;
	iat: number;
	id: string;
}

export interface AuthRequest extends Request {
	user?: JwtPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ message: "No token, unauthorized" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
};

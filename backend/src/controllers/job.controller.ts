import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware";
import Job from "../models/job.model";

export const createJob = async (req: AuthRequest, res: Response) => {
	const { company, role, status, dateApplied, notes } = req.body;

	if (!req.user) {
		return res.status(401).json({ message: "No token, unauthorized" });
	}

	try {
		const job = await Job.create({
			company,
			role,
			status,
			dateApplied,
			notes,
			createdBy: req.user.userId,
		});

		return res.status(201).json(job);
	} catch (error) {
		res.status(500).json({ message: error instanceof Error ? error.message : "Something went worng while signup" });
	}
};

export const updateJob = async (req: AuthRequest, res: Response) => {
	const { id } = req.params;

	if (!req.user) {
		return res.status(401).json({ message: "No token, unauthorized" });
	}

	try {
		const job = await Job.findOneAndUpdate({ _id: id, createdBy: req.user.userId }, req.body, { new: true });
		return res.status(201).json(job);
	} catch (error) {
		res.status(500).json({ message: error instanceof Error ? error.message : "Something went worng while signup" });
	}
};

export const getJobs = async (req: AuthRequest, res: Response) => {
	if (!req.user) {
		return res.status(401).json({ message: "No token, unauthorized" });
	}

	const page = parseInt(req.query.page as string) ?? 1;
	const limit = parseInt(req.query.limit as string) ?? 10;
	const statusFilter = req.query.status as string | undefined;

	const skip = (page - 1) * limit;

	try {
		const filter = { createdBy: req.user.userId, ...(statusFilter ? { status: statusFilter } : {}) };
		const [jobs, total] = await Promise.all([
			Job.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
			Job.countDocuments(filter),
		]);

		const allJobs = jobs.map((job) => ({
			id: String(job._id),
			company: job.company,
			role: job.role,
			status: job.status,
			dateApplied: job.dateApplied,
			notes: job.notes,
			createdAt: job.createdAt,
		}));

		console.log(allJobs);

		return res.status(200).json({ allJobs, total });
	} catch (error) {
		return res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch jobs" });
	}
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
	if (!req.user) {
		return res.status(401).json({ message: "No token, unauthorized" });
	}
	const { id } = req.params;

	try {
		const result = await Job.findOneAndDelete({ _id: id, createdBy: req.user.userId });
		if (!result) {
			return res.status(404).json({ message: "Job not found or you are not the owner" });
		}
		return res.status(200).end();
	} catch (error) {
		return res.status(500).json({ message: error instanceof Error ? error.message : "Failed to delete job" });
	}
};

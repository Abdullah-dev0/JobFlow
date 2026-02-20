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
			createdBy: req.user.id,
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
	try {
		const filter = { createdBy: req.user.userId };
		const [jobs, total] = await Promise.all([Job.find(filter).sort({ createdAt: -1 }), Job.countDocuments(filter)]);
		return res.status(200).json({ jobs, total });
	} catch (error) {
		return res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch jobs" });
	}
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
	if (!req.user) {
		return res.status(401).json({ message: "No token, unauthorized" });
	}
	const { id } = req.params;
	console.log(id, req.user.id);
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

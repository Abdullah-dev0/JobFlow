import type { Response } from "express";
import { Types } from "mongoose";
import type { AuthRequest } from "../middleware";
import Job from "../models/job.model";

export const createJob = async (req: AuthRequest, res: Response) => {
	const { company, role, status, dateApplied, notes } = req.body ?? {};

	if (!req.user) {
		return res.status(401).json({ message: "No token, unauthorized" });
	}

	if (!company || !role) {
		return res.status(400).json({ message: "Company and role are required." });
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
	} catch {
		return res.status(500).json({ message: "Failed to create job" });
	}
};

export const updateJob = async (req: AuthRequest, res: Response) => {
	const { id } = req.params;

	if (!req.user) {
		return res.status(401).json({ message: "No token, unauthorized" });
	}

	if (!id) {
		return res.status(400).json({ message: "Job id is required." });
	}

	try {
		const job = await Job.findOneAndUpdate({ _id: id, createdBy: req.user.userId }, req.body, { new: true });
		if (!job) {
			return res.status(404).json({ message: "Job not found or you are not the owner" });
		}
		return res.status(200).json(job);
	} catch {
		return res.status(500).json({ message: "Failed to update job" });
	}
};

export const getJobs = async (req: AuthRequest, res: Response) => {
	if (!req.user) {
		return res.status(401).json({ message: "No token, unauthorized" });
	}

	const rawPage = Number(req.query.page ?? 1);
	const rawLimit = Number(req.query.limit ?? 10);
	if (!Number.isFinite(rawPage) || rawPage < 1 || !Number.isFinite(rawLimit) || rawLimit < 1) {
		return res.status(400).json({ message: "Invalid pagination query values." });
	}

	const page = Math.floor(rawPage);
	const limit = Math.floor(rawLimit);
	const statusFilter = req.query.status as string | undefined;
	const searchFilter = (req.query.search as string | undefined)?.trim();

	const skip = (page - 1) * limit;

	try {
		const filter = {
			createdBy: req.user.userId,
			...(statusFilter ? { status: statusFilter } : {}),
			...(searchFilter
				? {
						$or: [
							{ company: { $regex: searchFilter, $options: "i" } },
							{ role: { $regex: searchFilter, $options: "i" } },
							{ notes: { $regex: searchFilter, $options: "i" } },
						],
					}
				: {}),
		};

		const [jobs, total] = await Promise.all([
			Job.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
			Job.countDocuments(filter),
		]);

		const allJobs = jobs.map((job) => ({
			...job,
			id: String(job._id),
		}));

		return res.status(200).json({ allJobs, total });
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Failed to fetch jobs", error: error instanceof Error ? error.message : "Unknown error" });
	}
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
	if (!req.user) {
		return res.status(401).json({ message: "No token, unauthorized" });
	}
	const { id } = req.body ?? {};

	if (!id) {
		return res.status(400).json({ message: "Job id is required." });
	}

	try {
		const result = await Job.findOneAndDelete({ _id: id, createdBy: req.user.userId });
		if (!result) {
			return res.status(404).json({ message: "Job not found or you are not the owner" });
		}
		return res.status(200).json({ message: "Job deleted successfully" });
	} catch {
		return res.status(500).json({ message: "Failed to delete job" });
	}
};

export const getJobbyId = async (req: AuthRequest, res: Response) => {
	if (!req.user) {
		return res.status(401).json({ message: "No token, unauthorized" });
	}

	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ message: "Invalid job id." });
	}

	try {
		const job = await Job.findOne({ _id: id, createdBy: req.user.userId }).lean();

		if (!job) {
			return res.status(404).json({ message: "Job not found or you are not the owner" });
		}

		const jobWithId = {
			...job,
			id: String(job._id),
		};

		return res.status(200).json(jobWithId);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Failed to fetch job", error: error instanceof Error ? error.message : "Unknown error" });
	}
};

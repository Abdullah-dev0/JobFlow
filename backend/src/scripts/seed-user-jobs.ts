import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user.model";
import Job from "../models/job.model";

const STATUSES = ["Applied", "Interviewing", "Offer", "Rejected", "Accepted"] as const;
const STAGES = [
	"Application Sent",
	"HR Screening",
	"Technical Interview",
	"Managerial Round",
	"Final Round",
	"Offer Review",
] as const;
const COMPANIES = [
	"Acme Corp",
	"TechStart Inc",
	"Global Solutions",
	"DataDrive",
	"CloudNine",
	"ByteWorks",
	"DevHub",
	"CodeCraft",
	"PixelPerfect",
	"InnovateLabs",
	"NextGen Systems",
	"AgileForce",
	"StackFlow",
	"WebScale",
	"API Masters",
];
const ROLES = [
	"Software Engineer",
	"Frontend Developer",
	"Backend Developer",
	"Full Stack Developer",
	"DevOps Engineer",
	"Data Engineer",
	"Product Manager",
	"UX Designer",
	"QA Engineer",
	"Technical Lead",
];

type SeedOptions = {
	userId: string;
	count: number;
	status?: (typeof STATUSES)[number];
};

function pickRandom<T>(items: readonly T[]): T {
	return items[Math.floor(Math.random() * items.length)] as T;
}

function randomDateWithinLastDays(days: number): Date {
	const now = Date.now();
	const dayMs = 24 * 60 * 60 * 1000;
	const offset = Math.floor(Math.random() * days) * dayMs;
	return new Date(now - offset);
}

function getArg(name: string): string | undefined {
	const prefixed = process.argv.find((arg) => arg.startsWith(`--${name}=`));
	if (prefixed) return prefixed.split("=").slice(1).join("=");

	const index = process.argv.findIndex((arg) => arg === `--${name}`);
	if (index !== -1) return process.argv[index + 1];

	return undefined;
}

function parseOptions(): SeedOptions {
	const userId = getArg("userId");
	const countRaw = getArg("count") ?? "10";
	const statusRaw = getArg("status");

	if (!userId) {
		throw new Error("Missing required argument: --userId");
	}

	const count = Number.parseInt(countRaw, 10);
	if (!Number.isInteger(count) || count <= 0) {
		throw new Error("--count must be a positive integer");
	}

	if (statusRaw && !STATUSES.includes(statusRaw as (typeof STATUSES)[number])) {
		throw new Error(`--status must be one of: ${STATUSES.join(", ")}`);
	}

	return {
		userId,
		count,
		status: statusRaw as SeedOptions["status"] | undefined,
	};
}

async function seedUserJobs() {
	if (!process.env.MONGO_URI) {
		throw new Error("Missing MONGO_URI in .env");
	}

	const { userId, count, status } = parseOptions();

	if (!mongoose.isValidObjectId(userId)) {
		throw new Error("Invalid userId format");
	}

	await mongoose.connect(process.env.MONGO_URI);

	const userExists = await User.exists({ _id: userId });
	if (!userExists) {
		throw new Error(`User not found for id: ${userId}`);
	}

	// Clear previous seeded jobs for this user first.
	await Job.deleteMany({ createdBy: userId });

	const jobs = Array.from({ length: count }, (_, i) => ({
		company: pickRandom(COMPANIES),
		role: pickRandom(ROLES),
		status: status ?? pickRandom(STATUSES),
		dateApplied: randomDateWithinLastDays(420),
		notes: `Mock job #${i + 1} | stage: ${pickRandom(STAGES)} | source: referral`,
		createdBy: userId,
	}));

	await Job.insertMany(jobs);

	console.log(`Replaced jobs for user ${userId}. Inserted ${jobs.length} randomized jobs.`);
	await mongoose.disconnect();
}

seedUserJobs().catch(async (err) => {
	console.error("Seed failed:", err);
	await mongoose.disconnect();
	process.exit(1);
});

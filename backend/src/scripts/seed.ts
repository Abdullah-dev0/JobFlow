import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user.model";
import Job from "../models/job.model";

const STATUSES = ["Applied", "Interviewing", "Offer", "Rejected", "Accepted"] as const;
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

async function seed() {
	if (!process.env.MONGO_URI) {
		throw new Error("Missing MONGO_URI in .env");
	}
	await mongoose.connect(process.env.MONGO_URI);

	await User.deleteMany({});
	await Job.deleteMany({});

	const hashedPassword = await Bun.password.hash("password123", { algorithm: "bcrypt" });

	const users = await User.insertMany(
		Array.from({ length: 10 }, (_, i) => ({
			name: `User ${i + 1}`,
			email: `user${i + 1}@example.com`,
			password: hashedPassword,
		})),
	);

	const jobs = Array.from({ length: 100 }, (_, i) => ({
		company: COMPANIES[i % COMPANIES.length],
		role: ROLES[i % ROLES.length],
		status: STATUSES[i % STATUSES.length],
		dateApplied: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
		notes: i % 3 === 0 ? `Note for application ${i + 1}` : undefined,
		createdBy: users[i % users.length]?._id,
	}));

	await Job.insertMany(jobs);

	console.log(`Seeded ${users.length} users and ${jobs.length} jobs`);
	process.exit(0);
}

seed().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});

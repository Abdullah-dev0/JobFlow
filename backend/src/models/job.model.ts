import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
	{
		company: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ["Applied", "Interviewing", "Offer", "Rejected", "Accepted"],
			default: "Applied",
		},
		dateApplied: {
			type: Date,
			default: Date.now,
		},
		notes: {
			type: String,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

const Job = mongoose.model("job", jobSchema);
export default Job;

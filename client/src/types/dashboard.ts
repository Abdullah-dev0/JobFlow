export type JobStatus = "Applied" | "Interviewing" | "Offer" | "Rejected" | "Accepted";

export interface DashboardJob {
	id: string;
	company: string;
	role: string;
	status: JobStatus;
	dateApplied: string;
	notes?: string | null;
	createdAt: string;
}

export interface GetJobsResponse {
	allJobs: DashboardJob[];
	total: number;
}

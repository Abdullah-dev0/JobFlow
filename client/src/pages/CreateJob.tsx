import {
	BriefcaseBusiness,
	Building2,
	CalendarDays,
	ChevronRight,
	ClipboardList,
	FileText,
	Sparkles,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { filters } from "../constants";
import { useMutation } from "../hooks/useMutation";
import useFetch from "../hooks/usefetch";

type JobStatus = (typeof filters)[number];

interface CreateJobPayload {
	company: string;
	role: string;
	status: JobStatus;
	dateApplied: string;
	notes?: string;
}

const fieldBaseClass =
	"w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70";

const textFieldConfig = [
	{
		key: "company",
		label: "Company",
		placeholder: "Company name",
		icon: Building2,
	},
	{
		key: "role",
		label: "Job Title",
		placeholder: "Frontend Developer",
		icon: BriefcaseBusiness,
	},
] as const;

const getTodayDate = () => {
	const now = new Date();
	const offsetMs = now.getTimezoneOffset() * 60_000;
	return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
};

const CreateJob = () => {
	const navigate = useNavigate();
	const { mutate, loading } = useMutation<CreateJobPayload, CreateJobPayload>("/job/create", "POST");
	const { id } = useParams(); // get id from /edit/:id
	const isEditing = Boolean(id);

	const { data: existingJob, loading: fetchingJob } = useFetch<CreateJobPayload>(isEditing ? `job/${id}` : null);

	if (isEditing && fetchingJob) {
		return (
			<div className="flex h-32 items-center justify-center">
				<span className="text-sm text-muted-foreground">Loading job details...</span>
			</div>
		);
	}

	const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formElement = event.currentTarget;
		const formData = new FormData(formElement);

		const company = String(formData.get("company") ?? "").trim();
		const role = String(formData.get("role") ?? "").trim();
		const rawStatus = String(formData.get("status") ?? "");
		const status = filters.includes(rawStatus as JobStatus) ? (rawStatus as JobStatus) : filters[0];
		const dateApplied = String(formData.get("dateApplied") ?? "").trim() || getTodayDate();
		const notes = String(formData.get("notes") ?? "").trim();

		if (!company || !role) {
			toast.error("Company and job title are required.");
			return;
		}

		const payload: CreateJobPayload = {
			company,
			role,
			status,
			dateApplied,
			...(notes ? { notes } : {}),
		};

		try {
			await mutate(payload);
			toast.success("Job created successfully.");
			formElement.reset();
			navigate("/dashboard", { replace: true });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Unable to create job.");
		}
	};

	return (
		<>
			<header className="h-12 border-b border-border flex items-center justify-between px-6 bg-background shrink-0">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span className="text-foreground font-medium">Interview Dashboard</span>
					<ChevronRight size={12} />
					<span>Create Job</span>
				</div>
			</header>

			<main className="flex-1 overflow-y-auto p-8">
				<div className="mx-auto w-full max-w-7xl gap-7 ">
					<section className="bg-card">
						<div className="px-8 py-7">
							<div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-accent-foreground">
								<Sparkles size={14} />
								Step 1 of 1
							</div>
							<h1 className="mt-3 text-3xl font-semibold text-foreground">Create a New Job Application</h1>
							<p className="mt-1 text-sm text-muted-foreground">
								Capture key details and keep your pipeline organized.
							</p>
							<div className="mt-4 h-1.5 w-full rounded-full bg-muted">
								<div className="h-full w-full rounded-full bg-primary" />
							</div>
						</div>

						<form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
							<div className="grid gap-5 md:grid-cols-2">
								{textFieldConfig.map((field) => {
									const Icon = field.icon;
									return (
										<label key={field.key} className="block space-y-1.5">
											<span className="text-sm font-medium text-foreground">{field.label}</span>
											<div className="relative">
												<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
													<Icon size={16} />
												</div>
												<input
													required
													defaultValue={existingJob?.company}
													name={field.key}
													placeholder={field.placeholder}
													className={`${fieldBaseClass} pl-10`}
													disabled={loading}
												/>
											</div>
										</label>
									);
								})}

								<label className="block space-y-1.5">
									<span className="text-sm font-medium text-foreground">Status</span>
									<div className="relative">
										<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
											<ClipboardList size={16} />
										</div>
										<select
											name="status"
											defaultValue={existingJob?.status ?? filters[0]}
											className={`${fieldBaseClass} pl-10 appearance-none`}
											disabled={loading}>
											{filters.map((statusOption) => (
												<option key={statusOption} value={statusOption}>
													{statusOption}
												</option>
											))}
										</select>
									</div>
								</label>

								<label className="block space-y-1.5">
									<span className="text-sm font-medium text-foreground">Date Applied</span>
									<div className="relative">
										<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
											<CalendarDays size={16} />
										</div>
										<input
											type="date"
											name="dateApplied"
											defaultValue={existingJob?.dateApplied ? existingJob.dateApplied.slice(0, 10) : getTodayDate()}
											className={`${fieldBaseClass} pl-10`}
											disabled={loading}
										/>
									</div>
								</label>
							</div>

							<label className="block space-y-1.5">
								<span className="text-sm font-medium text-foreground">Notes</span>
								<div className="relative">
									<div className="pointer-events-none absolute left-3.5 top-3.5 text-muted-foreground">
										<FileText size={16} />
									</div>
									<textarea
										name="notes"
										defaultValue={existingJob?.notes}
										placeholder="Interview rounds, referrals, follow-up dates..."
										className={`${fieldBaseClass} min-h-44 resize-y pl-10`}
										disabled={loading}
									/>
								</div>
							</label>

							<div className="flex items-center justify-end gap-3 pt-2">
								<button
									type="button"
									onClick={() => navigate("/dashboard")}
									className="rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
									disabled={loading}>
									Cancel
								</button>
								<button
									type="submit"
									className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/30 transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
									disabled={loading}>
									{loading ? "Creating..." : "Create Job"}
								</button>
							</div>
						</form>
					</section>
				</div>
			</main>
		</>
	);
};

export default CreateJob;

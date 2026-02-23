import {
	BriefcaseBusiness,
	Building2,
	CalendarDays,
	ChevronRight,
	ClipboardList,
	FileText,
	Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Sidebar from "../components/Sidebar";
import { filters } from "../constants";
import { useMutation } from "../hooks/useMutation";

type JobStatus = (typeof filters)[number];

interface CreateJobPayload {
	company: string;
	role: string;
	status: JobStatus;
	dateApplied: string;
	notes?: string;
}

interface CreateJobFormState {
	company: string;
	role: string;
	status: JobStatus;
	dateApplied: string;
	notes: string;
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

const QUICK_HINTS = [
	"Use the exact role title from the job post for easier tracking.",
	"Keep status updated after each interview stage.",
	"Add concise notes so future follow-ups are faster.",
] as const;

const getTodayDate = () => {
	const now = new Date();
	const offsetMs = now.getTimezoneOffset() * 60_000;
	return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
};

const getInitialState = (): CreateJobFormState => ({
	company: "",
	role: "",
	status: filters[0],
	dateApplied: getTodayDate(),
	notes: "",
});

const CreateJob = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState<CreateJobFormState>(getInitialState);
	const { mutate, loading } = useMutation<CreateJobPayload, CreateJobPayload>("/job/create", "POST");

	const setField = <K extends keyof CreateJobFormState>(key: K, value: CreateJobFormState[K]) => {
		setForm((current) => ({ ...current, [key]: value }));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const company = form.company.trim();
		const role = form.role.trim();

		if (!company || !role) {
			toast.error("Company and job title are required.");
			return;
		}

		const payload: CreateJobPayload = {
			company,
			role,
			status: form.status,
			dateApplied: form.dateApplied,
			...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
		};

		try {
			await mutate(payload);
			toast.success("Job created successfully.");
			setForm(getInitialState());
			navigate("/dashboard", { replace: true });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Unable to create job.");
		}
	};

	return (
		<div className="flex h-screen bg-background overflow-hidden">
			<Sidebar />

			<div className="flex-1 flex flex-col overflow-hidden">
				<header className="h-12 border-b border-border flex items-center justify-between px-6 bg-background shrink-0">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<span className="text-foreground font-medium">Interview Dashboard</span>
						<ChevronRight size={12} />
						<span>Create Job</span>
					</div>
				</header>

				<main className="flex-1 overflow-y-auto p-8">
					<div className="mx-auto w-full max-w-6xl grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
						<section className="rounded-2xl border border-border bg-card shadow-sm">
							<div className="border-b border-border px-8 py-7">
								<div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-accent-foreground">
									<Sparkles size={14} />
									Step 1 of 1
								</div>
								<h1 className="mt-3 text-3xl font-semibold text-foreground">Create a New Job Application</h1>
								<p className="mt-1 text-sm text-muted-foreground">Capture key details and keep your pipeline organized.</p>
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
														name={field.key}
														value={form[field.key]}
														onChange={(event) => setField(field.key, event.target.value)}
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
												value={form.status}
												onChange={(event) => setField("status", event.target.value as JobStatus)}
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
												value={form.dateApplied}
												onChange={(event) => setField("dateApplied", event.target.value)}
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
											value={form.notes}
											onChange={(event) => setField("notes", event.target.value)}
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

						<aside className="rounded-2xl border border-border bg-card p-6 shadow-sm h-fit">
							<div className="flex items-center gap-2 text-sm font-semibold text-foreground">
								<Sparkles size={16} className="text-primary" />
								Quick Guidance
							</div>
							<ul className="mt-4 space-y-3 text-sm text-muted-foreground">
								{QUICK_HINTS.map((hint) => (
									<li key={hint} className="rounded-lg bg-muted/60 px-3 py-2">
										{hint}
									</li>
								))}
							</ul>
						</aside>
					</div>
				</main>
			</div>
		</div>
	);
};

export default CreateJob;

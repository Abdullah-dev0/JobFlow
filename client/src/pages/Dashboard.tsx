import { ArrowRight, Bell, Briefcase, ChevronDown, ChevronLeft, ChevronRight, Search, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import NoteTooltip from "../components/NoteTooltip";
import Sidebar from "../components/Sidebar";
import useFetch from "../hooks/useFetch";
import type { GetJobsResponse } from "../types/dashboard";
import { formatDate, getDisplayStatus, getPaginationRange, StatusBadge as getStatusBadgeStyles } from "../utils";
import { filters, LIMIT } from "../constants";
import { useMutation } from "../hooks/useMutation";

function StatusBadge({ label }: { label: string }) {
	const badgeStyles = getStatusBadgeStyles(label);

	return (
		<span
			className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
				badgeStyles.style ?? "bg-muted text-muted-foreground"
			}`}>
			<span className={`w-1.5 h-1.5 rounded-full ${badgeStyles.dotStyle ?? "bg-muted-foreground"}`} />
			{label}
		</span>
	);
}

const Dashboard = () => {
	const ALL_STATUSES = "All";
	const [searchParams, setSearchParams] = useSearchParams();
	const rawPage = Number(searchParams.get("page") ?? "1");
	const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
	const statusParam = searchParams.get("status");
	const selectedStatus = statusParam ?? ALL_STATUSES;
	const queryParams = new URLSearchParams({
		page: String(page),
		limit: String(LIMIT),
		...(statusParam ? { status: statusParam } : {}),
	});
	const params = `job/All?${queryParams.toString()}`;
	const { fetchData, data, loading } = useFetch<GetJobsResponse>(params);
	const skeletonRowCount = Math.min(Math.max(LIMIT, 5), 10);
	const { mutate, loading: isDeleting } = useMutation<{ message: string }, { id: string }>("/job/delete", "DELETE");

	useEffect(() => {
		const loadJobs = async () => {
			try {
				await fetchData();
			} catch (error) {
				const message = error instanceof Error ? error.message : "Failed to fetch jobs";
				toast.error(message);
			}
		};

		loadJobs();
	}, [fetchData]);

	const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / LIMIT));

	const paginationRange = getPaginationRange(page, totalPages);

	const setPage = (nextPage: number) => {
		setSearchParams((prevParams) => {
			const nextParams = new URLSearchParams(prevParams);
			nextParams.set("page", String(nextPage));
			return nextParams;
		});
	};

	const deleteJob = async (id: string) => {
		try {
			await mutate({ id });
			toast.success("Job deleted successfully");
			await fetchData();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "there was Error");
		}
	};

	return (
		<div className="flex h-screen bg-background overflow-hidden">
			<Sidebar />

			{/* Main content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Top Bar */}
				<header className="h-12 border-b border-border flex items-center justify-between px-6 bg-background shrink-0">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<span className="text-foreground font-medium">Interview Dashboard</span>
						<ChevronRight size={12} />
						<span>Applied Jobs</span>
						<ChevronRight size={12} />
						<span>Overview</span>
					</div>
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 text-sm text-muted-foreground">
							<Search size={14} />
							<input
								type="text"
								placeholder="Search..."
								className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-40 text-sm"
							/>
						</div>
						<button
							aria-label="Open notifications"
							className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors cursor-pointer">
							<Bell size={16} />
						</button>
					</div>
				</header>

				{/* Content */}
				<main className="flex-1 overflow-y-auto p-6">
					<h1 className="text-xl font-semibold text-foreground mb-5">Applied Jobs</h1>

					<div className="bg-card border border-border rounded-xl shadow-sm">
						{/* Card header */}
						<div className="flex items-center justify-between px-5 py-4 border-b border-border">
							<div className="flex items-center gap-2">
								<div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
									<Briefcase size={14} />
								</div>
								<span className="text-sm font-medium text-foreground">Jobs You Have Applied</span>
							</div>
							<span className="text-sm text-muted-foreground">{data?.total ?? 0} Jobs applied</span>
						</div>

						{/* Filter row */}
						<div className="flex items-center justify-between px-5 py-3 border-b border-border gap-4">
							<div className="flex items-center gap-2">
								<div className="relative">
									<select
										value={selectedStatus}
										onChange={(event) => {
											setSearchParams((prevParams) => {
												const nextParams = new URLSearchParams(prevParams);
												if (event.target.value === ALL_STATUSES) {
													nextParams.delete("status");
												} else {
													nextParams.set("status", event.target.value);
												}
												nextParams.set("page", "1");
												return nextParams;
											});
										}}
										className="appearance-none min-w-44 rounded-lg bg-muted/50 px-3 py-2 pr-9 text-sm font-medium text-foreground outline-none transition-all hover:bg-muted border border-border">
										<option value={ALL_STATUSES}>{ALL_STATUSES}</option>
										{filters.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
									</select>
									<ChevronDown
										size={16}
										className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
									/>
								</div>
							</div>
						</div>

						{/* Table */}
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-border">
										<th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
											Company Name
										</th>
										<th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
											Job Title
										</th>
										<th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
											Date Applied
										</th>
										<th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
											Status
										</th>
										<th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
											Notes
										</th>
										<th className="w-12 px-3 py-3" />
									</tr>
								</thead>
								<tbody>
									{loading &&
										Array.from({ length: skeletonRowCount }).map((_, index) => (
											<tr key={`skeleton-${index}`} className="border-b border-border last:border-0">
												<td className="py-3.5">
													<div className="flex items-center gap-3">
														<div aria-hidden className="w-8 h-8 rounded-lg bg-muted animate-pulse shrink-0" />
														<div className="space-y-2">
															<div aria-hidden className="h-3 w-28 rounded bg-muted animate-pulse" />
															<div aria-hidden className="h-3 w-20 rounded bg-muted/80 animate-pulse" />
														</div>
													</div>
												</td>
												<td className="px-3 py-3.5">
													<div aria-hidden className="h-3 w-32 rounded bg-muted animate-pulse" />
												</td>
												<td className="px-3 py-3.5">
													<div aria-hidden className="h-3 w-24 rounded bg-muted animate-pulse" />
												</td>
												<td className="px-3 py-3.5">
													<div aria-hidden className="h-6 w-24 rounded-full bg-muted animate-pulse" />
												</td>
												<td className="px-3 py-3.5">
													<div aria-hidden className="h-3 w-40 rounded bg-muted animate-pulse" />
												</td>
												<td className="px-3 py-3.5">
													<div aria-hidden className="h-3 w-6 rounded bg-muted animate-pulse" />
												</td>
											</tr>
										))}
									{!loading && (data?.allJobs.length ?? 0) === 0 && (
										<tr>
											<td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
												No jobs found.
											</td>
										</tr>
									)}
									{!loading &&
										data?.allJobs.map((job) => {
											const display = getDisplayStatus(job.status);
											return (
												<tr
													key={job.id}
													className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
													<td className=" py-3.5">
														<div className="flex items-center gap-3">
															<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
																{job.company.slice(0, 2).toUpperCase()}
															</div>
															<div>
																<p className="font-medium text-foreground">{job.company}</p>
															</div>
														</div>
													</td>
													<td className="px-3 py-3.5 text-foreground">{job.role}</td>
													<td className="px-3 py-3.5 text-muted-foreground">{formatDate(job.dateApplied)}</td>
													<td className="px-3 py-3.5">
														<StatusBadge label={display.label} />
													</td>
													<td className="px-3 py-3.5 text-muted-foreground">
														<NoteTooltip note={job.notes} />
													</td>
													<td className="px-3 py-3.5">
														<button
															type="button"
															disabled={isDeleting}
															onClick={() => deleteJob(job.id)}
															aria-label={`Delete job application for ${job.company} ${job.role}`}
															className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
															<Trash2 color="red" size={16} />
														</button>
													</td>
												</tr>
											);
										})}
								</tbody>
							</table>
						</div>

						{/* Pagination */}
						<div className="flex items-center justify-between px-5 py-3.5 border-t border-border">
							<button
								onClick={() => setPage(page - 1)}
								disabled={page === 1 || loading}
								className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none">
								<ChevronLeft size={14} />
								Previous
							</button>
							<div className="flex items-center gap-1">
								{paginationRange.map((item, index) =>
									item === "..." ? (
										<span key={`dots-${index}`} className="px-1 text-muted-foreground text-sm">
											...
										</span>
									) : (
										<button
											key={item}
											onClick={() => setPage(item)}
											disabled={loading}
											className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
												item === page
													? "bg-foreground text-background"
													: "text-muted-foreground hover:bg-muted hover:text-foreground"
											}`}>
											{item}
										</button>
									),
								)}
							</div>
							<button
								onClick={() => setPage(page + 1)}
								disabled={page === totalPages || loading}
								className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none">
								Next
								<ArrowRight size={14} />
							</button>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Dashboard;

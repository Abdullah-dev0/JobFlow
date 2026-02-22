import { ArrowRight, Bell, Briefcase, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Sidebar from "../components/Sidebar";
import useFetch from "../hooks/useFetch";
import type { GetJobsResponse } from "../types/dashboard";
import { formatDate, getDisplayStatus, getPaginationRange, StatusBadge as status } from "../utils";

function StatusBadge({ label }: { label: string }) {
	const res = status(label);

	return (
		<span
			className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
				res.style ?? "bg-muted text-muted-foreground"
			}`}>
			<span className={`w-1.5 h-1.5 rounded-full ${res.dotStyle ?? "bg-muted-foreground"}`} />
			{label}
		</span>
	);
}

const Dashboard = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const rawPage = Number(searchParams.get("page") ?? "1");
	const rawLimit = Number(searchParams.get("limit") ?? "10");
	const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
	const limit = Number.isNaN(rawLimit) || rawLimit < 1 ? 10 : rawLimit;
	const params = `job/All?page=${page}&limit=${limit}`;
	const { fetchData, data, loading } = useFetch<GetJobsResponse>(params);
	const skeletonRowCount = Math.min(Math.max(limit, 5), 10);

	useEffect(() => {
		fetchData()
			.then(() => {})
			.catch((error) => {
				toast.error(error.message || "Failed to fetch jobs");
			});
	}, [fetchData]);

	const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit));
	const paginationRange = getPaginationRange(page, totalPages);

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
						<button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors cursor-pointer">
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
							<span className="text-sm text-muted-foreground">{data?.total} Jobs applied</span>
						</div>

						{/* Tabs + search row */}
						<div className="flex items-center justify-between px-5 py-3 border-b border-border gap-4">
							<div className="flex items-center gap-1">
								{["All", "Pending", "Shortlisted", "Rejected"].map((tab, index) => (
									<button
										key={tab}
										className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
											index === 0
												? "bg-foreground text-background"
												: "text-muted-foreground hover:bg-muted hover:text-foreground"
										}`}>
										{tab}
									</button>
								))}
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
											Stage
										</th>
										<th className="w-12 px-3 py-3" />
									</tr>
								</thead>
								<tbody>
									{loading &&
										Array.from({ length: skeletonRowCount }).map((_, index) => (
											<tr key={`skeleton-${index}`} className="border-b border-border last:border-0">
												<td className="pl-5 py-3.5">
													<div aria-hidden className="h-4 w-4 rounded bg-muted animate-pulse" />
												</td>
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
													<div aria-hidden className="h-3 w-20 rounded bg-muted animate-pulse" />
												</td>
												<td className="px-3 py-3.5">
													<div aria-hidden className="h-6 w-24 rounded-full bg-muted animate-pulse" />
												</td>
												<td className="px-3 py-3.5">
													<div aria-hidden className="h-3 w-6 rounded bg-muted animate-pulse" />
												</td>
											</tr>
										))}
									{!loading && data?.allJobs.length === 0 && (
										<tr>
											<td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
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
													<td className="pl-5 py-3.5">
														<input type="checkbox" className="rounded accent-primary" />
													</td>
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
														<span className="text-sm text-muted-foreground">{job.status}</span>
													</td>
													<td className="px-3 py-3.5">
														<StatusBadge label={display.label} />
													</td>
													<td className="px-3 py-3.5">{/* <RowActions /> */}</td>
												</tr>
											);
										})}
								</tbody>
							</table>
						</div>

						{/* Pagination */}
						<div className="flex items-center justify-between px-5 py-3.5 border-t border-border">
							<button
								onClick={() => setSearchParams({ page: String(page - 1), limit: String(limit) })}
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
											onClick={() => setSearchParams({ page: String(item), limit: String(limit) })}
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
								onClick={() => setSearchParams({ page: String(page + 1), limit: String(limit) })}
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

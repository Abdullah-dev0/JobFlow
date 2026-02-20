import { NavLink } from "react-router-dom";

const Home = () => {
	return (
		<div className="min-h-screen bg-slate-950 text-slate-50">
			<header className="border-b border-slate-800 bg-slate-950">
				<div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
					<div className="flex items-baseline gap-2">
						<span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
							JobFlow
						</span>
						<p className="text-xs text-slate-400 hidden sm:block">Stay on top of every application.</p>
					</div>
					<nav className="flex items-center gap-4 text-sm">
						<NavLink
							to="/"
							className={({ isActive }) =>
								`transition-colors ${isActive ? "text-white" : "text-slate-300 hover:text-white"}`
							}>
							Home
						</NavLink>
						<NavLink
							to="/about"
							className={({ isActive }) =>
								`transition-colors ${isActive ? "text-white" : "text-slate-300 hover:text-white"}`
							}>
							About
						</NavLink>
						<NavLink
							to="/login"
							className={({ isActive }) =>
								`transition-colors ${isActive ? "text-white" : "text-slate-300 hover:text-white"}`
							}>
							Login
						</NavLink>
					</nav>
				</div>
			</header>

			<main className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-14">
				{/* Hero */}
				<section className="flex flex-col gap-10 md:flex-row md:items-center">
					<div className="md:w-1/2 space-y-6">
						<p className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200">
							<span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
							Designed for real-world job hunting
						</p>
						<h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-50">
							Track every application.
							<br />
							<span className="text-slate-200">See where you stand.</span>
						</h1>
						<p className="max-w-xl text-sm md:text-base text-slate-300 leading-relaxed">
							JobFlow is your command center for job hunting. Register or log in, add roles you&apos;ve applied for, and
							follow them from applied, to interviews, to offer—or learn quickly when it&apos;s a no.
						</p>
						<div className="flex flex-wrap gap-3 pt-2">
							<button className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-slate-900/60 transition hover:bg-slate-100">
								Get started – Register
							</button>
							<button className="rounded-full border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-900/80">
								I already have an account
							</button>
						</div>
						<ul className="mt-4 grid gap-2 text-sm text-slate-300">
							<li className="flex items-start gap-2">
								<span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-200" />
								<p>
									Track each job by status: <span className="font-semibold text-slate-100">applied</span>,{" "}
									<span className="font-semibold text-slate-100">interview</span>,{" "}
									<span className="font-semibold text-slate-100">offer</span>, or{" "}
									<span className="font-semibold text-slate-100">rejected</span>.
								</p>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-200" />
								<p>See a simple dashboard with how many roles are in each stage.</p>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-200" />
								<p>Reflect on your pipeline instead of guessing where your time is going.</p>
							</li>
						</ul>
					</div>

					<div className="md:w-1/2">
						<div className="relative mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-[0_0_30px_rgba(15,23,42,0.9)]">
							<div className="mb-3 flex items-center justify-between text-xs text-slate-400">
								<p className="font-medium">Today&apos;s snapshot</p>
								<p className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">Applications</p>
							</div>
							<div className="grid grid-cols-2 gap-3 text-xs">
								<div className="rounded-2xl bg-slate-900 p-3 border border-slate-800">
									<p className="text-slate-400">Applied</p>
									<p className="mt-1 text-2xl font-semibold text-slate-50">12</p>
									<p className="mt-1 text-[0.7rem] text-slate-500">Roles waiting for a reply</p>
								</div>
								<div className="rounded-2xl bg-slate-900 p-3 border border-slate-500">
									<p className="text-slate-300">Interviews</p>
									<p className="mt-1 text-2xl font-semibold text-slate-50">3</p>
									<p className="mt-1 text-[0.7rem] text-slate-400">Pipeline is alive</p>
								</div>
								<div className="rounded-2xl bg-slate-900 p-3 border border-slate-800">
									<p className="text-slate-400">Offers</p>
									<p className="mt-1 text-2xl font-semibold text-slate-50">1</p>
									<p className="mt-1 text-[0.7rem] text-slate-500">Keep pushing toward more</p>
								</div>
								<div className="rounded-2xl bg-slate-900 p-3 border border-slate-800">
									<p className="text-slate-400">Rejected</p>
									<p className="mt-1 text-2xl font-semibold text-slate-50">5</p>
									<p className="mt-1 text-[0.7rem] text-slate-500">Learnings, not failures</p>
								</div>
							</div>
							<div className="mt-4 flex items-center justify-between text-[0.7rem] text-slate-400">
								<p>Login to see your real stats.</p>
								<button className="underline-offset-2 hover:underline text-slate-100">View dashboard</button>
							</div>
						</div>
					</div>
				</section>

				{/* How it works */}
				<section className="border-t border-slate-800 pt-10">
					<div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
						<div className="md:max-w-sm">
							<h2 className="text-xl font-semibold text-slate-50">How JobFlow fits your search</h2>
							<p className="mt-2 text-sm text-slate-300">
								Think of this as a focused CRM for your job hunt. No spreadsheets, no guessing what happened last week.
							</p>
						</div>
						<ol className="grid flex-1 gap-4 text-sm md:grid-cols-3">
							<li className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
								<p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Step 1</p>
								<p className="mt-2 font-medium text-slate-50">Register & set your baseline</p>
								<p className="mt-1 text-xs text-slate-300">
									Create an account and add the roles you&apos;ve already applied to so your dashboard starts with
									reality, not zero.
								</p>
							</li>
							<li className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
								<p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Step 2</p>
								<p className="mt-2 font-medium text-slate-50">Log each new application</p>
								<p className="mt-1 text-xs text-slate-300">
									For every job, save the company, role, link, and status so nothing falls through the cracks.
								</p>
							</li>
							<li className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
								<p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Step 3</p>
								<p className="mt-2 font-medium text-slate-50">Watch your pipeline in one view</p>
								<p className="mt-1 text-xs text-slate-300">
									Use the dashboard to see how many roles are at applied, interview, offer, and rejected at a glance.
								</p>
							</li>
						</ol>
					</div>
				</section>

				{/* Why it matters */}
				<section className="border-t border-slate-800 pt-10 pb-4">
					<div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
						<div className="md:max-w-sm">
							<h2 className="text-xl font-semibold text-slate-50">Built for your next move</h2>
							<p className="mt-2 text-sm text-slate-300">
								This tracker is intentionally simple: just the information you need to make better decisions about where
								to apply next.
							</p>
						</div>
						<div className="grid flex-1 gap-4 text-sm md:grid-cols-2">
							<div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
								<p className="font-medium text-slate-50">See progress, not just rejections</p>
								<p className="mt-1 text-xs text-slate-300">
									Even when the answer is &quot;no&quot;, your pipeline shows how many opportunities you&apos;re
									actively creating.
								</p>
							</div>
							<div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
								<p className="font-medium text-slate-50">Plan your week with intention</p>
								<p className="mt-1 text-xs text-slate-300">
									Know exactly how many new applications or follow-ups you need to move things forward.
								</p>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
};

export default Home;

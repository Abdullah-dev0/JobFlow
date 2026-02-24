import { FilePlus2, LayoutGrid, LoaderCircle, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";

function NavItem({
	icon,
	label,
	to,
	end = false,
}: {
	icon: React.ReactNode;
	label: string;
	to: string;
	end?: boolean;
}) {
	return (
		<NavLink
			to={to}
			end={end}
			className={({ isActive }) =>
				`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
					isActive
						? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
						: "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
				}`
			}>
			<span className="shrink-0">{icon}</span>
			<span>{label}</span>
		</NavLink>
	);
}

export default function Sidebar() {
	const { user, logout, isLoading } = useAuth();

	const displayEmail = user?.email
		? user.email.length > 30
			? `${user.email.slice(0, 30)}...`
			: user.email
		: "No email provided";

	return (
		<aside className="w-70 shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border">
			{/* Logo */}
			<div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
				<div className="flex items-center gap-1.5">
					<span className="text-lg font-bold text-sidebar-foreground tracking-tight">interview</span>
					<span className="flex gap-0.5 ml-0.5">
						<span className="w-3 h-3 rounded-sm bg-primary" />
						<span className="w-3 h-3 rounded-sm bg-secondary-foreground/40" />
					</span>
				</div>
				<button className="p-1 rounded hover:bg-sidebar-accent/50 text-sidebar-foreground/60 cursor-pointer">
					<LayoutGrid size={16} />
				</button>
			</div>

			{/* Nav */}
			<nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
				<div>
					<p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Main</p>
					<div className="space-y-1.5">
						<NavItem icon={<LayoutGrid size={16} />} label="Dashboard" to="/dashboard" end />
						<NavItem icon={<FilePlus2 size={16} />} label="Create Job" to="/dashboard/create" />
					</div>
				</div>
			</nav>

			{/* User */}
			<div className="px-3 py-6 border-t border-sidebar-border flex items-center gap-3">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
						{user?.name.substring(0, 1)}
					</div>
					<div className="flex-1 min-w-0 text-left">
						<p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name ?? "User"}</p>
						<p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
					</div>
				</div>
				<button
					type="button"
					onClick={() => logout()}
					disabled={isLoading}
					aria-label={isLoading ? "Logging out" : "Log out"}
					className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground disabled:cursor-not-allowed disabled:opacity-60">
					{isLoading ? <LoaderCircle size={18} className="animate-spin" /> : <LogOut size={18} color="red" />}
				</button>
			</div>
		</aside>
	);
}

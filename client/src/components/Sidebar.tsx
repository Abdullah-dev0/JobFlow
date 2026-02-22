import { ArrowRight, LayoutGrid } from "lucide-react";
import { useAuth } from "../context/authContext";

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
	return (
		<button
			className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
				active
					? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
					: "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
			}`}>
			<span className="shrink-0">{icon}</span>
			<span>{label}</span>
		</button>
	);
}

export default function Sidebar() {
	const { user } = useAuth();

	return (
		<aside className="w-[220px] shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border">
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
					<NavItem icon={<LayoutGrid size={16} />} label="Dashboard" active />
				</div>
			</nav>

			{/* User */}
			<div className="px-3 py-3 border-t border-sidebar-border">
				<button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors cursor-pointer">
					<div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
						{user?.name.substring(0, 1)}
					</div>
					<div className="flex-1 min-w-0 text-left">
						<p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name ?? "User"}</p>
						<p className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</p>
					</div>
					<ArrowRight size={14} className="text-muted-foreground" />
				</button>
			</div>
		</aside>
	);
}

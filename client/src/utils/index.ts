import type { JobStatus } from "../types/dashboard";

export function getDisplayStatus(status: JobStatus): { label: string } {
	switch (status) {
		case "Applied":
			return { label: "Pending" };
		case "Interviewing":
		case "Offer":
		case "Accepted":
			return { label: "Shortlisted" };
		case "Rejected":
			return { label: "Rejected" };
	}
}

export function formatDate(dateStr: string): string {
	const d = new Date(dateStr);
	return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export const getPaginationRange = (currentPage: number, totalPages: number) => {
	const delta = 2;
	const range: (number | "...")[] = [];

	range.push(1);

	if (currentPage - delta > 2) {
		range.push("...");
	}

	for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
		range.push(i);
	}

	if (currentPage + delta < totalPages - 1) {
		range.push("...");
	}

	if (totalPages > 1) {
		range.push(totalPages);
	}

	return range;
};

export function StatusBadge(label: string) {
	const styles: Record<string, string> = {
		Pending: "bg-primary/10 text-accent-foreground",
		Shortlisted: "bg-secondary text-secondary-foreground",
		Rejected: "bg-destructive/10 text-destructive",
	};
	const dotStyles: Record<string, string> = {
		Pending: "bg-primary",
		Shortlisted: "bg-primary",
		Rejected: "bg-destructive",
	};
	return {
		style: styles[label],
		dotStyle: dotStyles[label],
	};
}

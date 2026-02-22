import { useId } from "react";
import { CircleAlert } from "lucide-react";

type NoteTooltipProps = {
	note?: string | null;
	emptyLabel?: string;
};

const NoteTooltip = ({ note, emptyLabel = "No notes" }: NoteTooltipProps) => {
	const tooltipId = useId();
	const normalizedNote = note?.trim() ?? "";
	const tooltipText = normalizedNote || emptyLabel;

	return (
		<div className="group relative inline-flex">
			<button
				type="button"
				aria-describedby={tooltipId}
				title={tooltipText}
				className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
				<CircleAlert size={15} />
			</button>
			<div
				id={tooltipId}
				role="tooltip"
				className="absolute right-0 top-full z-30 mt-2 hidden w-80 rounded-lg border border-border bg-popover p-3 text-xs leading-relaxed text-popover-foreground shadow-lg group-hover:block group-focus-within:block">
				<p className="whitespace-pre-wrap wrap-break-word">{tooltipText}</p>
			</div>
		</div>
	);
};

export default NoteTooltip;

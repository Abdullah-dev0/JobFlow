export default function FullScreenLoader() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
			<div className="flex flex-col items-center gap-4">
				<div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
				<p className="text-sm font-medium tracking-tight text-muted-foreground">Loading...</p>
			</div>
		</div>
	);
}

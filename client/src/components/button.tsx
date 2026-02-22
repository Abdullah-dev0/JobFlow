interface ButtonComponent {
	type: "submit" | "reset" | "button" | undefined;
	children: React.ReactNode;
	disabled?: boolean;
	loading?: boolean;
	loadingText?: string;
}

const Button = ({ type, children, disabled = false, loading = false, loadingText = "Loading..." }: ButtonComponent) => {
	const isDisabled = disabled || loading;

	return (
		<button
			type={type ?? "button"}
			disabled={isDisabled}
			className="w-full flex disabled:opacity-70 justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/30 text-sm font-semibold bg-primary hover:bg-primary/90 transform cursor-pointer">
			{loading ? (
				<span className="inline-flex items-center gap-2">
					<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
					{loadingText}
				</span>
			) : (
				children
			)}
		</button>
	);
};

export default Button;

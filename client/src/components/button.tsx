interface ButtonComponent {
	type: "submit" | "reset" | "button" | undefined;
	children: React.ReactNode;
	disabled?: boolean;
}

const Button = ({ type, children, disabled = false }: ButtonComponent) => {
	return (
		<button
			type={type ?? "button"}
			disabled={disabled}
			className="w-full flex disabled:opacity-70 justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/30 text-sm font-semibold bg-primary hover:bg-primary/90 transform cursor-pointer">
			{children}
		</button>
	);
};

export default Button;

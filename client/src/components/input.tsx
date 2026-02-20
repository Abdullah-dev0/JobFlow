import type { ChangeEvent, HTMLInputTypeAttribute, ReactNode } from "react";

interface InputProps {
	className?: string;
	endAdornment?: ReactNode;
	id: string;
	label?: string;
	name: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	disabled?: boolean;
	required?: boolean;
	startAdornment?: ReactNode;
	type?: HTMLInputTypeAttribute;
	value?: string;
}

const baseInputClass =
	"block w-full py-3 text-sm text-foreground bg-background rounded-xl placeholder:text-muted-foreground shadow-xs disabled:opacity-30";

const Input = ({
	id,
	label,
	name,
	onChange,
	placeholder,
	type = "text",
	value,
	className,
	required,
	startAdornment,
	endAdornment,
	disabled = false,
}: InputProps) => {
	const hasStart = Boolean(startAdornment);
	const hasEnd = Boolean(endAdornment);
	const inputClass = [baseInputClass, hasStart && "pl-11", hasEnd ? "pr-12" : "pr-4", className]
		.filter(Boolean)
		.join(" ");

	return (
		<div>
			{label && (
				<label htmlFor={id} className="block text-sm font-semibold text-foreground mb-1.5">
					{label}
				</label>
			)}
			<div className="relative">
				{startAdornment && (
					<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
						{startAdornment}
					</div>
				)}
				<input
					id={id}
					name={name}
					type={type}
					value={value}
					onChange={onChange}
					disabled={disabled}
					placeholder={placeholder}
					required={required}
					className={inputClass}
				/>
				{endAdornment && <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">{endAdornment}</div>}
			</div>
		</div>
	);
};

export default Input;

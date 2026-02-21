import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "../hooks/useMutation ";
import Button from "./button";
import Input from "./input";

interface signinRes {
	_id: string;
	name: string;
	email: string;
}

export default function LoginForm() {
	const [showPassword, setShowPassword] = useState(false);
	const { mutate, error, loading } = useMutation<signinRes>("auth/signin", "POST");
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const email = formData.get("email");
		const password = formData.get("password");

		if (!password || !email) {
			toast.error("please fill the fields");
			return;
		}
		try {
			await mutate({ email, password });
			navigate("/", { replace: true });
		} catch {
			toast.error(error?.message ?? "There was an error");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<Input
				id="email"
				name="email"
				label="Email"
				disabled={loading}
				type="email"
				value={formData.email}
				onChange={(e) => setFormData({ ...formData, email: e.target.value })}
				placeholder="name@company.com"
				required
				startAdornment={<Mail className="h-5 w-5" />}
			/>

			<Input
				id="password"
				name="password"
				label="Password"
				type={showPassword ? "text" : "password"}
				value={formData.password}
				onChange={(e) => setFormData({ ...formData, password: e.target.value })}
				placeholder="••••••••"
				required
				disabled={loading}
				startAdornment={<Lock className="h-5 w-5" />}
				endAdornment={
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
						{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
					</button>
				}
			/>

			<div className="flex items-center justify-between pt-1">
				<Link to="#" className="text-sm font-semibold text-primary hover:text-primary/90 transition-colors">
					Forgot password?
				</Link>
			</div>

			<Button disabled={loading} type="submit">
				Log In
			</Button>
		</form>
	);
}

export function LoginFooter() {
	return (
		<p>
			Don't have an account?{" "}
			<Link to="/register" className="font-semibold text-primary hover:text-primary/90 transition-colors">
				Sign up
			</Link>
		</p>
	);
}

import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "../hooks/useMutation";
import Button from "./button";
import Input from "./input";
import { useAuth } from "../context/authContext";

interface SignUpResponse {
	_id: string;
	name: string;
	email: string;
}

export default function RegisterForm() {
	const { mutate, loading } = useMutation<SignUpResponse>("/auth/signup", "POST");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const navigation = useNavigate();
	const { refetch } = useAuth();

	const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const fullName = formData.get("fullName");
		const confirmPassword = formData.get("confirmPassword");
		const email = formData.get("email");
		const password = formData.get("password");

		if (!fullName || !password || !email || !confirmPassword) {
			toast.error("please fill the fields");
			return;
		}

		if (String(password ?? "").trim() !== String(confirmPassword ?? "").trim()) {
			toast.error("Password does not match");
			return;
		}

		try {
			await mutate({ name: String(fullName), email: String(email), password: String(password) });
			refetch();
			navigation("/dashboard", { replace: true });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "There was an error");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<Input
				id="name"
				label="Full name"
				type="text"
				name="fullName"
				disabled={loading}
				placeholder="John Doe"
				required
				startAdornment={<User className="h-5 w-5" />}
			/>

			<Input
				id="email"
				label="Email"
				type="email"
				name="email"
				disabled={loading}
				placeholder="name@company.com"
				required
				startAdornment={<Mail className="h-5 w-5" />}
			/>

			<Input
				id="password"
				label="Password"
				type={showPassword ? "text" : "password"}
				disabled={loading}
				name="password"
				placeholder="••••••••"
				required
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

			<Input
				id="confirmPassword"
				label="Confirm password"
				type={showConfirmPassword ? "text" : "password"}
				placeholder="••••••••"
				required
				disabled={loading}
				name="confirmPassword"
				startAdornment={<Lock className="h-5 w-5" />}
				endAdornment={
					<button
						type="button"
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
						{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
					</button>
				}
			/>

			<Button disabled={loading} loading={loading} loadingText="Signing up..." type="submit">
				Sign Up
			</Button>
		</form>
	);
}

export function RegisterFooter() {
	return (
		<p>
			Already have an account?{" "}
			<Link to="/login" className="font-semibold text-primary hover:text-primary/90 transition-colors">
				Log in
			</Link>
		</p>
	);
}

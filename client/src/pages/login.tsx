import AuthLayout from "../layouts/authLayout";
import LoginForm, { LoginFooter } from "../components/loginForm";

export default function Login() {
	return (
		<AuthLayout
			title="Log in to your account"
			subtitle="Welcome back! Please enter your details."
			footer={<LoginFooter />}>
			<LoginForm />
		</AuthLayout>
	);
}

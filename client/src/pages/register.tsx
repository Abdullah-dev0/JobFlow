import AuthLayout from "../layouts/authLayout";
import RegisterForm, { RegisterFooter } from "../components/registerForm";

export default function Register() {
	return (
		<AuthLayout
			title="Create your account"
			subtitle="Get started! Please enter your details."
			footer={<RegisterFooter />}>
			<RegisterForm />
		</AuthLayout>
	);
}

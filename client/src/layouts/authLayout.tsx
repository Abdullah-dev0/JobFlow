import type { ReactNode } from "react";

type AuthLayoutProps = {
	title: string;
	subtitle: string;
	children: ReactNode;
	footer: ReactNode;
	illustrationSrc?: string;
};

export default function AuthLayout({ title, subtitle, children, footer, illustrationSrc = "/login.webp" }: AuthLayoutProps) {
	return (
		<div className="flex min-h-screen font-sans bg-background selection:bg-primary/20 selection:text-foreground">
			{/* Left Form Panel */}
			<div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-32 relative z-10 bg-background">
				{/* Mobile-only background blur accent */}
				<div className="absolute top-0 left-0 w-full h-96 bg-primary/10 rounded-full blur-3xl -z-10 lg:hidden pointer-events-none"></div>

				<div className="w-full max-w-md mx-auto">
					{/* Logo / Brand */}
					<div className="flex items-center gap-2 mb-10">
						<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
							<span className="text-primary-foreground font-bold text-xl leading-none">N</span>
						</div>
						<span className="text-xl font-bold text-foreground tracking-tight">Nexus AI</span>
					</div>

					<h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">{title}</h1>
					<p className="text-muted-foreground mb-8 text-sm font-medium">{subtitle}</p>

					{children}

					{/* Divider */}
					<div className="mt-8 relative">
						<div className="absolute inset-0 flex items-center" aria-hidden="true">
							<div className="w-full border-t border-border"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-3 bg-background text-muted-foreground font-medium">Or continue with</span>
						</div>
					</div>

					{/* Footer */}
					<div className="mt-10 text-center text-sm text-muted-foreground">{footer}</div>
				</div>
			</div>

			{/* Right Illustration Panel */}
			<div className="hidden lg:flex w-1/2 flex-1 relative bg-foreground items-center justify-center overflow-hidden">
				<img src={illustrationSrc} alt="" className="w-full h-full object-contain" />
			</div>
		</div>
	);
}

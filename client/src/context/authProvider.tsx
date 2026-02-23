import { useEffect, type ReactNode } from "react";
import useFetch from "../hooks/usefetch";
import { AuthContext } from "./authContext";
import type { User } from "./authTypes";
import { useMutation } from "../hooks/useMutation";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const { loading, data, fetchData, reset } = useFetch<User>("user/me");
	const { mutate: triggerLogout, loading: isLoggingOut } = useMutation<{ message: string }>("/auth/logout", "POST");

	useEffect(() => {
		const handleExpired = () => reset();
		window.addEventListener("auth:expired", handleExpired);
		return () => window.removeEventListener("auth:expired", handleExpired);
	}, [reset]);

	const logout = async () => {
		try {
			await triggerLogout();
		} finally {
			reset();
		}
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: !!data,
				isLoading: loading || isLoggingOut,
				user: data ?? null,
				logout,
				refetch: fetchData,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

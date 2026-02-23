import { useEffect, type ReactNode } from "react";
import useFetch from "../hooks/usefetch";
import { AuthContext } from "./authContext";
import type { User } from "./authTypes";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const { loading, data, fetchData, reset } = useFetch<User>("user/me");

	useEffect(() => {
		const handleExpired = () => reset();
		window.addEventListener("auth:expired", handleExpired);
		return () => window.removeEventListener("auth:expired", handleExpired);
	}, [reset]);

	const logout = async () => {
		// fetchData(null);
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: !!data,
				isLoading: loading,
				user: data ?? null,
				logout,
				refetch: fetchData,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

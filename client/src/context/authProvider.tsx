import type { ReactNode } from "react";
import useFetch from "../hooks/usefetch";
import { AuthContext } from "./authContext";
import type { User } from "./authTypes";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const { loading, data, fetchData } = useFetch<User>("user/me");

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

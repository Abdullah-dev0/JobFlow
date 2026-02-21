import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./authContext";
import type { User } from "./authTypes";
import useFetch from "../hooks/useFetch";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { fetchData } = useFetch<User>("user/me");

	useEffect(() => {
		fetchData()
			.then(setUser)
			.catch(() => setUser(null))
			.finally(() => setIsLoading(false));
	}, [fetchData]);

	const logout = () => {
		setUser(null);
		setIsLoading(false);
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: !!user,
				isLoading,
				user,
				setUser,
				logout,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

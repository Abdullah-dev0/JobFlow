export interface User {
	id: string;
	name: string;
	email: string;
}

export interface AuthContextType {
	isAuthenticated: boolean;
	isLoading: boolean;
	user: User | null;
	logout: () => Promise<void>;
	refetch: () => Promise<User | undefined>;
}

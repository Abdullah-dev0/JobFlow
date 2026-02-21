export interface User {
	id: string;
	name: string;
	email: string;
}

export interface AuthContextType {
	isAuthenticated: boolean;
	isLoading: boolean;
	user: User | null;
	setUser: (user: User | null) => void;
	logout: () => void;
}

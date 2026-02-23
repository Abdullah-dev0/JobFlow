import { Navigate, Outlet } from "react-router-dom";
import FullScreenLoader from "../components/FullScreenLoader";
import { useAuth } from "../context/authContext";

const PublicRoute = () => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) return <FullScreenLoader />;

	return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;

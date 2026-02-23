import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";
import FullScreenLoader from "../components/FullScreenLoader";

const ProtectedRoute = () => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) return <FullScreenLoader />;

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

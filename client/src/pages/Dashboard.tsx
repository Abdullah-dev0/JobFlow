import { useAuth } from "../context/authContext";

const Dashboard = () => {
	const { user } = useAuth();

	return <div>{JSON.stringify(user, null, 2)}</div>;
};

export default Dashboard;

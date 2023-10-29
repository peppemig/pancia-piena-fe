import { User } from "firebase/auth";
import { Navigate } from "react-router-dom";

type DashboardProps = {
  user: User | null | undefined;
};

const Dashboard = ({ user }: DashboardProps) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const getToken = async () => {
    const token = await user.getIdToken();
    console.log(token);
    return token;
  };

  return (
    <div className="container-custom">
      <p>Questa è la dashboard di {user.email}</p>
      <button onClick={getToken}>Get token</button>
    </div>
  );
};

export default Dashboard;

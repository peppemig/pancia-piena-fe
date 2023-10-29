import { User } from "firebase/auth";
import { Navigate } from "react-router-dom";

type OrdersProps = {
  user: User | null | undefined;
};

const Orders = ({ user }: OrdersProps) => {
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
      <p>Questi sono gli ordini di {user.email}</p>
      <button onClick={getToken}>Get token</button>
    </div>
  );
};

export default Orders;

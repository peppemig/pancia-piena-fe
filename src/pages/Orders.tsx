import { User } from "firebase/auth";
import { Navigate } from "react-router-dom";

type OrdersProps = {
  user: User | null | undefined;
};

const Orders = ({ user }: OrdersProps) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container-custom py-6 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">I tuoi ordini</h2>
    </div>
  );
};

export default Orders;

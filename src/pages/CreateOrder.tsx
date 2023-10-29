import { User } from "firebase/auth";
import { Navigate } from "react-router-dom";

type CreateOrderProps = {
  user: User | null | undefined;
};

const CreateOrder = ({ user }: CreateOrderProps) => {
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
      <p>Crea un ordine! {user.email}</p>
      <button onClick={getToken}>Get token</button>
    </div>
  );
};

export default CreateOrder;

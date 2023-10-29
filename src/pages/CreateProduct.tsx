import { User } from "firebase/auth";
import { Navigate } from "react-router-dom";

type CreateProductProps = {
  user: User | null | undefined;
};

const CreateProduct = ({ user }: CreateProductProps) => {
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
      <p>Crea un prodotto! {user.email}</p>
      <button onClick={getToken}>Get token</button>
    </div>
  );
};

export default CreateProduct;

import axios from "axios";

type Product = {
  name: string;
  price: number;
};

const getProducts = async (token: string) => {
  const response = await axios.get("http://localhost:3000/api/v1/products", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

const createProduct = async (token: string, product: Product) => {
  const response = await axios.post(
    "http://localhost:3000/api/v1/products",
    product,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response;
};

const deleteProduct = async (token: string, productId: string) => {
  const response = await axios.delete(
    `http://localhost:3000/api/v1/products/${productId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response;
};

const editProduct = async (
  token: string,
  productId: string,
  product: Product
) => {
  const response = await axios.put(
    `http://localhost:3000/api/v1/products/${productId}`,
    product,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response;
};

export default { getProducts, createProduct, deleteProduct, editProduct };

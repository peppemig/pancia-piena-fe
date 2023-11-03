import axios from "axios";
import { Product, ProductRequest } from "../types/types";
import { API_BASE_URL } from "@/constants/constants";

const getProducts = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

const createProduct = async (token: string, product: ProductRequest) => {
  const response = await axios.post(`${API_BASE_URL}/products`, product, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

const deleteProduct = async (token: string, productId: string) => {
  const response = await axios.delete(`${API_BASE_URL}/products/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

const editProduct = async (
  token: string,
  productId: string,
  product: Product
) => {
  const response = await axios.put(
    `${API_BASE_URL}/products/${productId}`,
    product,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response;
};

export default { getProducts, createProduct, deleteProduct, editProduct };

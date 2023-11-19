import { API_BASE_URL } from "@/constants/constants";
import { OrderRequest } from "@/types/types";
import axios from "axios";

const getOrders = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

const getCompletedOrdersPaginated = async (token: string, page: number) => {
  const response = await axios.get(
    `${API_BASE_URL}/orders/completed?page=${page.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response;
};

const createOrder = async (token: string, orderRequest: OrderRequest) => {
  const response = await axios.post(`${API_BASE_URL}/orders`, orderRequest, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

const deleteOrder = async (token: string, orderId: string) => {
  const response = await axios.delete(`${API_BASE_URL}/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

const setOrderToCompleted = async (token: string, orderId: string) => {
  const response = await axios.put(
    `${API_BASE_URL}/orders/completed/${orderId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response;
};

export default {
  createOrder,
  getOrders,
  deleteOrder,
  setOrderToCompleted,
  getCompletedOrdersPaginated,
};

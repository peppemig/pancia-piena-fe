import { API_BASE_URL } from "@/constants/constants";
import axios from "axios";
import { User } from "firebase/auth";

const createUserWithEmail = async (
  user: User,
  name: string,
  surname: string
) => {
  const response = await axios.post(`${API_BASE_URL}/users`, {
    id: user.uid,
    name: `${name} ${surname}`,
    email: user.email,
  });
  return response;
};

const createUserWithGoogle = async (user: User) => {
  const response = await axios.post(`${API_BASE_URL}/users`, {
    id: user.uid,
    name: user.displayName,
    email: user.email,
  });
  return response;
};

export default { createUserWithEmail, createUserWithGoogle };

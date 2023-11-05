import { API_BASE_URL } from "@/constants/constants";
import axios from "axios";

const getStats = async (
  token: string,
  year: number,
  month: number,
  day: number
) => {
  const response = await axios.get(
    `${API_BASE_URL}/stats?year=${year}&month=${month}&day=${day}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response;
};

export default { getStats };

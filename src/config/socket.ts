import { ORIGIN_URL } from "@/constants/constants";
import { io } from "socket.io-client";
const URL = ORIGIN_URL;
export const socket = io(URL, { autoConnect: false });

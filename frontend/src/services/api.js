import axios from "axios";

console.log("variable", import.meta.env.VITE_API_URL);

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Todas las peticiones llevarán cookies automáticamente
  headers: {
    "Content-Type": "application/json",
  },
});

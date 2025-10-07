import axios from "axios";

const api = axios.create({
  baseURL: "https://almoxarifado-backend.vercel.app",
});

export default api;

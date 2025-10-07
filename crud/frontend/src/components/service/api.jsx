import axios from "axios";

const api = axios.create({
  baseURL: "https://almoxarifado-efz1.onrender.com",
});

export default api;

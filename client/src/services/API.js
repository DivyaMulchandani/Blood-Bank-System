import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.REACT_APP_BASEURL ||
    "https://blood-bank-system-api.onrender.com",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")} `;
  }
  return req;
});

export default API;

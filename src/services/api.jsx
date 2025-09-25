import axios from 'axios';

let api = axios.create({
  baseURL: 'https://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
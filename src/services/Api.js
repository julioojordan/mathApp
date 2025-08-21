
import axios from "axios";
// const apiUrl = window.env?.REACT_APP_API_URL || process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: "http://localhost:3001",
});

// Interceptor for adding header Authorization di setiap request but still dont use this
// api.interceptors.request.use(
//   (config) => {
//     const token = document.cookie
//       .split("; ")
//       .find(row => row.startsWith('auth_token='))
//       ?.split('=')[1];

//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Interceptor for handling error
// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response && error.response.status === 401) {
//       return Promise.reject(error);
//     }
//     return Promise.reject(error);
//   }
// );

export default api;

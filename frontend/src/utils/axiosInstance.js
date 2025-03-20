import axios from "axios";

const apiUrl = process.env.REACT_APP_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: apiUrl,
});

// ✅ Auto-attach auth token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;

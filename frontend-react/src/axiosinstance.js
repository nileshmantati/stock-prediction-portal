import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_BASE_API;
const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": 'application/json',
    }
});

// Request Interceptor
axiosInstance.interceptors.request.use(

    function (config) {
        const accesstoken = localStorage.getItem('access_token');
        if (accesstoken) {
            config.headers['Authorization'] = `Bearer ${accesstoken}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshtoken = localStorage.getItem('refresh_token');
            try {
                // Fix #14: Use bare axios (not axiosInstance) to avoid interceptor loop
                const refreshUrl = `${baseURL.replace(/\/+$/, '')}/token/refresh/`;
                const response = await axios.post(refreshUrl, { refresh: refreshtoken });
                localStorage.setItem('access_token', response.data.access);
                originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
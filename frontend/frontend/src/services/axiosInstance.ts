import axios from 'axios';
import { createCookie } from 'react-router-dom';

const apiClient = axios.create({
    baseURL: '',   // Vite proxy handles all routes
});

export const apiClientWithAuth = axios.create({
    baseURL: '',   // Vite proxy handles all routes
    withCredentials: true, // Use this for authentication
});
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

apiClientWithAuth.interceptors.request.use((config) => {
    const token = createCookie('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export default apiClient;

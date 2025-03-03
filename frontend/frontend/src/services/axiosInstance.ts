import axios from 'axios';

const apiClient = axios.create({
    baseURL: '',   // Vite proxy handles all routes
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export default apiClient;

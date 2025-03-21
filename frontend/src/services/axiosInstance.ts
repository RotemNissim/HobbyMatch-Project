import axios from 'axios';
const token = localStorage.getItem('accessToken');
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
const apiClient = axios.create({
    baseURL: 'https://node120.cs.colman.ac.il/api',   // Vite proxy handles all routes
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    console.log("Adding Authorization Header:", token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.error("axios error:", error);
    return Promise.reject(error);
});

export const apiClientWithAuth = axios.create({
    baseURL: 'http://localhost:4001/api',   // Vite proxy handles all routes
    // Use this for authentication
});

apiClientWithAuth.interceptors.request.use((config) => {
    let token = localStorage.getItem('accessToken') || null;

    if (!token) {
        console.warn("No token in localStorage, checking cookies...");
        const cookies = document.cookie.split("; ");
        const accessTokenCookie = cookies.find(row => row.startsWith("accessToken="));

        if (accessTokenCookie) {
            token = accessTokenCookie.split("=")[1]; // Extract token value
        }
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Authorization Header Set:", config.headers.Authorization);
    } else {
        console.warn("No access token found! Request may be rejected.");
    }

    return config;
});



export default apiClient;

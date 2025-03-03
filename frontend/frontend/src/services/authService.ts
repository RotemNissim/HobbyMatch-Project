import apiClient from './axiosInstance';
import { AuthFormData } from '../types';

export const login = async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password });

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    return data; // could include user data if your backend sends it
};

export const register = async (formData: AuthFormData) => {
    const { data } = await apiClient.post('/auth/register', formData);

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    return data;
};

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

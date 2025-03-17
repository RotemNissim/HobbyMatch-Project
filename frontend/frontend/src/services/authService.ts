import apiClient from './axiosInstance';
import { AuthFormData } from '../types';
import { CredentialResponse } from '@react-oauth/google';
import { googleSignIn } from './userService';
import { setGlobalFlag } from '../globalState';


export const login = async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password });

    console.log("✅ Login Success:", data);

    if(!data.accessToken) {
        console.error("❌ No accessToken received!");
        throw new Error("Login failed: No access token received");
    }

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setGlobalFlag (true);

    return data; // could include user data if your backend sends it
};

export const register = async (formData: FormData) => {
    const { data } = await apiClient.post('/auth/register', formData);

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setGlobalFlag (true);

    return data;
};

export const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
            console.log(credentialResponse);
            const res = await googleSignIn(credentialResponse);
            console.log(res);
            localStorage.setItem("accessToken", res.accessToken!);
            localStorage.setItem("refreshToken", res.refreshToken!);
            setGlobalFlag (true);
            
    } catch (err) {
        console.log(err);
    } 

};

export const onGoogleLoginFailure = () => {
    console.log("Google Login Failed");
};

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

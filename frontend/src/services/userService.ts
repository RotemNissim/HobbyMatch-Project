import { CredentialResponse } from '@react-oauth/google';
import apiClient, { apiClientWithAuth } from './axiosInstance';

export interface IUser {
    email: string,
    password: string,
    profilePicture: string,
    _id?:string,
    accessToken?:string,
    refreshToken?: string,
    firstName?:string,
    lastName?:string
}

export const getCurrentUser = async () => {
    const { data } = await apiClient.get('/users/me');
    return data;
};

export const getGoogleUser = async () => {
    const { data } = await apiClientWithAuth.get('/users/me');
    return data;
}

export const updateProfile = async (userId: string, updates: Partial<{firstName: string; lastName: string; hobbies: string[]; profilePicture: string;}>) => {
    const { data } = await apiClient.put(`/users/${userId}`, updates);
    return data;
};

export const updateProfilePicture = async (userId: string, file: File) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const { data } = await apiClient.put(`/users/${userId}/profile-picture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    return data;
};

export const getUserHobbies = async (userId: string) => {
    console.log("UserService - getUserHobbies (Front)");

    const { data } = await apiClient.get(`/users/${userId}/hobbies`);
    return data;
};

export const googleSignIn = (credentialResponse: CredentialResponse) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("Google Sign In Success");
        apiClient.post("/auth/google", credentialResponse).then((response) => {
            console.log(response);
            resolve(response.data);
        }).catch((error) => {
            console.error(error);
            reject(error);
        })
})
};

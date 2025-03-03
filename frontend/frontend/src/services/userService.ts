import apiClient from './axiosInstance';

export const getCurrentUser = async () => {
    const { data } = await apiClient.get('/users/me');
    return data;
};

export const updateProfile = async (userId: string, updates: Partial<{firstName: string; lastName: string; email: string; hobbies: string[]; profilePicture: string;}>) => {
    const { data } = await apiClient.put(`/users/${userId}`, updates);
    return data;
};

export const updateProfilePicture = async (userId: string, file: File) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const { data } = await apiClient.put(`/users/${userId}/picture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

export const getUserHobbies = async () => {
    const { data } = await apiClient.get('/users/hobbies');
    return data;
};

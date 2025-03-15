import  apiClient from "./axiosInstance"

export const listHobbies = async () => {
    const { data } = await apiClient.get("/hobbies")
    return data;
}

export const toggleHobby = async (userId: string, hobbyId: string) => {
    const { data } = await apiClient.post(`/hobbies/${userId}/toggle`, {hobbyId});
    return data.hobbies;
}

export const toggleHobbyInEvent = async (eventId: string, hobbyId: string) => {
    const { data } = await apiClient.post(`/hobbies/${eventId}/toggle`, {hobbyId});
    return data.hobbies;
}

export const getHobbiesByUserId = async (userId: string) => {
    const { data } = await apiClient.get(`/hobbies/user/${userId}`);
    return data;
}
import apiClient from './axiosInstance';

export const joinEvent = async (eventId: string) => {
    await apiClient.post(`/events/${eventId}/join`);
};

export const leaveEvent = async (eventId: string) => {
    await apiClient.post(`/events/${eventId}/leave`);
};

export const createEvent = async (eventData: Record<string, any>) => {
    const { data } = await apiClient.post('/users/events', eventData);
    return data;
};

export const updateEvent = async (eventId: string, updates: Record<string, any>) => {
    const { data } = await apiClient.put(`/users/events/${eventId}`, updates);
    return data;
};

export const deleteEvent = async (eventId: string) => {
    await apiClient.delete(`/users/events/${eventId}`);
};

export const getUserEvents = async () => {
    const { data } = await apiClient.get('/events/mine');
    return data; // { createdEvents: [...], joinedEvents: [...] }
};

export const getEventsCreatedByUser = async (userId: string) => {
    const { data } = await apiClient.get(`/events?createdBy=${userId}`);
    return data;
};

export const getEventsUserIsAttending = async (userId: string) => {
    const { data } = await apiClient.get(`/events?participants=${userId}`);
    return data;
};

export const getCurrentEvent = async (eventId: string) => {
    console.log(`📡 API Request: GET /events/${eventId}`);
    try {
        const response = await apiClient.get(`/events/${eventId}`);
        console.log("✅ API Response Data:", response.data); // ✅ Check if data exists
        return response.data;
    } catch (error) {
        console.error("❌ API Error fetching event:", error);
        throw error; // Ensure errors are caught
    }
};


export const getCommentsToEvent = async (eventId:string) => {
    const { data } = await apiClient.get(`/events/${eventId}/comments`);
    return data;
}

export const addCommentToEvent = async (eventId:string, comment: {content:string}) => {
    const { data } = await apiClient.post(`/events/${eventId}/comments`, comment);
    return data;
}
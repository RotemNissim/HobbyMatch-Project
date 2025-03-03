import apiClient from './axiosInstance';

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
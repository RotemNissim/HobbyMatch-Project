import apiClient from "./axiosInstance";
import { IAdmin, IUser, IEvent, IHobby } from "../types"

//Users

export const createUser = async (user: IUser) => { 
    return new Promise<IUser>((resolve, reject) => {
        apiClient.post("/admin/users", user).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        })
    })
};

export const deleteUser = async (userId: string) => {
    return apiClient.delete(`/admin/users/${userId}`);

};

export const listUsers = async () => {
    const { data } = await apiClient.get("/admin/users");
    return data; 
};

//Events

export const createEvent = async (event: IEvent) => {
    return new Promise<IEvent>((resolve, reject) => {
        apiClient.post("/admin/events", event).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        })
    })
};

export const updateEvent = async (eventId: string, updates: Partial<{firstName: string; lastName: string; hobbies: string[]; profilePicture: string;}>) => {
    const { data } = await apiClient.put(`/admin/events/${eventId}`, updates);
    return data;
};

export const deleteEvent = async (eventId: string) => {
    return apiClient.delete(`/admin/events/${eventId}`);
};

export const listEvents = async () => {
    const { data } = await apiClient.get("/admin/events");
    console.log("listEvents API response (adminService)", data);
    return  data; 
};

//Hobbies

export const createHobby = async (hobby: IHobby) => {
    return new Promise<IHobby>((resolve, reject) => {
        apiClient.post("/admin/hobbies", hobby).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        })
    })
};

export const updateHobby = async (hobbyId: string, updates: Partial<{name: string; category: string; users: string[];}>) => {
    const { data } = await apiClient.put(`/admin/hobbies/${hobbyId}`, updates);
    return data;
};

export const deleteHobby = async (hobbyId: string) => {
    return apiClient.delete(`/admin/hobbies/${hobbyId}`);
};

export const listHobbies = async () => {
    const { data } = await apiClient.get("/admin/hobbies");
    return data; 
};

//Admins

export const getCurrentAdmin = async () => {
    console.log("🔥 Fetching admin user...");

    const { data } = await apiClient.get("/admin/me");

    console.log("🔥 Admin Response:", data);
    return data;  
}

export const createAdmin = async (admin: IAdmin) => {
    return new Promise<IAdmin>((resolve, reject) => {
        apiClient.post("/admin/admins", admin).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        })
    })
};

export const updateAdmin = async (adminId: string, updates: Partial<{firstName: string; lastName: string; role: string; profilePicture: string;}>) => {
    const { data } = await apiClient.put(`/admin/admins/${adminId}`, updates);
    return data;
};

export const deleteAdmin = async (adminId: string) => {
    return apiClient.delete(`/admin/admins/${adminId}`);
};

export const listAdmins = async () => {
    const { data } = await apiClient.get("/admin/admins");
    return data;
};




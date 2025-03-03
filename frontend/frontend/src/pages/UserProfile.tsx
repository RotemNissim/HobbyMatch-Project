import { useEffect, useState } from "react";
import apiClient from "../services/axiosInstance";

const UserProfile = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await apiClient.get('/users/me');
            setUser(data);
        };

        fetchUser();
    }, []);

    if (!user) return <p>Loading...</p>;

    return <div>Welcome, {user.firstName} {user.lastName}!</div>;
};

export default UserProfile;

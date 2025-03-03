import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


interface User {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    hobbies: { _id: string; name: string }[];
    calendar: { _id: string; title: string; date: string; location: string }[];
}
const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`/users/${id}`);
                setUser(response.data);
            } catch (err) {
                setError('Failed to fetch user profile');
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [id]);

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>{user.firstName} {user.lastName}</h1>
            <img src={user.profilePicture || '/default-profile.png'} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
            <h2>Hobbies</h2>
            <ul>
                {user.hobbies.length > 0 ? user.hobbies.map(hobby => (
                    <li key={hobby._id}>{hobby.name}</li>
                )) : <p>No hobbies listed.</p>}
            </ul>
            <h2>Events</h2>
            <ul>
                {user.calendar.length > 0 ? user.calendar.map(event => (
                    <li key={event._id}>{event.title} - {new Date(event.date).toLocaleDateString()}</li>
                )) : <p>No events found.</p>}
            </ul>
        </div>
    );
};

export default UserProfile;
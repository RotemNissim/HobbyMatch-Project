import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/userService';
import EditProfile from '../components/EditProfile';
import CreateEventForm from '../components/CreateEventForm';
import MyCreatedEvents from '../components/MyCreatedEvents';
import '../styles/profile.css';

const UserProfile = () => {
    const [user, setUser] = useState<any>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isCreatingEvent, setIsCreatingEvent] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error("User not authenticated, redirecting...");
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate]);

    const handleProfileUpdated = async () => {
        const updatedUser = await getCurrentUser();
        setUser(updatedUser);
        setIsEditingProfile(false);
    };

    const handleEventCreated = () => {
        setIsCreatingEvent(false);
    };

    return (
        <div className="profile-container">
            <h1>My Profile</h1>

            {user && !isEditingProfile && (
                <div className="mt-4 space-y-2">
                    <p className="info-text"><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p className="info-text"><strong>Email:</strong> {user.email}</p>
                    {user.profilePicture && (
                        <img src={user.profilePicture} alt="Profile" className="w-24 h-24 rounded-full" />
                    )}
                    <div className="profile-buttons">
                        <button className="edit-button" onClick={() => setIsEditingProfile(true)}>
                            ✏️ Edit Profile
                        </button>
                        <button className="create-event-button" onClick={() => setIsCreatingEvent(true)}>
                            ➕ Create Event
                        </button>
                    </div>
                </div>
            )}

            {isEditingProfile && (
                <EditProfile initialUser={user} onProfileUpdated={handleProfileUpdated} />
            )}

            {isCreatingEvent && (
                <CreateEventForm onEventCreated={handleEventCreated} onCancel={() => setIsCreatingEvent(false)} />
            )}

            <div className="mt-8">
                <h2 className="text-xl font-semibold">Events You Created</h2>
                <MyCreatedEvents />
            </div>
        </div>
    );
};

export default UserProfile;

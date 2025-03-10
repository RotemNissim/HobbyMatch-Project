import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/userService';
import EditProfile from '../components/EditProfile';
import MyCreatedEvents from '../components/MyCreatedEvents';
import CreateEventForm from '../components/CreateEventForm';

interface Event {
  _id: string;
  title: string;
  description: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
}

const UserProfile = () => {
    const [user, setUser] = useState<any>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isCreatingEvent, setIsCreatingEvent] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        };
        fetchUser();
    }, []);

    const handleProfileUpdated = async () => {
        const updatedUser = await getCurrentUser();
        setUser(updatedUser);
        setIsEditingProfile(false);
    };

    const handleEventCreated = () => {
        setIsCreatingEvent(false);
    };

    return (
        <div className="carousel-container">
            <h1 className="text-2xl font-bold">My Profile</h1>

            {user && !isEditingProfile && (
                <div className="mt-4 space-y-2">
                    <div className='text-and-buttons'>
                    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    {user.profilePicture && (
                        <img src={user.profilePicture} alt="Profile" className="w-24 h-24 rounded-full" />
                    )}
                    <div className="space-x-4 mt-4">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => setIsEditingProfile(true)}
                        >
                            ✏️ Edit Profile
                        </button>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded"
                            onClick={() => setIsCreatingEvent(true)}
                        >
                            ➕ Create Event
                        </button>
                    </div>
                    </div>
                </div>
            )}

            {isEditingProfile && (
                <EditProfile initialUser={user} onProfileUpdated={handleProfileUpdated} />
            )}

            {isCreatingEvent && (
                <CreateEventForm
                    onEventCreated={handleEventCreated}
                    onCancel={() => setIsCreatingEvent(false)}
                />
            )}

            <div className="mt-8">
                <h2 className="text-xl font-semibold">Events You Created</h2>
                <div className="carousel">
                    <MyCreatedEvents />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getGoogleUser } from '../services/userService';
import { getCurrentAdmin } from '../services/adminService';
import EditProfile from '../components/EditProfile';
import CreateEventForm from '../components/CreateEventForm';
import MyCreatedEvents from '../components/MyCreatedEvents';
import '../styles/profile.css';
import { logout } from '../services/authService';
import axios, { AxiosError } from 'axios';

const UserProfile = () => {
    const [user, setUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isCreatingEvent, setIsCreatingEvent] = useState(false);
    const navigate = useNavigate();

    
    const handleAdminRedirect = () => {
        navigate("/admin"); // 🔥 Change to your actual admin route
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                console.log("🔥 Current User from API:", currentUser);
                if (!currentUser) {
                    const googleCurrentUser = await getGoogleUser();
                    setUser(googleCurrentUser);
                } else {
                    setUser(currentUser);
                }
                try {
                    const adminData = await getCurrentAdmin();
                    if (adminData?.role === "admin") {
                        console.log("🔥 User is VERIFIED Admin:", adminData);
                        setIsAdmin(true);
                    }
                } catch (error:unknown) {
                    const axiosError = error as AxiosError;
                    if (axiosError.response?.status === 403) {
                        console.warn("❌ User is NOT an admin. Ignoring error.");
                        setIsAdmin(false); // ✅ Do NOT log out, just mark as non-admin
                    } else {
                        console.error("🔥 Unexpected error in getCurrentAdmin:", error);
                    }
                }
    
            } catch (error) {
                console.error("❌ User not authenticated, redirecting...", error);
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
                            <button 
                                className='bg-red-500 text-white px-4 py-2 rounded'
                                onClick={logout}
                            >
                                Logout
                            </button>

                            {/* ✅ Show "Go to Admin Panel" only if the user is an admin */}
                            {isAdmin && (
                                <button 
                                    onClick={() => navigate("/admin")} 
                                    className="bg-indigo-500 text-white px-4 py-2 rounded"
                                >
                                    Go to Admin Panel
                                </button>
                            )}
                        </div>
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
                <div className="carousel">
                    <MyCreatedEvents />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
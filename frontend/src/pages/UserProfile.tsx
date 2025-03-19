import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getGoogleUser } from '../services/userService';
import { getCurrentAdmin } from '../services/adminService';
import EditProfile from '../components/EditProfile';
import CreateEventForm from '../components/CreateEventForm';
import MyCreatedEvents from '../components/MyCreatedEvents';
import MyHobbies from '../components/MyHobbies';
import GeminiEventCreator from "../components/GeminiEventCreator";
import '../styles/profile.css';
import { logout } from '../services/authService';
import { AxiosError } from 'axios';
import { setGlobalFlag } from '../globalState';
import Select from 'react-select';

const BASE_URL = import.meta.env.VITE_API_BASE_URL +  "/api/uploads/profile_pictures";
console.log("base url:", BASE_URL);

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
    
        const handleLogout = () => {
            logout();
            setGlobalFlag(false);  //localStorage
            navigate('/');
        };
        
    return (
        <div className="UP_carousel-container">

            {user && !isEditingProfile && (
                <div className="UP_user-profile-container">
                    <h1 className="UP_titel">My Profile</h1>
                    <div className='UP_user-profile-details'>
                        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        {user.profilePicture && (
                               <img 
                               src={user.profilePicture ? `https://node120.cs.colman.ac.il/api/uploads/profile_pictures/${user.profilePicture}` : "/default-avatar.png"}   
                               alt="Profile" 
                               className="UP_profile-picture"
                           />
                        )}
                        <div className="UP_user-profile-buttons">
                            <button
                                className="UP_dit-profile-button"
                                onClick={() => setIsEditingProfile(true)}
                            >
                                ✏️ Edit Profile
                            </button>
                            <button
                                className="UP_create-event-button"
                                onClick={() => setIsCreatingEvent(true)}
                            >
                                ➕ Create Event
                            </button>
                            <button 
                                className='UP_logout-button'
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                            

                            {user && <MyHobbies user={user} />}
                            {/* ✅ Show "Go to Admin Panel" only if the user is an admin */}
                            {isAdmin && (
                                <button 
                                    onClick={() => navigate("/admin")} 
                                    className="UP_admin-panel-button"
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
            <div className="UP_my-created-events-container">
                <h2 className="UP_my-events-titel">Events You Created</h2>
                <div className="UP_carousel">
                    <MyCreatedEvents />
                    {/* ✅ Add GeminiEventCreator component */}
                    {user && <GeminiEventCreator />}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
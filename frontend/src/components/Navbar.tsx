import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import { getGlobalFlag, setGlobalFlag, subscribeToAuthChanges } from '../globalState';

const Navbar: React.FC = () => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(getGlobalFlag());
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(setIsUserLoggedIn); 
        return () => unsubscribe(); // מסיר את המאזין כשNavbar מתפרק
    }, []);

    const handleLogout = () => {
        logout();
        setGlobalFlag(false); // יעדכן את הסטייט וה-Navbar יתעדכן אוטומטית
        navigate('/');
    };

    return (
        <nav className='navbar'>
            <div className='logo'>
                <a href="/">
                    <img src="/HobbyMatchLogo.png" alt="HobbyMatch Logo" className='logo imag'/>
                </a>
            </div>
            <div className='navbar buttons'>
                <Link to="/" >Home</Link>
                <Link to="/profile" >Profile</Link>
                <Link to="/events">Events</Link>
                {isUserLoggedIn ? (
                    <button onClick={handleLogout} className='logout'>
                        Logout
                    </button>
                ) : (
                    <Link to="/login" className='login'>Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

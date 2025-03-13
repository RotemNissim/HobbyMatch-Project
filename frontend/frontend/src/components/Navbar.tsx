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
        <nav style={navStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a href="/">
                    <img src="/HobbyMatchLogo.png" alt="HobbyMatch Logo" style={{ height: '80px' }} />
                </a>
            </div>
            <div style={linkContainer}>
                <Link to="/" style={linkStyle}>Home</Link>
                <Link to="/profile" style={linkStyle}>Profile</Link>
                <Link to="/events" style={linkStyle}>Events</Link>
                {isUserLoggedIn ? (
                    <button onClick={handleLogout} style={{ ...linkStyle, backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                        Logout
                    </button>
                ) : (
                    <Link to="/login" style={linkStyle}>Login</Link>
                )}
            </div>
        </nav>
    );
};

const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: 'white'
};

const linkContainer = {
    display: 'flex',
    gap: '15px'
};

const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold'
};

export default Navbar;

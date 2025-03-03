import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav style={navStyle}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/HobbyMatchLogo.png" alt="HobbyMatch Logo" style={{ height: '80px' }} />
                </div>
            <div style={linkContainer}>
                <Link to="/" style={linkStyle}>Home</Link>
                <Link to="/profile" style={linkStyle}>Profile</Link>
                <Link to="/events" style={linkStyle}>Events</Link>
                <Link to="/login" style={linkStyle}>Login</Link>
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

import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={footerStyle}>
            <p>© 2025 HobbyMatch. All Rights Reserved.</p>
        </footer>
    );
};

const footerStyle:React.CSSProperties = {
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#333',
    color: 'white',
    position: 'absolute',
    width: '100%',
    bottom: 0
};

export default Footer;

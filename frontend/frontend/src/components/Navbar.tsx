import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/authService"; // הפונקציה של הניתוק
import { globalFlag, setGlobalFlag } from "../globalState";

const Navbar: React.FC = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // בדוק אם המשתמש מחובר (תוכל לבדוק למשל אם יש טוקן ב-localStorage או בקונטקסט)
    const token = localStorage.getItem("authToken"); // דוגמה אם טוקן מאוחסן ב-localStorage
    if (token) {
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    logout(); // מבצע את פעולת ה-logout
    setGlobalFlag(false); // עדכון סטטוס המשתמש
    navigate("/"); // רידיירקט לעמוד הבית
  };

  return (
    <nav style={navStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <a href="/">
          <img
            src="/HobbyMatchLogo.png"
            alt="HobbyMatch Logo"
            style={{ height: "80px" }}
          />
        </a>
      </div>
      <div style={linkContainer}>
        <Link to="/" style={linkStyle}>
          Home
        </Link>
        <Link to="/profile" style={linkStyle}>
          Profile
        </Link>
        <Link to="/events" style={linkStyle}>
          Events
        </Link>
        {/* הצגת כפתור התחברות/ניתוק */}
        {globalFlag ? (
          <button
            onClick={handleLogout}
            style={{
              ...linkStyle,
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login" style={linkStyle}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#333",
  color: "white",
};

const linkContainer = {
  display: "flex",
  gap: "15px",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};

export default Navbar;

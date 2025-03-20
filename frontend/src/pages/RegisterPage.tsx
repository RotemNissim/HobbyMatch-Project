
import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        if (profilePicture) {
            data.append("profilePicture", profilePicture);
        }

        try {
            await register(data);
            navigate("/profile");
        } catch (err) {
            setError("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="Register container">
            {preview && <img src={preview} alt="Preview" className="Register img" />}
            <form onSubmit={handleSubmit} className="Register form">
            <h2 className="Register titel">Register</h2>
                <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required className="Register input firstName" />
                <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required className="Register input lastName"/>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="Register input email" />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="Register input password" />
                <input type="file" accept="image/*" onChange={handleFileChange} className="Register input img file" />
                <button type="submit" disabled={loading} className="Register submit button">
                    {loading ? "Registering..." : "Register"}
                </button>
                {error && <p className="Register error">{error}</p>}
            </form>
        </div>
    );
};

export default Register;
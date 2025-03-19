import { useState } from 'react';
import { updateProfile, updateProfilePicture } from '../services/userService';

interface Props {
    initialUser: any;
    onProfileUpdated: () => void;
}

const EditProfile: React.FC<Props> = ({ initialUser, onProfileUpdated }) => {
    const [form, setForm] = useState({
        firstName: initialUser.firstName,
        lastName: initialUser.lastName,
        email: initialUser.email,
        password: ""  // ריק בהתחלה - יעדכן רק אם המשתמש יזין סיסמה
    });
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialUser.profilePicture || null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSave = async () => {
        const updates: any = { ...form };
        
        // אם הסיסמה ריקה - לא שולחים אותה לשרת
        if (!form.password) {
            delete updates.password;
        }

        await updateProfile(initialUser._id, updates);

        if (profilePicture) {
            const updatedUser = await updateProfilePicture(initialUser._id, profilePicture);
            setPreview(`http://localhost:3000/uploads/profile_pictures/${updatedUser.profilePicture}`);
        }

        onProfileUpdated(); // Notify parent (UserProfile)
    };

    return (
        <div className="EditProfile container">
            <h2 className="EditProfile titel">Edit Profile</h2>
            {preview && <img src={preview} alt="Profile Preview" className="w-24 h-24 rounded-full" />}
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" />
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" readOnly />
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="New Password (optional)" />
            <input type="file" onChange={handlePictureChange} />
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2">💾 Save</button>
            <button onClick={onProfileUpdated} className="ml-4 bg-gray-500 text-white px-4 py-2">Cancel</button>
        </div>
    );
};

export default EditProfile;

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
    });
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        await updateProfile(initialUser._id, form);

        if (profilePicture) {
            await updateProfilePicture(initialUser._id, profilePicture);
        }

        onProfileUpdated(); // Notify parent (UserProfile)
    };

    return (
        <div className="space-y-4">
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" />
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" readOnly/>
            <input type="file" onChange={handlePictureChange} />
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2">💾 Save</button>
            <button onClick={onProfileUpdated} className="ml-4 bg-gray-500 text-white px-4 py-2">Cancel</button>
        </div>
    );
};

export default EditProfile;

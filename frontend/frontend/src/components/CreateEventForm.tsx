import { useEffect, useState } from 'react';
import { createEvent } from '../services/eventService';
import { listHobbies } from '../services/hobbyService';

interface EventForm {
    title: string;
    description: string;
    date: string;
    location: string;
    hobbies: string[];  // Should be an array of hobby ObjectIds
}

interface Props {
    onEventCreated: () => void;
    onCancel: () => void;
}

const CreateEventForm: React.FC<Props> = ({ onEventCreated, onCancel }) => {
    const [form, setForm] = useState<EventForm>({
        title: '',
        description: '',
        date: '',
        location: '',
        hobbies: [], // This should be an array of ObjectIds for MongoDB
    });

    const [hobbiesList, setHobbiesList] = useState<{ _id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHobbies = async () => {
            try {
                const hobbies = await listHobbies();
                setHobbiesList(hobbies);
            } catch (error) {
                console.error("❌ Error fetching hobbies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHobbies();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleHobbyToggle = (hobbyId: string) => {
        setForm((prevForm) => ({
            ...prevForm,
            hobbies: prevForm.hobbies.includes(hobbyId)
                ? prevForm.hobbies.filter((id) => id !== hobbyId) // 🔥 Remove hobby if already selected
                : [...prevForm.hobbies, hobbyId] // 🔥 Add hobby if not selected
        }));
    };

    const handleSubmit = async () => {
        try {
            await createEvent({
                ...form,
                date: new Date(form.date), // Convert to Date object
            });

            onEventCreated(); // Notify parent (UserProfile)
        } catch (error) {
            console.error("❌ Error creating event:", error);
        }
    };

    return (
        <div className="space-y-4 bg-gray-100 p-4 rounded">
            <h3 className="text-xl font-semibold">Create New Event</h3>
            <input 
                type="text" 
                name="title" 
                placeholder="Event Title" 
                onChange={handleChange} 
                className="w-full p-2 border" 
            />
            <textarea 
                name="description" 
                placeholder="Event Description" 
                onChange={handleChange} 
                className="w-full p-2 border"
            ></textarea>
            <input 
                type="date" 
                name="date" 
                onChange={handleChange} 
                className="w-full p-2 border" 
            />
            <input 
                type="text" 
                name="location" 
                placeholder="Location" 
                onChange={handleChange} 
                className="w-full p-2 border" 
            />

            <div>
                <label className="block text-sm font-medium">Select Hobbies</label>
                {loading ? (
                    <p>Loading hobbies...</p>
                ) : (
                    <div className="space-y-2">
                        {hobbiesList.map((hobby) => (
                            <div key={hobby._id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={hobby._id}
                                    checked={form.hobbies.includes(hobby._id)}
                                    onChange={() => handleHobbyToggle(hobby._id)}
                                    className="cursor-pointer"
                                />
                                <label htmlFor={hobby._id} className="cursor-pointer">{hobby.name}</label>
                            </div>
                        ))}
                    </div>
                )}

                {/* Display selected hobbies */}
                {form.hobbies.length > 0 && (
                    <div className="mt-2">
                        <p className="text-sm font-semibold">Selected Hobbies:</p>
                        <ul className="list-disc pl-5">
                            {form.hobbies.map((hobbyId) => {
                                const hobby = hobbiesList.find((h) => h._id === hobbyId);
                                return hobby ? <li key={hobby._id}>{hobby.name}</li> : null;
                            })}
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex space-x-4">
                <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
                    Create Event
                </button>
                <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default CreateEventForm;

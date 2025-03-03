import { useState } from 'react';
import { createEvent } from '../services/eventService';

interface EventForm {
    title: string;
    description: string;
    date: string;
    location: string;
    hobbies: string[];
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
        hobbies: [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        await createEvent({
            ...form,
            date: new Date(form.date),  // Convert to Date object
        });

        onEventCreated();  // Notify parent (UserProfile)
    };

    return (
        <div className="space-y-4 bg-gray-100 p-4 rounded">
            <h3 className="text-xl font-semibold">Create New Event</h3>
            <input type="text" name="title" placeholder="Event Title" onChange={handleChange} className="w-full p-2 border" />
            <textarea name="description" placeholder="Event Description" onChange={handleChange} className="w-full p-2 border"></textarea>
            <input type="date" name="date" onChange={handleChange} className="w-full p-2 border" />
            <input type="text" name="location" placeholder="Location" onChange={handleChange} className="w-full p-2 border" />
            <input type="text" name="hobby" placeholder="Hobbies (comma-separated IDs)" onChange={(e) => {
                setForm({ ...form, hobbies: e.target.value.split(',') });
            }} className="w-full p-2 border" />
            
            <div className="flex space-x-4">
                <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">Create Event</button>
                <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            </div>
        </div>
    );
};

export default CreateEventForm;

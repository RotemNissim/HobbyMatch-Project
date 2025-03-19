import { useEffect, useState} from 'react';
import { createEvent, uploadEventImage } from '../services/eventService';
import { listHobbies } from '../services/hobbyService';
import { useParams } from 'react-router-dom';
interface EventForm {
    title: string;
    description: string;
    date: string;
    location: string;
    image:string;
    hobby: string[]; // 🔥 MongoDB expects "hobby", not "hobbies"
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
        hobby: [],
        image: '',
    });

    const [hobbiesList, setHobbiesList] = useState<{ _id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);

    const { eventId } = useParams(); // Get eventId from URL
    const [event, setEvent] = useState<Event[] | null>(null);


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
            hobby: prevForm.hobby.includes(hobbyId)
                ? prevForm.hobby.filter((id) => id !== hobbyId) // 🔥 Remove if already selected
                : [...prevForm.hobby, hobbyId] // 🔥 Add if not selected
        }));
    };
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Ensure a file was selected
        if (!file || !eventId) return; // Make sure event and event ID exist
    
        try {
            const newImage = await uploadEventImage(eventId, file); // Send the image to backend
            setEvent((prevEvent) => prevEvent ? { ...prevEvent, image: newImage } : prevEvent); // Update state
        } catch (error) {
            console.error("❌ Error uploading event image:", error);
        }
    };
    
    
    // File upload input in UI
    
    

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
        <div className="create-event-form">
            <h3 className="create new event titel">Create New Event</h3>
            <input 
                type="text" 
                name="title" 
                placeholder="Event Title" 
                onChange={handleChange} 
                className="create-event-input-title"  
            />
            <textarea 
                name="description" 
                placeholder="Event Description" 
                onChange={handleChange} 
                className="create-event-input-description"
            ></textarea>
            <input 
                type="date" 
                name="date" 
                onChange={handleChange} 
                className="create-event-input-date" 
            />
            <input 
                type="text" 
                name="location" 
                placeholder="Location" 
                onChange={handleChange} 
                className="create-event-input-location" 
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} />

            <div>
                <label className="">Select Hobbies</label>
                {loading ? (
                    <p>Loading hobbies...</p>
                ) : (
                    <div className="create event form ?1">
                        {hobbiesList.map((hobby) => (
                            <div key={hobby._id} className="create event form ?2">
                                <input
                                    type="checkbox"
                                    id={hobby._id}
                                    checked={form.hobby.includes(hobby._id)}
                                    onChange={() => handleHobbyToggle(hobby._id)}
                                    className="create event form ?3"
                                />
                                <label htmlFor={hobby._id} className="create event form ?4">{hobby.name}</label>
                            </div>
                        ))}
                    </div>
                )}

                {/* Display selected hobbies */}
                {form.hobby.length > 0 && (
                    <div className="create event form hobbies slcted container">
                        <p className="create event form hobbies slcted titel">Selected Hobbies:</p>
                        <ul className="create event form hobbies list">
                            {form.hobby.map((hobbyId) => {
                                const hobby = hobbiesList.find((h) => h._id === hobbyId);
                                return hobby ? <li key={hobby._id}>{hobby.name}</li> : null;
                            })}
                        </ul>
                    </div>
                )}
            </div>

            <div className="create event form buttons">
                <button onClick={handleSubmit} className="Create Event button create">
                    Create Event
                </button>
                <button onClick={onCancel} className="Create Event button cancel">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default CreateEventForm;

import { useEffect, useState } from 'react';
import { getEventsCreatedByUser, deleteEvent } from '../services/eventService';
import { getCurrentUser } from '../services/userService';

const MyCreatedEvents = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [userId, setUserId] = useState<string>('');

    useEffect(() => {
        const loadEvents = async () => {
            const user = await getCurrentUser();
            setUserId(user._id);

            const events = await getEventsCreatedByUser(user._id);
            setEvents(events);
        };

        loadEvents();
    }, []);

    const handleDelete = async (eventId: string) => {
        if (confirm('Are you sure you want to delete this event?')) {
            await deleteEvent(eventId);
            setEvents(events.filter(e => e._id !== eventId));
        }
    };

    return (
        <div>
            <h2>Events You Created</h2>
            {events.length === 0 ? (
                <p>No events found.</p>
            ) : (
                <ul>
                    {events.map(event => (
                        <li key={event._id}>
                            {event.title} - {new Date(event.date).toLocaleDateString()}
                            <button onClick={() => handleDelete(event._id)}>🗑️ Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyCreatedEvents;

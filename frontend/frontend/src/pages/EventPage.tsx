import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getCurrentEvent } from '../services/eventService';
import Comments from '../components/Comments';

interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    image?: string;
    createdBy: string;
    participants: { _id: string }[];
    hobby: { _id: string }[];
    likes: { _id: string }[];
}

const EventPage: React.FC = () => {
    const { eventId } = useParams();
    console.log("🛠️ eventId from useParams:", eventId);
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Get user ID from authentication

    useEffect(() => {
        if (!eventId) return;
    
        const fetchEvent = async () => {
            try {
                console.log("📡 Fetching event from backend...");
                const eventData = await getCurrentEvent(eventId);
    
                if (!eventData) {
                    console.error("❌ No event data received from API");
                    setError("Event not found");
                    return;
                }
    
                console.log("✅ Event Data Received:", eventData);
                setEvent(eventData); // ✅ Correctly set event state
            } catch (err) {
                console.error("❌ Error fetching event:", err);
                setError('Failed to fetch event');
            } finally {
                setLoading(false);
            }
        };
    
        fetchEvent();
    }, [eventId]);
    

    const handleJoinLeave = async () => {
        if (!event || !userId) return;

        const isParticipant = event.participants.some(p => p._id === userId);
        const action = isParticipant ? 'leave' : 'join';

        try {
            const response = await axios.post(`/events/${event._id}/${action}`);
            console.log(response.data);
            setEvent(prevEvent => ({
                ...prevEvent!,
                participants: isParticipant
                    ? prevEvent!.participants.filter(p => p._id !== userId)
                    : [...prevEvent!.participants, { _id: userId }],
            }));
        } catch (err) {
            console.error("❌ Error updating participation:", err);
        }
    };

    if (loading) return <p>Loading event...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '20px' }}>
            {event ? (
                <>
                    <h1>{event.title}</h1>
                    {event.image && (
                        <img src={event.image} alt="Event" style={{ maxWidth: '100%', marginBottom: '10px' }} />
                    )}
                    <p>{event.description}</p>
                    <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Location:</strong> {event.location}</p>

                    {/* Join/Leave button */}
                    <button onClick={handleJoinLeave}>
                        {event.participants.some(p => p._id === userId) ? 'Leave Event' : 'Join Event'}
                    </button>

                    {/* Edit and Delete buttons */}
                    {(event.createdBy === userId || /* Check if user is admin */ true) && (
                        <div>
                            <button>Edit</button>
                            <button>Delete</button>
                        </div>
                    )}

                    {/* Comments Component (Only Renders if Event Exists) */}
                    <Comments eventId={event._id} />
                </>
            ) : (
                <p style={{ color: 'red' }}>Event not found.</p>
            )}
        </div>
    );
};

export default EventPage;

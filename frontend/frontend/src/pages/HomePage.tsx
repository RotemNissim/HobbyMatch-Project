
import React, { useEffect, useState } from 'react';
import { joinEvent, leaveEvent } from '../services/eventService';
import axios from 'axios';

interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    participants: string[];
}

const HomePage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>('your-user-id'); // Replace with actual user ID from auth

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("📡 Fetching events directly from backend...");
        const response = await axios.get("/events");
        console.log("✅ Events fetched:", response.data);
        setEvents(response.data);
      } catch (err) {
        console.error("❌ Error fetching events:", err);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);


    const handleJoinLeave = async (eventId: string, isParticipant: boolean) => {
        try {
            if (isParticipant) {
                await leaveEvent(eventId);
            } else {
                await joinEvent(eventId);
            }
            setEvents(prevEvents => prevEvents.map(event => 
                event._id === eventId 
                    ? { ...event, participants: isParticipant ? event.participants.filter(id => id !== userId) : [...event.participants, userId] }
                    : event
            ));
        } catch (err) {
            console.error("❌ Error updating participation:", err);
        }
    };

    if (loading) return <p>Loading events...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>All Events (Direct Fetch - No Proxy)</h1>
            {events.length === 0 ? (
                <p>No events found.</p>
            ) : (
                <ul>
                    {events.map(event => (
                        <li key={event._id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid black' }}>
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                            <p><strong>Location:</strong> {event.location}</p>
                            <button onClick={() => handleJoinLeave(event._id, event.participants.includes(userId))}>
                                {event.participants.includes(userId) ? 'Leave Event' : 'Join Event'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

};

export default HomePage;

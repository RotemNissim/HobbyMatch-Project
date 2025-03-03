import React, { useEffect, useState } from 'react';
import { joinEvent, leaveEvent } from '../services/eventService';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../styles/global.css';

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
    const [userId, setUserId] = useState<string>('');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                setUserId(decodedToken._id);
            } catch (error) {
                console.error("❌ Failed to decode token:", error);
            }
        }
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                console.log("📡 Fetching events directly from backend...");
                const response = await axios.get('/events');
                console.log("✅ Events fetched:", response.data);
                setEvents(response.data);
            } catch (err) {
                console.error("❌ Error fetching events:", err);
                setError('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [userId]);

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

    if (loading) return <p className="loading">Loading events...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="container">
            {events.length === 0 ? (
                <p className="no-events">No events found.</p>
            ) : (
                events.map(event => (
                    <div key={event._id} className="card">
                        <div className="content">
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                            <p><strong>Location:</strong> {event.location}</p>
                            <button 
                                className="join-leave-button" 
                                onClick={() => handleJoinLeave(event._id, event.participants.includes(userId))}
                            >
                                {event.participants.includes(userId) ? 'Leave Event' : 'Join Event'}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default HomePage;

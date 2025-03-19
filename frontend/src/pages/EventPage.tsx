import React, { useEffect, useState } from 'react';
import { joinEvent, leaveEvent, getCurrentEvent } from '../services/eventService';
import { useParams } from 'react-router-dom';
import Comments from '../components/Comments';
import { jwtDecode } from 'jwt-decode';
import handleDelete from '../components/MyCreatedEvents';
import handleUpdate from '../components/MyCreatedEvents';

interface Participant {
    _id: string;
}

interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    image?: string;
    createdBy: string;
    participants: (Participant | string)[]; // Handles both string and object participants
    hobby: { _id: string }[];
    likes: { _id: string }[];
}

const EventPage: React.FC = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isParticipant, setIsParticipant] = useState<boolean>(false);

    // Decode token to get user info
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                setUserId(decodedToken._id);
                setUserRole(decodedToken.role);
            } catch (error) {
                console.error("❌ Failed to decode token:", error);
            }
        } else {
            setUserId(null);
            setUserRole(null);
        }
    }, []);

    // Fetch event data
    useEffect(() => {
        if (!eventId || !userId) return;

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
                setEvent(eventData);

            } catch (err) {
                console.error("❌ Error fetching event:", err);
                setError('Failed to fetch event');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId, userId]);

    // ✅ Ensure `isParticipant` updates when `event` changes
    useEffect(() => {
        if (event) {
            console.log("🎯 Updating isParticipant state...");
            console.log("👤 Current User ID:", userId);
            console.log("📋 Participants:", event.participants);
            
            setIsParticipant(event.participants.some((p: Participant | string) =>
                typeof p === 'string' ? p === userId : p._id === userId
            ));

            console.log("✅ Updated isParticipant:", isParticipant);
        }
    }, [event, userId]);

    // Handle Join/Leave Event
    const handleJoinLeave = async () => {
        if (!event) return;

        try {
            console.log("🔄 Handling Join/Leave...");
            console.log("⏳ Current isParticipant:", isParticipant);

            if (isParticipant) {
                console.log("👋 Leaving event...");
                await leaveEvent(event._id);
            } else {
                console.log("✅ Joining event...");
                await joinEvent(event._id);
            }

            console.log("🔄 Fetching updated event...");
            const updatedEvent = await getCurrentEvent(event._id);
            
            console.log("📡 New Event Data:", updatedEvent);
            setEvent(updatedEvent);

            console.log("🎯 Checking if user is now a participant...");
            const updatedParticipantStatus = updatedEvent.participants.some((p: Participant | string) =>
                typeof p === 'string' ? p === userId : p._id === userId
            );

            setIsParticipant(updatedParticipantStatus);
            console.log("✅ New isParticipant Value:", updatedParticipantStatus);

        } catch (err) {
            console.error("❌ Error updating participation:", err);
        }
    };

    if (loading) return <p>Loading event...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className='EventPage container'>
            {userId && event ? (
                <>
                    <h1>{event.title}</h1>
                    {event.image && <img src={event.image} alt="Event" className='EventPage img' />}
                    <p>{event.description}</p>
                    <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Location:</strong> {event.location}</p>

                    {/* Join/Leave button */}
                    <button className='EventPage leave join buttons' onClick={handleJoinLeave}>
                        {isParticipant ? "Leave Event" : "Join Event"}
                    </button>

                    {/* Edit and Delete buttons */}
                    {event && (event.createdBy === userId || userRole === "admin") && (
                        <div className='EventPage Edit and Delete buttons'>
                            <button onClick={handleUpdate}>Edit</button>
                            <button onClick={handleDelete}>Delete</button>
                        </div>
                    )}

                    {/* Comments Component */}
                    {event && <Comments eventId={event._id} />}
                </>
            ) : (
                <p className='EventPage Event not found titel'>Event not found.</p>
            )}
        </div>
    );
};

export default EventPage;

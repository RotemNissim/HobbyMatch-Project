import React, { useEffect, useState } from 'react';
import { joinEvent, leaveEvent } from '../services/eventService';
import { useParams } from 'react-router-dom';
import { getCurrentEvent } from '../services/eventService';
import Comments from '../components/Comments';
import { jwtDecode } from 'jwt-decode';
import handleDelete from '../components/MyCreatedEvents'
import handleUpdate from '../components/MyCreatedEvents'

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
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

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
    }, [eventId, userId]);
    
    const isParticipant = event?.participants?.some(p => p._id === userId) || false;

    const handleJoinLeave = async (
        eventId: string,
        isParticipant: boolean,
        userId: string
      ) => {
        try {
          if (isParticipant) {
            await leaveEvent(eventId);
          } else {
            await joinEvent(eventId);
          }
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
            {userId && event ?  (
                <>
                    <h1>{event.title}</h1>
                    {event.image && (
                        <img src={event.image} alt="Event" style={{ maxWidth: '100%', marginBottom: '10px' }} />
                    )}
                    <p>{event.description}</p>
                    <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Location:</strong> {event.location}</p>

                    {/* Join/Leave button */}
                    <button  onClick={() =>
                    handleJoinLeave(
                      event._id,
                      event.participants.some((p) => p._id === userId),
                      userId
                    )
                  }>
                         {isParticipant
                    ? "Leave Event"
                    : "Join Event"}
                    </button>

                    {/* Edit and Delete buttons */}
                    {event && (event.createdBy === userId ||userRole === "admin") && (
                        <div>
                            <button onClick={handleUpdate}>Edit</button>
                            <button onClick={handleDelete}>Delete</button>
                        </div>
                    )}

                    {/* Comments Component (Only Renders if Event Exists) */}
                 {event && <Comments eventId={event._id} />}
                </>
            ) : (
                <p style={{ color: 'red' }}>Event not found.</p>
            )}
        </div>
    );
};

export default EventPage;

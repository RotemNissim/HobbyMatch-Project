import React, { useEffect, useState } from 'react';
import { joinEvent, leaveEvent, getCurrentEvent } from '../services/eventService';
import { useParams } from 'react-router-dom';
import Comments from '../components/Comments';
import { jwtDecode } from 'jwt-decode';
import EventCard from '../components/EventCard';
import handleDelete from '../components/MyCreatedEvents';
import handleUpdate from '../components/MyCreatedEvents';

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
    const [isParticipant, setIsParticipant] = useState(false);

    // Extract user info from JWT token
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

    // Fetch event details
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
                setEvent(eventData);
            } catch (err) {
                console.error("❌ Error fetching event:", err);
                setError("Failed to fetch event");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    // Update isParticipant when event data changes
    useEffect(() => {
      if (event && userId) {
          const participantCheck = event.participants.some(p => p?._id.toString() === userId);
          console.log("🔍 Checking Participants:", event.participants.map(p => p?._id.toString()));
          console.log("👤 User ID:", userId);
          console.log("✅ isParticipant Before Update:", isParticipant);
          setIsParticipant(participantCheck);
          console.log("✅ isParticipant After Update:", participantCheck);
      }
  }, [event?.participants, userId]);
  

    // Handle Join/Leave event
    const handleJoinLeave = async () => {
      if (!event || !userId) return;
  
      try {
          if (isParticipant) {
              await leaveEvent(event._id);
              console.log("❌ Leaving Event...");
          } else {
              await joinEvent(event._id);
              console.log("✅ Joining Event...");
          }
  
          // Update participants in state
          setEvent(prevEvent => {
              if (!prevEvent) return prevEvent;
  
              const updatedParticipants = isParticipant
                  ? prevEvent.participants.filter(p => p._id !== userId)  // Remove user when leaving
                  : [...prevEvent.participants, { _id: userId }];  // Add user when joining
  
              console.log("🔄 Updated Participants:", updatedParticipants);
  
              return { ...prevEvent, participants: updatedParticipants };
          });
  
          // Ensure `isParticipant` updates immediately
          setIsParticipant(!isParticipant);
          console.log("🚀 isParticipant Updated to:", !isParticipant);
  
      } catch (err) {
          console.error("❌ Error updating participation:", err);
      }
  };
  

    if (loading) return <p>Loading event...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="EventPage container">
            {userId && event ? (
                <>
                    {/* Event Card Component */}
                    <EventCard
                        event={event}
                        userId={userId}
                        onJoinLeave={handleJoinLeave}
                        onDelete={handleDelete}
                        isCreatedByUser={event.createdBy === userId || userRole === "admin"}
                    />

                    {/* Join/Leave button (directly in EventPage) */}
                    <button className="EventPage leave join buttons" onClick={handleJoinLeave}>
                           {isParticipant ? "❌ Leave Event" : "✅ Join Event"}
                    </button>


                    {/* Edit and Delete buttons (Only for Event Creator or Admin) */}
                    {event && (event.createdBy === userId || userRole === "admin") && (
                        <div className="EventPage Edit and Delete buttons">
                            <button onClick={handleUpdate}>Edit</button>
                            <button onClick={() => handleDelete()}>Delete</button>
                        </div>
                    )}

                    {/* Comments Component */}
                    {event && <Comments eventId={event._id} />}
                </>
            ) : (
                <p className="EventPage Event not found title">Event not found.</p>
            )}
        </div>
    );
};

export default EventPage;

import React, { useEffect, useState } from "react";
import { joinEvent, leaveEvent } from "../services/eventService";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Carousel from "../components/Carousel";


interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: { _id: string }[];
}

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        setUserId(decodedToken._id);
      } catch (error) {
        console.error("❌ Failed to decode token:", error);
      }
    } else {
      setUserId(null);
    }
  }, []);

  useEffect(() => {
    if (userId === null) return;

    const fetchEvents = async () => {
      try {
        console.log("📡 Fetching events...");
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
  }, [userId]);

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
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? {
                ...event,
                participants: isParticipant
                  ? event.participants.filter((p) => p._id !== userId)
                  : [...event.participants, { _id: userId }],
              }
            : event
        )
      );
    } catch (err) {
      console.error("❌ Error updating participation:", err);
    }
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (events.length === 0)
    return <p className="text-center">No events found.</p>;

  const visibleEvents = [
    events[index % events.length],
    events[(index + 1) % events.length],
    events[(index + 2) % events.length],
  ];


  return (
    <div className="container">
      <h1 className="text-2xl font-bold text-center mb-6">All Events</h1>
      <Carousel
        items={events}
        renderItem={(event) => (
          <div className="event-card w-1/3 bg-white shadow-md p-4 rounded-lg">
            <h3 className="event-title font-bold">{event.title}</h3>
            <p className="event-description">{event.description}</p>
            <p className="event-info">
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="event-info">
              <strong>Location:</strong> {event.location}
            </p>
            {userId && (
              <div className="mt-4">
                <button
                  onClick={() =>
                    handleJoinLeave(
                      event._id,
                      event.participants.some((p) => p._id === userId),
                      userId
                    )
                  }
                  className="join-leave-btn w-full p-2 rounded-md"
                >
                  {event.participants.some((p) => p._id === userId)
                    ? "Leave Event"
                    : "Join Event"}
                </button>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default HomePage;

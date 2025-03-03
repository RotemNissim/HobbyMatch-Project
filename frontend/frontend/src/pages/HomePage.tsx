import React, { useEffect, useState } from "react";
import { joinEvent, leaveEvent } from "../services/eventService";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: { _id: string }[]; // Updated to match backend response
}

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Retrieve user ID from JWT before fetching events
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        setUserId(decodedToken._id); // Adjust according to JWT structure
      } catch (error) {
        console.error("❌ Failed to decode token:", error);
      }
    } else {
      setUserId(null);
    }
  }, []);

  // Fetch events only after userId is set
  useEffect(() => {
    if (userId === null) return; // Don't fetch if userId is not set

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
  }, [userId]); // Re-fetch events when userId is available

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
                  : [
                      ...event.participants.map((p) => ({ _id: p._id })),
                      { _id: userId },
                    ],
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        All Events (Direct Fetch - No Proxy)
      </h1>
      {events.length === 0 ? (
        <p className="text-center">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white p-6 border rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-center mb-3">
                {event.title}
              </h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <p className="text-sm">
                <strong>Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <strong>Location:</strong> {event.location}
              </p>
              {userId && (
                <div className="mt-4">
                  <button
                    onClick={() =>
                      handleJoinLeave(
                        event._id,
                        event.participants.map((p) => p._id).includes(userId),
                        userId
                      )
                    }
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                  >
                    {event.participants.map((p) => p._id).includes(userId)
                      ? "Leave Event"
                      : "Join Event"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;

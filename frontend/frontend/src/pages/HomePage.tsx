import React, { useEffect, useState } from "react";
import { joinEvent, leaveEvent } from "../services/eventService";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Carousel from "../components/Carousel";
import EventCard from "../components/EventCard";
import "../styles/home.css";

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

  // חילוץ מזהה המשתמש מהטוקן
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

  // טעינת האירועים
  useEffect(() => {
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

  // טיפול בהצטרפות/עזיבה של אירוע
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
      
      // עדכון המצב המקומי
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

  // הצגת מצבי טעינה ושגיאה
  if (loading) return <div className="container text-center py-8">טוען אירועים...</div>;
  if (error) return <div className="container text-center py-8 text-red-500">{error}</div>;

  const visibleEvents = [
    events[index % events.length],
    events[(index + 1) % events.length],
    events[(index + 2) % events.length],
  ];


  return (
    <div className="container">
      <h1 className="text-2xl font-bold text-center mb-6">כל האירועים</h1>
      
      {/* קרוסלת האירועים */}
      <Carousel
        items={events}
        renderItem={(event) => (
          <EventCard
            event={event}
            userId={userId}
            onJoinLeave={handleJoinLeave}
          />
        )}
      />
    </div>
  );
};

export default HomePage;
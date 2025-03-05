<<<<<<< Updated upstream
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
=======
import React, { useEffect, useState } from "react";
import { joinEvent, leaveEvent } from "../services/eventService";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

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
  const [index, setIndex] = useState(0);

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

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const handleJoinLeave = async (eventId: string, isJoined: boolean, userId: string) => {
    try {
      if (isJoined) {
        await leaveEvent(eventId, userId);
      } else {
        await joinEvent(eventId, userId);
      }
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? {
                ...event,
                participants: isJoined
                  ? event.participants.filter((p) => p._id !== userId)
                  : [...event.participants, { _id: userId }],
              }
            : event
        )
      );
    } catch (error) {
      console.error("❌ Error updating event participation:", error);
    }
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (events.length === 0) return <p className="text-center">No events found.</p>;

  // מציג רק שלושה אירועים בכל פעם
  const visibleEvents = [
    events[index % events.length],
    events[(index + 1) % events.length],
    events[(index + 2) % events.length],
  ];

  return (
    <div className="container">
      <h1 className="text-2xl font-bold text-center mb-6">All Events</h1>
      <div className="carousel-container">
        <button onClick={prevSlide} className="nav-button left-nav">⬅️</button>
        <button onClick={nextSlide} className="nav-button right-nav">➡️</button>

        <div className="event-cards-container">
          <motion.div
            key={index} // גורם לרינדור מחדש במקום אנימציה שגויה
            className="event-cards flex"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {visibleEvents.map((event) => (
              <div key={event._id} className="event-card">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                <p className="event-info"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p className="event-info"><strong>Location:</strong> {event.location}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
>>>>>>> Stashed changes
};

export default HomePage;

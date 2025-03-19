import React, { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import EventSearchFilter from "../components/EventSearchFilter";
import { motion } from "framer-motion";
import "../styles/EventSearchPage.css";
import { useNavigate } from "react-router-dom";
import { listEvent } from "../services/eventService";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: { _id: string }[];
  createdBy: string;
  hobby: {_id:string}[];
  image?: string;
  likes: string[];
  comments?: string[];
}

const EventSearchPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await listEvent();
        setEvents(response);
        setFilteredEvents(response);
      } catch (err) {
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleFilterChange = async (filters: Record<string, string | string[]>) => {
    try {
      console.log("🔎 Sending Filters: ", filters); // Debugging
  
      const response = await listEvent(filters);
      setFilteredEvents(response);
    } catch (err) {
      console.error("❌ Error filtering events:", err);
    }
  };
  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="ESP error">{error}</p>;

  return (
    <div className="event-search-page container">
      <h1 className="ESV search titel">Search Events</h1>
      <EventSearchFilter onFilterChange={handleFilterChange} />
      <div className="ESV events grid container">
        {filteredEvents.map((event) => (
             <motion.div
             key={event._id}
             whileHover={{ scale: 1.05 }}
             onClick={() => handleEventClick(event._id)} // Handle click event
             className="clickable-event"
           >
            <EventCard event={event} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EventSearchPage;
import React from "react";
import { useNavigate } from "react-router-dom";
// import { IEvent } from "../types"
interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: { _id: string }[];
  createdBy?: string;
  hobby?: string[];
  image?: string;
  likes?: string[];
  comments?: string[];
}

interface EventCardProps {
  event: Event;
  userId?: string | null;
  onJoinLeave?: (eventId: string, isParticipant: boolean, userId: string) => void;
  onDelete?: (eventId: string) => void;
  isCreatedByUser?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  userId, 
  onJoinLeave, 
  onDelete,
  isCreatedByUser = false
}) => {
  // Date formatting
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Check if user is a participant
  const isParticipant = userId ? event.participants.some(p => p._id === userId) : false;

  return (
    <div className="event-card" id="content">
      <h3 className="event-title">{event.title}</h3>
      
      <p className="event-description">{event.description}</p>
      
      <div className="event-info div">
        <p className="event-date">
          <strong>📅 תאריך:</strong> {formatDate(event.date)}
        </p>
        <p className="event-location">
          <strong>📍 מיקום:</strong> {event.location}
        </p>
        
        <p className="event-participants">
          <strong>👥 משתתפים:</strong> {event.participants.length}
        </p>
      </div>
      
      {userId && onJoinLeave && (
        <button
          onClick={() => onJoinLeave(event._id, isParticipant, userId)}
          className={`join-leave-btn ${isParticipant ? 'bg-red-500 hover:bg-red-600' : ''}`}
        >
          {isParticipant ? "❌ Leane Event" : "✅ Join Event"}
        </button>
      )}

      {isCreatedByUser && onDelete && (
        <button
          onClick={() => onDelete(event._id)}
          className="delete event btn"
        >
          🗑️ Delete Event
        </button>
      )}
    </div>
  );
};

export default EventCard;
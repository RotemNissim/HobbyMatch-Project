import React from "react";

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
  // פונקציה עזר להצגת תאריך בפורמט קריא
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // בדוק אם המשתמש משתתף באירוע
  const isParticipant = userId ? event.participants.some(p => p._id === userId) : false;

  return (
    <div className="event-card">
      {/* כותרת האירוע */}
      <h3 className="event-title">{event.title}</h3>
      
      {/* תיאור האירוע */}
      <p className="event-description">{event.description}</p>
      
      {/* מידע על האירוע */}
      <div className="mt-auto">
        <p className="event-info">
          <strong>📅 תאריך:</strong> {formatDate(event.date)}
        </p>
        <p className="event-info">
          <strong>📍 מיקום:</strong> {event.location}
        </p>
        
        {/* מספר משתתפים */}
        <p className="event-info">
          <strong>👥 משתתפים:</strong> {event.participants.length}
        </p>
      </div>
      
      {/* כפתור הצטרפות/עזיבה (במסך הבית) */}
      {userId && onJoinLeave && (
        <button
          onClick={() => onJoinLeave(event._id, isParticipant, userId)}
          className={`join-leave-btn ${isParticipant ? 'bg-red-500 hover:bg-red-600' : ''}`}
        >
          {isParticipant ? "❌ עזוב אירוע" : "✅ הצטרף לאירוע"}
        </button>
      )}

      {/* כפתור מחיקה (באירועים שנוצרו ע"י המשתמש) */}
      {isCreatedByUser && onDelete && (
        <button
          onClick={() => onDelete(event._id)}
          className="delete-btn"
        >
          🗑️ מחק אירוע
        </button>
      )}
    </div>
  );
};

export default EventCard;
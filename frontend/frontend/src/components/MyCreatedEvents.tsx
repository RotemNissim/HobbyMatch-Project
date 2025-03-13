import { useEffect, useState } from "react";
import { getEventsCreatedByUser, deleteEvent } from "../services/eventService";
import { getCurrentUser } from "../services/userService";
import Carousel from "../components/Carousel";
import EventCard from "../components/EventCard";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: { _id: string }[];
}

const MyCreatedEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                // קבלת המשתמש הנוכחי
                const user = await getCurrentUser();
                // טעינת האירועים שנוצרו על ידו
                const userEvents = await getEventsCreatedByUser(user._id);
                setEvents(userEvents);
            } catch (error) {
                console.error("Error loading events:", error);
                setError("אירעה שגיאה בטעינת האירועים");
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    // טיפול במחיקת אירוע
    const handleDelete = async (eventId: string) => {
        if (confirm("האם אתה בטוח שברצונך למחוק אירוע זה?")) {
            try {
                await deleteEvent(eventId);
                // עדכון הרשימה המקומית
                setEvents(events.filter((e) => e._id !== eventId));
            } catch (error) {
                console.error("Error deleting event:", error);
                alert("אירעה שגיאה במחיקת האירוע");
            }
        }
    };

    // הצגת מצבי טעינה, שגיאות או אין אירועים
    if (loading) return <p className="text-center py-4">טוען אירועים...</p>;
    if (error) return <p className="text-center py-4 text-red-500">{error}</p>;
    if (events.length === 0) return <p className="text-center py-4">לא נמצאו אירועים שיצרת.</p>;

    return (
        <div className="my-created-events">
            <Carousel
                items={events}
                renderItem={(event) => (
                    <EventCard
                        event={event}
                        isCreatedByUser={true}
                        onDelete={handleDelete}
                    />
                )}
            />
        </div>
    );
};

export default MyCreatedEvents;
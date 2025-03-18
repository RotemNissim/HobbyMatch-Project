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
                const user = await getCurrentUser();
                const userEvents = await getEventsCreatedByUser(user._id);
                setEvents(userEvents);
            } catch (error) {
                console.error("Error loading events:", error);
                setError("Error loading events");
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    // טיפול במחיקת אירוע
    const handleDelete = async (eventId: string) => {
        if (confirm("Are you sure you want to delete this event?")) {
            try {
                await deleteEvent(eventId);
                setEvents(events.filter((e) => e._id !== eventId));
            } catch (error) {
                console.error("Error deleting event:", error);
                alert("Error deleting event");
            }
        }
    };

    if (loading) return <p className="loding event userP titel">Loding Events</p>;
    if (error) return <p className="error loding event userP">{error}</p>;
    if (events.length === 0) return <p className="No Events to show titel userP">No Events to show</p>;

    return (
        <div className="my-created-events">
            <Carousel
                items={events} renderItem={(event) => 
                    (<EventCard event={event} isCreatedByUser={true} onDelete={handleDelete}/>
                        
                    )}
            />
        </div>
    );
};

export default MyCreatedEvents;
import { useEffect, useState } from 'react';
import { getEventsCreatedByUser, deleteEvent, updateEvent } from '../services/eventService';
import { getCurrentUser } from '../services/userService';
import { motion } from 'framer-motion';

const MyCreatedEvents = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [userId, setUserId] = useState<string>('');
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState<"left" | "right">("right");

    useEffect(() => {
        const loadEvents = async () => {
            const user = await getCurrentUser();
            setUserId(user._id);

            const events = await getEventsCreatedByUser(user._id);
            setEvents(events);
        };

        loadEvents();
    }, []);

    const handleDelete = async (eventId: string) => {
        if (confirm('Are you sure you want to delete this event?')) {
            await deleteEvent(eventId);
            setEvents(events.filter(e => e._id !== eventId));
        }
    };

    const handleUpdate = async (eventId: string, updates: Partial<{ title: string; description: string; date: Date; location: string; hobbies: string[] }>) => {
        await updateEvent(eventId, updates);
        setEvents(prevEvents => prevEvents.map(e => e._id === eventId? {...e,...updates} : e));
    }

    const nextSlide = () => {
        setDirection("right");
        setIndex((prev) => (prev + 3) % events.length);
    };

    const prevSlide = () => {
        setDirection("left");
        setIndex((prev) => (prev - 3 + events.length) % events.length);
    };

    if (events.length === 0)
        return <p>No events found.</p>;

    const visibleEvents = [
        events[index % events.length],
        events[(index + 1) % events.length],
        events[(index + 2) % events.length],
    ];

    return (
        <div>
            <div className="carousel-container relative flex items-center justify-center overflow-hidden w-full">
                <button
                    onClick={prevSlide}
                    className="nav-button left-nav absolute left-0 z-10"
                >
                    ⬅️
                </button>
                <button
                    onClick={nextSlide}
                    className="nav-button right-nav absolute right-0 z-10"
                >
                    ➡️
                </button>

                <div className="event-cards-container w-full flex justify-center overflow-hidden">
                    <motion.div
                        key={index}
                        className="event-cards flex gap-4"
                        initial={{ x: direction === "right" ? 100 : -100, opacity: 0.8 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: direction === "right" ? -100 : 100, opacity: 0.8 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        {visibleEvents.map((event) => (
                            <motion.div
                                key={event._id}
                                className="event-card w-1/3 bg-white shadow-md p-4 rounded-lg"
                                whileHover={{ scale: 1.05 }}
                            >
                                <h3 className="event-title font-bold">{event.title}</h3>
                                <p className="event-description">{event.description}</p>
                                <p className="event-info">
                                    <strong>Date:</strong>{" "}
                                    {new Date(event.date).toLocaleDateString()}
                                </p>
                                <p className="event-info">
                                    <strong>Location:</strong> {event.location}
                                </p>
                                <button
                                    onClick={() => handleDelete(event._id)}
                                    className="delete-button"
                                >
                                    🗑️ Delete
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MyCreatedEvents;

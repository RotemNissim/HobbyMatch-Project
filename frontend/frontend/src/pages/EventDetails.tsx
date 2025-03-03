import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    image?: string;
    createdBy: string;
    participants: string[];
    comments: string[];
}

const EventPage: React.FC<{ eventId: string }> = ({ eventId }) => {
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>(''); // אתה יכול לשים כאן את ה־userId מה־JWT
    const [newComment, setNewComment] = useState<string>('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                console.log("📡 Fetching event from backend...");
                const response = await axios.get(`/events/${eventId}`);
                console.log("✅ Event fetched:", response.data);
                setEvent(response.data);
            } catch (err) {
                console.error("❌ Error fetching event:", err);
                setError('Failed to fetch event');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    const handleJoinLeave = async () => {
        if (!event) return;

        const action = event.participants.includes(userId) ? 'leave' : 'join';
        try {
            const response = await axios.post(`/events/${event._id}/${action}`);
            console.log(response.data);
            setEvent(prevEvent => ({
                ...prevEvent!,
                participants: action === 'join' ? [...prevEvent!.participants, userId] : prevEvent!.participants.filter(id => id !== userId),
            }));
        } catch (err) {
            console.error("❌ Error updating participation:", err);
        }
    };

    const handleAddComment = async () => {
        if (!newComment || !event) return;

        try {
            const response = await axios.post(`/events/${event._id}/comments`, { comment: newComment });
            setEvent(prevEvent => ({
                ...prevEvent!,
                comments: [...prevEvent!.comments, response.data.comment],
            }));
            setNewComment('');
        } catch (err) {
            console.error("❌ Error adding comment:", err);
        }
    };

    if (loading) return <p>Loading event...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>{event?.title}</h1>
            <img src={event?.image} alt="Event" style={{ maxWidth: '100%', marginBottom: '10px' }} />
            <p>{event?.description}</p>
            <p><strong>Date:</strong> {new Date(event!.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {event?.location}</p>

            {/* Join/Leave button */}
            <button onClick={handleJoinLeave}>
                {event?.participants.includes(userId) ? 'Leave Event' : 'Join Event'}
            </button>

            {/* Edit and Delete buttons */}
            {(event?.createdBy === userId || /* Check if user is admin */ true) && (
                <div>
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
            )}

            <div>
                <h3>Comments</h3>
                <ul>
                    {event?.comments.map((comment, index) => (
                        <li key={index}>{comment}</li>
                    ))}
                </ul>

                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                />
                <button onClick={handleAddComment}>Post Comment</button>
            </div>
        </div>
    );
};

export default EventPage;

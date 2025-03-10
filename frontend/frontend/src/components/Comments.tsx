import React, { useState, useEffect } from 'react';
import { getCommentsToEvent, addCommentToEvent } from '../services/eventService'; // ✅ Import the function

interface Comment {
    _id: string;
    content: string;
    sender: {
        _id: string;
        email: string;
    };
}

interface CommentsProps {
    eventId: string;
}

const Comments: React.FC<CommentsProps> = ({ eventId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ Fetch comments when component mounts
    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                const fetchedComments = await getCommentsToEvent(eventId);
                setComments(fetchedComments);
            } catch (err) {
                console.error("❌ Error fetching comments:", err);
                setError("Failed to load comments.");
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [eventId]);

    // ✅ Handle adding a comment
    const handleAddComment = async () => {
        if (!newComment) return;
    
        console.log("📩 Sending Comment to Event:", eventId, newComment);
    
        try {
            const response = await addCommentToEvent(eventId, { content: newComment });
    
            console.log("✅ API Response:", response); // 🔍 Debug Response
    
            if (response) {  // ✅ Fix: Use `response` directly
                setComments(prevComments => [...prevComments, response]); // ✅ Add response directly
                setNewComment('');
            } else {
                console.error("Unexpected API response:", response);
            }
        } catch (err) {
            console.error("❌ Error adding comment:", err);
        }
    };
    

    return (
        <div>
            <h3>Comments</h3>

            {loading ? (
                <p>Loading comments...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : comments.length > 0 ? (
                <ul>
                    {comments.map(comment => (
                        <li key={comment._id}>
                            <strong>{comment.sender.email}:</strong> {comment.content}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No comments yet.</p>
            )}

            {/* Add Comment Form */}
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
            />
            <button onClick={handleAddComment}>Post Comment</button>
        </div>
    );
};

export default Comments;

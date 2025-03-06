import React from "react";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: string[];
  createdBy: string;
  hobby: string[];
  image?: string;
  likes: string[];
  comments?: string[];
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="border rounded-lg shadow-lg p-4">
      {event.image && (
        <img src={event.image} alt={event.title} className="w-full h-40 object-cover rounded-md" />
      )}
      <h2 className="text-lg font-bold mt-2">{event.title}</h2>
      <p className="text-gray-600">📅 {new Date(event.date).toLocaleDateString()}</p>
      <p className="text-gray-600">📍 {event.location}</p>
      <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 w-full">
        View Details
      </button>
    </div>
  );
};

export default EventCard;

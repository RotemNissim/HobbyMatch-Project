import React, { useEffect, useState } from "react";
import {createEvent, updateEvent, deleteEvent, listEvents} from "../services/adminService";
import  Button from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import Input from "./ui/Input";
import { ChevronDown, ChevronUp, Trash2, Plus, Edit } from "lucide-react";

const AdminEventsList = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", description: "", location: "", date:"", createdBy:"", hobby: [] as string[]});
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    
  }, [events]);

  const fetchEvents = async () => {
    try {
      const eventsData = await listEvents();
      
      setEvents(eventsData || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  const handleAddEvent = async () => {
    try {
        await createEvent({
            title: newEvent.title,
            description: newEvent.description,
            location: newEvent.location,
            date: new Date(newEvent.date), // Convert string to Date object
            createdBy: newEvent.createdBy,
            hobby: newEvent.hobby, // Ensure this is a string array
          });
      setNewEvent({ title: "", description: "", location: "", date:"", createdBy:"", hobby: []});
      fetchEvents();
    } catch (error) {
      console.error("Error adding event", error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;
    try {
        await updateEvent(editingEvent._id, {
            ...editingEvent,
            date: new Date(editingEvent.date), // Convert string to Date object
          });
    } catch (error) {
      console.error("Error updating event", error);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <h2 className="text-xl font-semibold">Events List</h2>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </div>
      {expanded && (
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event._id} className="flex justify-between items-center p-2 border-b">
                <span>{event.title} - {event.location} ({event.date})</span>
                <div className="space-x-2">
                  <Button size="icon" variant="outline" onClick={() => setEditingEvent(event)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => handleDeleteEvent(event._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {editingEvent && (
              <div className="flex space-x-2">
                <Input placeholder="Title" value={editingEvent.title} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} />
                <Input placeholder="Description" value={editingEvent.description} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} />
                <Input placeholder="Location" value={editingEvent.location} onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })} />
                <Input placeholder="Date" type="date" value={editingEvent.date} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} />
                <Button onClick={handleUpdateEvent}>Update</Button>
              </div>
            )}
            <div className="flex space-x-2">
              <Input placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
              <Input placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
              <Input placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
              <Input placeholder="Date" type="date" value={(newEvent.date)} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
              <Button onClick={handleAddEvent}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AdminEventsList;

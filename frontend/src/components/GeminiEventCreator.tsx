import { useState } from "react";
import { recommendEvents } from "../services/eventService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const GeminiEventGenerator = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [generatedEvents, setGeneratedEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateEvents = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    try {
        
      const response = await recommendEvents(
        startDate.toISOString(),
        endDate.toISOString()   
      );
      setGeneratedEvents(response.recommendations);
    } catch (error) {
      console.error("Error generating events:", error);
      alert("Failed to generate events. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = (eventTitle: string) => {
    window.location.href = `/create-event?title=${encodeURIComponent(eventTitle)}`;
  };

  return (
    <div className="gemini-event-generator">
      <h3>Let GeminiAI Generate an Event for Me</h3>
      <div className="event-generator-form">
        <label>Start Date:</label>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />

        <label>End Date:</label>
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />

        <button onClick={handleGenerateEvents} disabled={loading}>
          {loading ? "Generating..." : "Let's Generate"}
        </button>
      </div>

      {generatedEvents.length > 0 && (
        <div>
          <h4>Generated Event Suggestions:</h4>
          <ul>
            {generatedEvents.map((event, index) => (
              <li key={index}>
                {event}
                <button onClick={() => handleCreateEvent(event)}>Create Event</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GeminiEventGenerator;

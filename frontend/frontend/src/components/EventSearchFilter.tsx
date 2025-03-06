import React, { useState } from "react";

interface FilterProps {
  onFilterChange: (filters: {
    name?: string;
    date?: string;
    location?: string;
    participants?: string;  // שינוי כאן ל-string
    hobbies?: string;
  }) => void;
}

const EventSearchFilter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    name: "",
    date: "",
    location: "",
    participants: "",
    hobbies: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    onFilterChange({
      ...filters,
      participants: filters.participants ? filters.participants.toString() : undefined, // המרה ל-string
    });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <input
        type="text"
        name="name"
        placeholder="Event name"
        className="border p-2 rounded"
        value={filters.name}
        onChange={handleChange}
      />
      <input
        type="date"
        name="date"
        className="border p-2 rounded"
        value={filters.date}
        onChange={handleChange}
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        className="border p-2 rounded"
        value={filters.location}
        onChange={handleChange}
      />
      <input
        type="number"
        name="participants"
        placeholder="Min Participants"
        className="border p-2 rounded"
        value={filters.participants}
        onChange={handleChange}
      />
      <input
        type="text"
        name="hobbies"
        placeholder="Hobbies"
        className="border p-2 rounded"
        value={filters.hobbies}
        onChange={handleChange}
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default EventSearchFilter;

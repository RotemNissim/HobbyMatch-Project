import React, { useState, useEffect } from "react";
import Select from "react-select";
import { listHobbies } from "../services/hobbyService";

interface FilterProps {
  onFilterChange: (filters: {
    name?: string;
    date?: string;
    location?: string;
    participants?: string;
    hobbies?: string[];
  }) => void;
}

const EventSearchFilter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    name: "",
    date: "",
    location: "",
    participants: "",
    hobbies: [] as string[],
  });

  const [hobbies, setHobbies] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    async function fetchHobbies() {
      try {
        const hobbyList = await listHobbies();
        setHobbies(hobbyList.map((hobby: any) => ({ value: hobby._id, label: hobby.name })));
      } catch (error) {
        console.error("Error fetching hobbies:", error);
      }
    }
    fetchHobbies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHobbyChange = (selectedOptions: any) => {
    setFilters((prev) => ({
      ...prev,
      hobbies: selectedOptions ? selectedOptions.map((option: any) => option.value) : [],
    }));
  };

  const handleSearch = () => {
    onFilterChange({
      ...filters,
      participants: filters.participants ? filters.participants.toString() : undefined,
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

      {/* MULTI-SELECTION DROPDOWN FOR HOBBIES */}
      <Select
        isMulti
        options={hobbies}
        placeholder="Select hobbies"
        className="border p-2 rounded"
        onChange={handleHobbyChange}
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default EventSearchFilter;

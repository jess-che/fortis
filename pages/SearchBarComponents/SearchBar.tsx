import "./SearchBar.css";
import React, { useState, FC } from "react";

type User = {
  id: number;
  name: string;
};

const SearchBar: React.FC = () => {
  const [input, setInput] = useState("");

  const saveSearchQueryToDatabase = async (query: string) => {
    const response = await fetch('/api/searchExcName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchQuery: query
      }),
    });
    
    if (!response.ok) {
        throw new Error('Failed to save query');
      }
    const data = await response.json();
    console.log(data);
  };

  const handleChange = (value: string) => {
    setInput(value);
    saveSearchQueryToDatabase(value);
  };

  return (
    <div className="input-wrapper">
      <input
        placeholder="Type to search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;

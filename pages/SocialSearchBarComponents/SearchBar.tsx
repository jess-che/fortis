import React, { useState } from "react";
import SearchResultsList from "./SearchResultsList";
import "./SearchBar.css";


const SearchBar = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);

  const populatelist = async (query: any) => {
    const response = await fetch('/api/searchUserName', {
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
    const dataName = data.data.rows.map((row: { name: any; }) => row.name);
    setResults(dataName);
    console.log(dataName)
  };

  const handleChange = (value: React.SetStateAction<string>) => {
    setInput(value);
    populatelist(value);
  };

  return (
    <div className="search-container">
      <div className="input-wrapper">
        <input
          placeholder="Type to search..."
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      {results && results.length > 0 && <SearchResultsList results={results} />}
    </div>
  );
};

export default SearchBar;


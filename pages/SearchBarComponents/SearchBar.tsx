import React, { useState } from "react";

import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

// Define a type for the user objects
type User = {
  id: number;
  name: string;
  // Add other properties as needed
};

// type SearchBarProps = {
//     setResults: React.Dispatch<React.SetStateAction<User[]>>;
//   };
  
export const SearchBar = () => {
  const [input, setInput] = useState("");

  const fetchData = (value: string) => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((user: User) => {
          return (
            value &&
            user &&
            user.name &&
            user.name.toLowerCase().includes(value)
          );
        });
        // setResults(results);
      });
  };

  const handleChange = (value: string) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Type to search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};


// type SearchBarProps = {
//     setResults: React.Dispatch<React.SetStateAction<User[]>>; // Assuming results is an array of User objects
//   };
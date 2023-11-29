import React, { useState, useEffect } from "react";
import SearchResultsList from "./SearchResultsList";
import "./SearchBar.css";
import { send } from "process";

interface SearchResultsListProps {
  sendDataToA: (data: any) => void;
}

const SearchBar: React.FC<SearchResultsListProps> = ({ sendDataToA }) => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);


  const populatelist = async (query: any) => {
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
    const dataName = data.data.rows.map((row: { name: any; }) => row.name);
    console.log(data);
    console.log(data.data.rows);
    setResults(data.data.rows);
    //setResults(dataName) -- For only Excercise name (changed to account for description etc.)
  };

  const handleChange = (value: React.SetStateAction<string>) => {
    setInput(value);
    populatelist(value);
  };

  useEffect(() => {
    handleChange(''); 
  }, []); 

  return (
    <div className="search-container">
      <div className="input-wrapper">
        <input
          placeholder="Type to search..."
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      {results && results.length > 0 && <SearchResultsList results={results}  sendDataToA={sendDataToA}/>}
    </div>
  );
};

export default SearchBar;



// import "./SearchBar.css";
// import React, { useState } from "react";
// import SearchResultsList from "./SearchResultsList";

// export const SearchBar = () => {
//   const [input, setInput] = useState("");
//   const [results, setResults] = useState([]);


//   const saveSearchQueryToDatabase = async (query: any) => {
//     const response = await fetch('/api/searchExcName', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         searchQuery: query
//       }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to save query');
//     }

//     const data = await response.json();
//     const dataName = data.data.rows.map((row: { name: any; }) => row.name);
//     setResults(dataName);;

//   };

//   const handleChange = (value: React.SetStateAction<string>) => {
//     setInput(value);
//     saveSearchQueryToDatabase(value);
//   };

//   return (
//     <div className="search-container">
//       <div className="input-wrapper">
//         <input
//           placeholder="Type to search..."
//           value={input}
//           onChange={(e) => handleChange(e.target.value)}
//         />
//       </div>
//       {results && results.length > 0 && <SearchResultsList results={results} />}
//     </div>
//   );
// };

// export default SearchBar;





// import "./SearchBar.css";
// import React, { useState, FC } from "react";
// import SearchResultsList from "./SearchResultsList";

// const [results, setResults] = useState([]);

// export const SearchBar = ({ results }) => {
//   const [input, setInput] = useState("");

//   const saveSearchQueryToDatabase = async (query: string) => {
//     const response = await fetch('/api/searchExcName', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         searchQuery: query
//       }),
//     });
    
//     if (!response.ok) {
//         throw new Error('Failed to save query');
//       }
//     const data = await response.json();
//     const dataName = data.data.rows.map((row: { name: any; }) => row.name);
//     results(dataName);
//     console.log(dataName);
//   };

//   const handleChange = (value: string) => {
//     setInput(value);
//     saveSearchQueryToDatabase(value);
//     SearchResultsList(results);
//   };

//   return (
//     <div className="input-wrapper">
//       <input
//         placeholder="Type to search..."
//         value={input}
//         onChange={(e) => handleChange(e.target.value)}
//       />
//     </div>
//   );
// };

// export default SearchBar;

import React, { useState, useEffect } from "react";
import SearchResultsList from "./SearchResultsList";
import "./SearchBar.css";
import { send } from "process";

interface SearchResultsListProps {
  sendDataToA: (data: any) => void;
  group: string;
  gym: string;
  key: number;
}

interface ExerciseData {
  description: string;
eid: number;
equipment: string;
favorite: boolean;
gym: string;
muscle_group: string;
name: string;
popularity: number;
type: string;
}

const SearchBar: React.FC<SearchResultsListProps> = ({ sendDataToA, group, gym, key }) => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);

  type StringToArrayMappingType = {
    [key: string]: string[];
};

  const workout_muscle_map: StringToArrayMappingType = {
    "any": ["Chest", "Shoulder", "Triceps", "Back", "Biceps", "Quadriceps", "Hamstrings", "Calves", "Abs", "Obliques", "Cardio"], 
    "push": ["Chest", "Shoulder", "Triceps"],
    "pull": ["Back", "Biceps"],
    "legs": ["Quadriceps", "Hamstrings", "Calves"],
    "core": ["Abs", "Back", "Obliques"],
    "cardio": ["Cardio"]
}


  const populatelist = async (query: any) => {
    if (gym === 'any') {
      const response = await fetch('/api/searchExcName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery: query, 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save query');
      }

      const data = await response.json();
      const category = workout_muscle_map[group];
      const filteredRows = data.data.rows.filter((row: ExerciseData) => {
        if (category.includes(row.muscle_group)) {
          return true; 
        }
        return false;
      });
      console.log("filtered", filteredRows);
      console.log(data.data.rows);
      setResults(filteredRows);
      //setResults(dataName) -- For only Excercise name (changed to account for description etc.)
    } else {
      const response = await fetch('/api/searchExcNameFiltered', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery: query,
          gym: gym
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save query');
      }

      const data = await response.json();
      const category = workout_muscle_map[group];
      const filteredRows = data.data.rows.filter((row: ExerciseData) => {
        if (category.includes(row.muscle_group)) {
          return true; 
        }
        return false;
      });
      console.log("filtered", filteredRows);
      console.log(data.data.rows);
      setResults(filteredRows);
      //setResults(dataName) -- For only Excercise name (changed to account for description etc.)
    }

    
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

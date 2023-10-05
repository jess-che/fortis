import React, { useState, FC } from "react";

type User = {
  id: number;
  name: string;
};

const SearchBar: React.FC = () => {
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
            user.name.toLowerCase().includes(value.toLowerCase())
          );
        });

        console.log(results);
      });
  };

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
    fetchData(value);
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



// import React, { useState, FC } from "react";

// // import { FaSearch } from "react-icons/fa";
// import "./SearchBar.css";

// // Define a type for the user objects
// type User = {
//   id: number;
//   name: string;
//   // Add other properties as needed
// };

// // type SearchBarProps = {
// //     setResults: React.Dispatch<React.SetStateAction<User[]>>;
// //   };
  
// const SearchBar: React.FC = () => {
//   const [input, setInput] = useState("");

//   const fetchData = (value: string) => {
//     fetch("https://jsonplaceholder.typicode.com/users")
//       .then((response) => response.json())
//       .then((json) => {
//         const results = json.filter((user: User) => {
//           return (
//             value &&
//             user &&
//             user.name &&
//             user.name.toLowerCase().includes(value)
//           );
//         });
//         // setResults(results);
//       });
//   };

//   const handleChange = (value: string) => {
//     setInput(value);
//     fetchData(value);
//   };

//   return (
//     <div className="input-wrapper">
//       {/* <FaSearch id="search-icon" /> */}
//       <input
//         placeholder="Type to search..."
//         value={input}
//         onChange={(e) => handleChange(e.target.value)}
//       />
//     </div>
//   );
// };

// export default SearchBar;


// // type SearchBarProps = {
// //     setResults: React.Dispatch<React.SetStateAction<User[]>>; // Assuming results is an array of User objects
// //   };
import React from "react";
import {FaSearch} from "react-icons/fa";

export const SearchBar = () => {
    return (<div className="input-wrapper">
        <FaSearch id="search-icon" />
        <input placeholder="Type to search..." style={{color: 'black'}} />
        </div>);
}









// import React, { useState } from 'react';

// const SearchBar = () => {
//   const [searchQuery, setSearchQuery] = useState('');

//   const handleInputChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search..."
//         value={searchQuery}
//         onChange={handleInputChange}
//       />
//       <button onClick={() => alert(`Searching for: ${searchQuery}`)}>
//         Search
//       </button>
//     </div>
//   );
// };

// export default SearchBar;

// SearchResultsList.tsx


// SearchResultsList.tsx
import React from "react";
import SharedResultsDiv from "./SharedResultsDiv";
import "./SearchResultsList.css";

interface Exercise {
  name: string;
  description?: string;
  muscle_groups?: string;
}

interface SearchResultsListProps {
  results: Exercise[];
}

const NameSearchResultsList: React.FC<{ results?: string[] }> = ({ results }) => {
    return (
      <div>
        {results && results.map((result, index) => (
          <p key={index}>{result}</p> // Display only the name
        ))}
      </div>
    );
  };
  
export default NameSearchResultsList;




// import React from "react";
// import SharedResultsDiv from "./SharedResultsDiv"; // Import the shared component
// import "./SearchResultsList.css";

// interface SearchResultsListProps {
//   results: string[];
// }

// const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
//   return (
//     <SharedResultsDiv>
//       {results && results.length > 0 ? (
//         <ul>
//           {results.map((name, index) => (
//             <li key={index}>{name}</li>
//           ))}
//         </ul>
//       ) : (
//        <></>
//       )}
//     </SharedResultsDiv>
//   );
// };

// export default SearchResultsList;

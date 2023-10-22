// SearchResultsList.tsx


// SearchResultsList.tsx
import React from "react";
import SharedResultsDiv from "./SharedResultsDiv";
import "./SearchResultsList.css";

interface Exercise {
  name: string;
  description?: string;
  muscle_group: string;
}

interface SearchResultsListProps {
  results: Exercise[];
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
  return (
    <SharedResultsDiv>
      {results && results.length > 0 ? (
        <ul className="results-list">
          {results.map((exercise, index) => (
            <li key={index}>
              <h2>{exercise.name}</h2>
              <p><strong>Muscle Groups:</strong> {exercise.muscle_group}</p>
              <p><strong>Description:</strong> {exercise.description || "Dummy Description"}</p>
            </li>
          ))}
        </ul>
      ) : (
       <></>
      )}
    </SharedResultsDiv>
  );
};

export default SearchResultsList;




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

import "./SearchResultsList.css";
import React from "react";

interface SearchResultsListProps {
  results: string[]; // Define the type of the dataName prop as an array of strings
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
  return (
    <div className="search-results">
      {results && results.length > 0 ? (
        <ul>
          {results.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SearchResultsList;

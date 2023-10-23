import React from "react";
// import SharedResultsDiv from "./SharedResultsDiv";
import "./History.css";

interface Exercise {
  name: string;
  description?: string;
  muscle_groups?: string;
}

interface HistoryResultsListProps {
  results: Exercise[];
}

const HistoryResultsList: React.FC<{ results?: string[] }> = ({ results }) => {
    return (
      <div>
        {results && results.map((result, index) => (
          <p key={index}>{result}</p> // Display only the name
        ))}
      </div>
    );
  };
  
export default HistoryResultsList;
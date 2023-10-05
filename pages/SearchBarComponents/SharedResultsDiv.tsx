// SharedResultsDiv.tsx
import React from "react";

interface SharedResultsDivProps {
  children: React.ReactNode; // Define the children prop
}

const SharedResultsDiv: React.FC<SharedResultsDivProps> = ({ children }) => {
  return <div className="search-results">{children}</div>;
};

export default SharedResultsDiv;

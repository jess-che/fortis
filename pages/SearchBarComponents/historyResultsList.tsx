import Image          from 'next/image';
import Link           from 'next/link';
import React, { FC }  from 'react';
import DefLayout      from '@/components/def_layout';
import "./history.css";

interface Exercise {
  name: string;
  description?: string;
  muscle_group: string;
}

interface HistoryListProps {
  results: Exercise[];
}

const HistoryResultsList: React.FC<HistoryListProps> = ({ results }) => {
  return (
    <DefLayout>
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
    </DefLayout>
  )
}

export default HistoryResultsList;

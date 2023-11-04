import React from 'react';
import './MuscleModel.css';

const MAX_SETS = 20; // Maximum number of sets for full color intensity

const MuscleModel = ({ muscleGroups }) => {
  if (!muscleGroups || muscleGroups.length === 0) {
    return <p>No muscle group data available.</p>;
  }

  const getColorForSets = (sets) => {
    const intensity = Math.min(sets / MAX_SETS, 1);
    const colorIntensity = Math.floor(255 * intensity);
    return `rgb(${colorIntensity}, 0, 0)`;
  };

  return (
    <div className="muscle-model-container">
      {muscleGroups.map((group, index) => (
        <div 
          key={index} 
          className="muscle-group-box" 
          style={{ backgroundColor: getColorForSets(group.sets) }}
        >
          <h3>{group.muscle_group}</h3>
          <p>Sets: {group.sets}</p>
        </div>
      ))}
    </div>
  );
};

export default MuscleModel;

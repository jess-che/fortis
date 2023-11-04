import React from 'react';
import './MuscleModel.css';

const MuscleModel = ({ muscleGroups }) => {
  if (!muscleGroups || muscleGroups.length === 0) {
    return <p>No muscle group data available.</p>;
  }

  return (
    <div className="muscle-model-container">
      {muscleGroups.map((group, index) => (
        <div key={index} className="muscle-group-box">
          <h3>{group.muscle_group}</h3>
          <p>Sets: {group.sets}</p>
        </div>
      ))}
    </div>
  );
};

export default MuscleModel;

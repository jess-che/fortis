import React from 'react';
import './MuscleModel.css';

const MuscleModel = ({ muscleGroups }) => {
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
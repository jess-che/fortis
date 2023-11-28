// ExerciseContext.js

import React, { createContext, useState, useContext } from 'react';

const ExerciseContext = createContext({
    selectedExercise: null, // Initial state
    setSelectedExercise: (exercise) => { } // Placeholder function
});

export const ExerciseProvider = ({ children }) => {
    const [selectedExercise, setSelectedExercise] = useState(null);

    return (
        <ExerciseContext.Provider value={{ selectedExercise, setSelectedExercise }}>
            {children}
        </ExerciseContext.Provider>
    );
};

export const useExerciseContext = () => useContext(ExerciseContext);

export default ExerciseContext;


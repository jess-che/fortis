// ExerciseContext.js

// import React, { createContext, useState, useContext } from 'react';

// const ExerciseContext = createContext({
//     selectedExercise: null, // Initial state
//     setSelectedExercise: (exercise) => { } // Placeholder function
// });

// export const ExerciseProvider = ({ children }) => {
//     const [selectedExercise, setSelectedExercise] = useState(null);

//     return (
//         <ExerciseContext.Provider value={{ selectedExercise, setSelectedExercise }}>
//             {children}
//         </ExerciseContext.Provider>
//     );
// };

// export const useExerciseContext = () => useContext(ExerciseContext);

// export default ExerciseContext;

import React, { createContext, useState, useContext } from 'react';

/**
 * @typedef {Object} ExerciseContextType
 * @property {{ name: string } | null} selectedExercise
 * @property {(exercise: { name: string } | null) => void} setSelectedExercise
 */

const ExerciseContext = createContext();

export const ExerciseProvider = ({ children }) => {
    const [selectedExercise, setSelectedExercise] = useState(null);

    return (
        <ExerciseContext.Provider value={{ selectedExercise, setSelectedExercise }}>
            {children}
        </ExerciseContext.Provider>
    );
};

export const useExerciseContext = () => {
    const context = useContext(ExerciseContext);
    if (!context) {
        throw new Error('useExerciseContext must be used within an ExerciseProvider');
    }
    return context;
};

export default ExerciseContext;

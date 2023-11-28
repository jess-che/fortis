// // ExerciseContext.tsx

// import React, { createContext, useState, useContext } from 'react';
// import { Exercise } from './ExerciseTypes';
// import { ExerciseContextType } from './ExerciseTypes'; // Adjust the path as needed


// /** @type {Context<{selectedExercise: Exercise | null, setSelectedExercise: Function}>} */
// export const ExerciseContext = createContext({
//     selectedExercise: null,
//     setSelectedExercise: () => { }
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

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Assuming you have defined 'Exercise' type in ExerciseTypes file
import { Exercise } from './ExerciseTypes';

// Define the shape of the context's value
interface ExerciseContextValue {
  selectedExercise: Exercise | null;
  setSelectedExercise: (exercise: Exercise | null) => void;
}

// Create the context with an initial value
export const ExerciseContext = createContext<ExerciseContextValue>({
  selectedExercise: null,
  setSelectedExercise: () => {},
});

// Define a provider component
export const ExerciseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  return (
    <ExerciseContext.Provider value={{ selectedExercise, setSelectedExercise }}>
      {children}
    </ExerciseContext.Provider>
  );
};

// Hook for easy access to the context
export const useExerciseContext = () => useContext(ExerciseContext);

export default ExerciseContext;


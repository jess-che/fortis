// ExerciseTypes.tsx

export interface Exercise {
  description: string;
  eid: number;
  equipment: string;
  favorite: boolean;
  muscle_group: string;
  name: string;
  popularity: number;
  type: string;
}


export interface ExerciseContextType {
  selectedExercise: Exercise | null;
  setSelectedExercise: (exercise: Exercise | null) => void;
}
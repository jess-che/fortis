// ExerciseTypes.tsx

interface Exercise {
  exerciseName: string;
  numberOfReps?: number;
  numberOfSets?: number;
  weight?: number;
  eid: number;
  aid: number;
  uid: string;
  time?: string;
  notes?: string;
}


export interface ExerciseContextType {
  selectedExercise: Exercise | null;
  setSelectedExercise: (exercise: Exercise | null) => void;
}
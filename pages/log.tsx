import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useState, ChangeEvent } from 'react';
import DefLayout from '@/components/def_layout';
import styles from './LogPage.module.css';

interface Exercise {
  exerciseName: string;
  numberOfReps: number;
  numberOfSets: number;
  weight: number;
}

const LogPage: FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    exerciseName: '',
    numberOfReps: 0,
    numberOfSets: 0,
    weight: 0
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentExercise({...currentExercise, [e.target.name]: e.target.value});
  }

  const handleAddExercise = () => {
    setExercises([...exercises, currentExercise]);
    setCurrentExercise({
      exerciseName: '',
      numberOfReps: 0,
      numberOfSets: 0,
      weight: 0
    });
  }

  return (
    <DefLayout>
      <div className={styles.container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Exercise Name</th>
              <th>Number of Reps</th>
              <th>Number of Sets</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise, index) => (
              <tr key={index}>
                <td>{exercise.exerciseName}</td>
                <td>{exercise.numberOfReps}</td>
                <td>{exercise.numberOfSets}</td>
                <td>{exercise.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <input className={styles.input} name="exerciseName" placeholder="Exercise Name" value={currentExercise.exerciseName} onChange={handleInputChange} />
        <input className={styles.input} type="number" name="numberOfReps" placeholder="Number of Reps" value={currentExercise.numberOfReps} onChange={handleInputChange} />
        <input className={styles.input} type="number" name="numberOfSets" placeholder="Number of Sets" value={currentExercise.numberOfSets} onChange={handleInputChange} />
        <input className={styles.input} type="number" name="weight" placeholder="Weight" value={currentExercise.weight} onChange={handleInputChange} />

        <button className={styles.button} onClick={handleAddExercise}>Add Exercise</button>
      </div>
    </DefLayout>
  )
}

export default LogPage;
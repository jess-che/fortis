import Image          from 'next/image';
import Link           from 'next/link';
import React, { FC, useState, useEffect, ChangeEvent } from 'react';
import DefLayout from '@/components/def_layout';
import styles from './LogPage.module.css';
import Select from 'react-select';


import SearchBar from "./SearchBarComponents/SearchBar";



interface Exercise {
  exerciseName: string;
  numberOfReps: number;
  numberOfSets: number;
  weight: number;
}

const LogPage: FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    exerciseName: '',
    numberOfReps: 0,
    numberOfSets: 0,
    weight: 0
  });
  const [exerciseOptions, setExerciseOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchExercises = async () => {
      const response = await fetch('/api/DefaultExcSort');
      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }
      const data = await response.json();
      const exerciseNames = data.data.rows.map((row: { name: any; }) => row.name);
      setExerciseOptions(exerciseNames);
    };

    fetchExercises();
  }, []);

  // Create a new handler for the Select component
const handleSelectChange = (selectedOption: { value: string, label: string } | null, actionMeta: any) => {
  if (actionMeta.action === 'select-option') {
    setCurrentExercise({...currentExercise, exerciseName: selectedOption ? selectedOption.value : ''});
  }
}

// Keep the original handleInputChange function for the input elements
const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
  setCurrentExercise({...currentExercise, [e.target.name]: e.target.value});
}

const handleSaveExercises = async () => {
  try {
    const response = await fetch('/api/saveExercises', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(exercises)
    });

    if (!response.ok) {
      throw new Error('Failed to save exercises');
    }

    const data = await response.json();
    console.log(data.message);
    alert('Exercises saved successfully!');
  } catch (err) {
    console.error(err);
    alert('Failed to save exercises');
  }
}

  const handleAddExercise = () => {
    if (currentExercise.exerciseName) {
      setExercises([...exercises, currentExercise]);
      setCurrentExercise({
        exerciseName: '',
        numberOfReps: 0,
        numberOfSets: 0,
        weight: 0
      });
    }
  }

  // search bar
  const searchBarStyle = {
    margin: 'auto',
    width: '90%',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    minWidth: '200px',
  };


  
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
              <tr>
              <td>
                <Select
                  className={styles.dropdown}
                  options={exerciseOptions.map(exercise => ({ value: exercise, label: exercise }))}
                  name='exerciseName'
                  value={exerciseOptions.find(option => option === currentExercise.exerciseName) ? { value: currentExercise.exerciseName, label: currentExercise.exerciseName } : null}
                  onChange={handleSelectChange}
                  isSearchable
                />
              </td>
              <td>
                <input className={styles.input} type="number" name="numberOfReps" placeholder="Number of Reps" value={currentExercise.numberOfReps} onChange={handleInputChange} />
              </td>
              <td>
                <input className={styles.input} type="number" name="numberOfSets" placeholder="Number of Sets" value={currentExercise.numberOfSets} onChange={handleInputChange} />
              </td>
              <td>
                <input className={styles.input} type="number" name="weight" placeholder="Weight" value={currentExercise.weight} onChange={handleInputChange} />
              </td>
            </tr>
          </tbody>
        </table>
  
        <button className={styles.button} onClick={handleAddExercise}>Add Exercise</button>
        <button className={styles.button} onClick={handleSaveExercises}>Save Exercises</button>  {/* Add this line */}
      </div>

      
  
      <aside className={styles.sidePanel}>
          <div className="search-bar-container" style={searchBarStyle}>
            <SearchBar />
          </div>

        {/* Rest of the side panel content... */}
      </aside>
    </DefLayout>
  )
}

export default LogPage;

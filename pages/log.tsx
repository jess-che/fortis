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
  eid: number;
  aid: number
}

const LogPage: FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseEids, setExerciseEids] = useState<number[]>([]);
  const [aid, setAid] = useState(null); 


  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    exerciseName: '',
    numberOfReps: 0,
    numberOfSets: 0,
    weight: 0,
    eid:0,
    aid: 0,
  });
  const [exerciseOptions, setExerciseOptions] = useState<string[]>([]);

  useEffect(() => {
    
    const fetchExercises = async () => {
      const response = await fetch('/api/LimitExcSort');
      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }
      const data = await response.json();
      const exerciseNames = data.data.rows.map((row: { name: any; }) => row.name);
  
      // Separate arrays for names and eids
      const exerciseNamesWithEid = [];
      const exerciseEids = [];
      for (const name of exerciseNames) {
        const eidResponse = await fetch('/api/getEID', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ searchQuery: name })
        });
  
        if (!eidResponse.ok) {
          throw new Error('Failed to fetch eid');
        }
  
        const eidData = await eidResponse.json();

        // Check if eidData, data, rows, and eid exist
        if (!eidData || !eidData.data || !eidData.data.rows || eidData.data.rows.length === 0 || !eidData.data.rows[0].eid) {
          console.log(eidData.data)
          console.error('Missing data for name:', name, 'eidData:', eidData);
          continue;  // Skip this iteration
        }

        exerciseNamesWithEid.push(name);
        exerciseEids.push(parseInt(eidData.data.rows[0].eid));
      }
  
      setExerciseOptions(exerciseNamesWithEid);
      setExerciseEids(exerciseEids);  // Set the eids
    };
  
    fetchExercises();
  }, []);

  // This useEffect loads the exercises from localStorage when this component first mounts
  useEffect(() => {
    const savedExercises = localStorage.getItem('exercises');
    if (savedExercises) {
      setExercises(JSON.parse(savedExercises));
    }
  }, []);  // This empty dependency array means this hook runs once when the component mounts

  // This useEffect saves the exercises to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('exercises', JSON.stringify(exercises));
  }, [exercises]);  // This dependency array means this hook runs whenever `exercises` changes

  // Create a new handler for the Select component
  const handleSelectChange = (selectedOption: { value: string, label: string } | null, actionMeta: any) => {
    if (actionMeta.action === 'select-option') {
      const selectedExerciseName = selectedOption ? selectedOption.value : '';
      // Find the eid that matches the selected exercise name
      const eidIndex = exerciseOptions.findIndex(name => name === selectedExerciseName);
      const selectedEid = eidIndex !== -1 ? exerciseEids[eidIndex] : 0;
      setCurrentExercise({ ...currentExercise, exerciseName: selectedExerciseName, eid: selectedEid });
    }
  }

// Keep the original handleInputChange function for the input elements
const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
  setCurrentExercise({...currentExercise, [e.target.name]: e.target.value});
}

const handleSaveExercises = async () => {
  try {
    console.log(exercises)
    const response = await fetch('/api/saveExercises', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(exercises)
    });
    console.log(response)

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

const fetchAid = async (query: any) => {
  const response = await fetch('/api/getAID', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // body: JSON.stringify({ eid })
    body: JSON.stringify({
      searchQuery: "b24e24f4-86b8-4b83-8947-b2472a43b436"
     }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch aid');
  }

  const data = await response.json();
  console.log(data.data.rows[0].Aid);
  return parseInt(data.data.rows[0].Aid);
};


const handleAddExercise = async () => {
  if (currentExercise.exerciseName && currentExercise.eid) {
    const aid = await fetchAid(currentExercise.eid);
    if (aid !== null) {
      setExercises([...exercises, { ...currentExercise, aid }]);
      setCurrentExercise({
        eid: 0,
        exerciseName: '',
        numberOfReps: 0,
        numberOfSets: 0,
        weight: 0,
        aid: 0,
      });
    }
  }
};

const handleRemoveExercise = (index: number) => {
  const newExercises = [...exercises];
  newExercises.splice(index, 1);
  setExercises(newExercises);
};

  // search bar
  const searchBarStyle = {
    margin: 'auto',
    width: '90%',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    minWidth: '200px',
  };

  const [editingIndex, setEditingIndex] = useState(-1);
  const handleEditExercise = (index: number) => {
    setEditingIndex(index);
    setEditingExercise(exercises[index]); 
  };

  const [editingExercise, setEditingExercise] = useState<Exercise>({
    exerciseName: '',
    numberOfReps: 0,
    numberOfSets: 0,
    weight: 0,
    eid: 0,
    aid: 0,
  });

  // Modify the handleUneditExercise function
const handleUneditExercise = (index: number) => {
  const newExercises = [...exercises];
  newExercises[index] = editingExercise;
  setExercises(newExercises);
  setEditingIndex(-1);
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
              <th>Action</th> 
            </tr>
          </thead>
          <tbody>
          {exercises.map((exercise, index) => (
    <tr key={index}>
      {editingIndex === index ? (
        <>
        <td><input type="text" value={editingExercise.exerciseName} onChange={(event) => setEditingExercise({ ...editingExercise, exerciseName: event.target.value })} /></td>
        <td><input type="number" value={editingExercise.numberOfReps} onChange={(event) => setEditingExercise({ ...editingExercise, numberOfReps: Number(event.target.value) })} /></td>
        <td><input type="number" value={editingExercise.numberOfSets} onChange={(event) => setEditingExercise({ ...editingExercise, numberOfSets: Number(event.target.value) })} /></td>
        <td><input type="number" value={editingExercise.weight} onChange={(event) => setEditingExercise({ ...editingExercise, weight: Number(event.target.value) })} /></td>
        <td>
          <button onClick={() => handleRemoveExercise(index)}> <img src="/images/remove.png" alt="Remove icon" width="24" height="30"/> </button>
          <button onClick={() => handleUneditExercise(index)}> <img src="/images/unedit.png" alt="Unedit icon" width="24" height="30"/> </button>
        </td>
      </>
      ) : (
        <>
          <td>{exercise.exerciseName}</td>
          <td>{exercise.numberOfReps}</td>
          <td>{exercise.numberOfSets}</td>
          <td>{exercise.weight}</td>
          <td>
            <button onClick={() => handleRemoveExercise(index)}> <img src="/images/remove.png" alt="Remove icon" width="24" height="30"/> </button>
            <button onClick={() => handleEditExercise(index)}> <img src="/images/edit1.png" alt="Edit icon" width="24" height="30"/> </button>
          </td>
        </>
      )}
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
                  loadingMessage={() => 'Loading...'}
                  noOptionsMessage={() => 'No options found.'}
                />
                <button className={styles.button} onClick={toggleSidePanel} id={styles["sidepanel-toggle-button"]}>All exercises</button>

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
  
        <button className={styles.button} id={styles["add-exercise-button"]} onClick={handleAddExercise}>Add Exercise</button>
        <button className={styles.button} id={styles["save-exercise-button"]} onClick={handleSaveExercises}>Finish Workout</button> 
      </div>

      {isSidePanelOpen && (
        <aside className={styles.sidePanel}>
          <div className="search-bar-container" style={searchBarStyle}>
            <SearchBar />
          </div>
        </aside>
      )}
    </DefLayout>
  )
}

export default LogPage;

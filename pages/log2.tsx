import Image from 'next/image';
import Link from 'next/link';
import DefLayout from '@/components/def_layout';
import styles from './LogPage.module.css';
import Select from 'react-select';
import SearchBar from "./SearchBarComponents/SearchBar";
import { useUser } from '@auth0/nextjs-auth0/client';
import { setCookie, getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import React, { FC, useState, useEffect, ChangeEvent } from 'react'

// exercise type
interface Exercise {
  exerciseName: string;
  numberOfReps: number;
  numberOfSets: number;
  weight: number;
  eid: number;
  aid: number;
  uid: string;
}

const Log2Page: React.FC<{ isLogging: boolean }> = ({ isLogging }) => {
  // ---- start of use state declarations + other declarations ----
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseEids, setExerciseEids] = useState<number[]>([]);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  // is show all exercises open
  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  // use state for exercise
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    exerciseName: '',
    numberOfReps: 0,
    numberOfSets: 0,
    weight: 0,
    eid: 0,
    aid: 0,
    uid: '',
  });
  // use state for exercise options
  const [exerciseOptions, setExerciseOptions] = useState<string[]>([]);
  // ---- end of use state declarations + other declarations ----

  // ---- start of api/cookie to change between log or not log ----
  // adds new activity to uid in cookie
  const addActivity = async () => {
    setCookie('log', 'true');       // sets cookie to show that user is logging workout

    try {
      const response = await fetch('/api/addActivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: getCookie('uid'),
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      // Handle the response here
    } catch (error) {
      console.error('Failed to add activity:', error);
      // Handle errors here
    }
    window.location.reload();
  };

  // signals that user is done logging workout
  const toggleLogging = () => {
    // Toggle the value of 'log' cookie
    setCookie('log', isLogging ? 'false' : 'true');

    // also want to clear local storage
    setExercises([]);

    // Cause the component to re-render
    window.location.reload();
  };
  // ---- end of api/cookie to change between log or not log ----

  // ---- start of code to display exercises in the drop down menu ---- 
  useEffect(() => {
    // this is all for getting exercises and displaying
    // not related to saveExercises at all    
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
  // ---- end of code to display exercises in the drop down menu ---- 

  // ---- start of code for user input ----
  // Create a new handler for the Select component (chosing exercise from drop down menu)
  const handleSelectChange = (selectedOption: { value: string, label: string } | null, actionMeta: any) => {
    if (actionMeta.action === 'select-option') {
      const selectedExerciseName = selectedOption ? selectedOption.value : '';

      // Find the eid that matches the selected exercise name
      const eidIndex = exerciseOptions.findIndex(name => name === selectedExerciseName);
      const selectedEid = eidIndex !== -1 ? exerciseEids[eidIndex] : 0;
      setCurrentExercise({ ...currentExercise, exerciseName: selectedExerciseName, eid: selectedEid });
    }
  }

  // Keep the original handleInputChange function for the input elements (inputting in sep/rep/weght)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentExercise({ ...currentExercise, [e.target.name]: e.target.value });
  }
  // ---- end of code for user input ----

  // ---- start of storing to database ----
  // get the aid from database (largest aid from uid)
  const fetchAid = async (query: any) => {
    const response = await fetch('/api/getAID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchQuery: getCookie('uid'),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch aid');
    }

    const data = await response.json();
    return parseInt(data.data.rows[0].Aid);
  };

  // save the exercises to uid, aid
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
      console.log('Response body:', await response.text());

      if (!response.ok) {
        throw new Error('Failed to save exercises');
      }

      // const data = await response.json();
      // console.log(data.message);
      alert('Exercises saved successfully!');
    } catch (err) {
      console.error(err);
      // alert('Failed to save exercises');
    }
  }
  // ---- end of storing to database ----

  // ---- start of local storage for data persistance ---- 
  // This useEffect loads the exercises from localStorage when this component first mounts
  // this is only caching and data persistence, not related to actual functionality 
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

  // THIS IS ONLY FOR MODIFYING EXERCISES TO THE LOCAL STORAGE, NOT CONNECTED TO DATABASE YET
  const handleAddExercise = async () => {
    if (currentExercise.exerciseName && currentExercise.eid) {
      const aid = await fetchAid(currentExercise.eid);
      const uid = '' + getCookie('uid');

      if (aid !== null) {
        setExercises([...exercises, { ...currentExercise, aid, uid }]);
        setCurrentExercise({
          eid: 0,
          exerciseName: '',
          numberOfReps: 0,
          numberOfSets: 0,
          weight: 0,
          aid: 0,
          uid: uid,
        });
      }
    }
  };

  // Locally remove one exercise from set
  const handleRemoveExercise = (index: number) => {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
  };

  // Modify the handleUneditExercise function
  const handleUneditExercise = (index: number) => {
    const newExercises = [...exercises];
    newExercises[index] = editingExercise;
    setExercises(newExercises);
    setEditingIndex(-1);
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
    uid: '',
  });
  // ---- end of local storage for data persistance ----


  // ---- start of styling ----
  const searchBarStyle = {
    margin: 'auto',
    width: '90%',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    minWidth: '200px',
  };

  const customSelect = {
    control: (styles: any) => ({ ...styles, backgroundColor: 'rgba(255, 255, 255, 0.05)' }),
    option: (provided: any, state: any) => ({
      ...provided,
      color: state.isSelected ? 'white' : 'black', // Text color for options
      backgroundColor: state.isSelected ? 'blue' : 'rgba(255, 255, 255, 0.75)' // Background color for options
    }),
    singleValue: (provided: any, state: any) => ({
      ...provided,
      color: 'white' 
    }),
    dropdownIndicator: (base: any, state: any) => ({
      ...base,
      transition: 'all .2s ease',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
    }),
  };
  // ---- end of styling ----

  return (
    <DefLayout>
      <div className="flex w-screen min-h-[90vh] justify-center items-center">
        {/* if the user is in the middle of a log (or priorly was logging) */}
        {isLogging ? (
          <>
            <div className="flex flex-col overflow-hidden">
              <button onClick={toggleLogging}>
                Cancel Log
              </button>

              <table className="mx-auto my-8 max-w-lg border border-white border-opacity-50">
                <thead>
                  <tr>
                    <th className="border border-white border-opacity-50 px-5 py-2 min-w-[20vw] text-center align-middle">Exercise Name</th>
                    <th className="border border-white border-opacity-50 px-5 py-2 min-w-[6vw] text-center align-middle ">Reps</th>
                    <th className="border border-white border-opacity-50 px-5 py-2 min-w-[6vw] text-center align-middle">Sets</th>
                    <th className="border border-white border-opacity-50 px-5 py-2 min-w-[6vw] text-center align-middle">Weight</th>
                    <th className="border border-white border-opacity-50 px-5 py-2 min-w-[6vw] text-center align-middle">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {exercises.map((exercise, index) => (
                    <tr key={index}>
                      {editingIndex === index ? (
                        <>
                          {/* 
                          I don't think this does anything
                          <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle"><input type="text" value={editingExercise.exerciseName} onChange={(event) => setEditingExercise({ ...editingExercise, exerciseName: event.target.value })} className="w-full text-center"/></td>
                          <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle"><input type="number" value={editingExercise.numberOfReps} onChange={(event) => setEditingExercise({ ...editingExercise, numberOfReps: Number(event.target.value) })} className="w-full text-center"/></td>
                          <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle"><input type="number" value={editingExercise.numberOfSets} onChange={(event) => setEditingExercise({ ...editingExercise, numberOfSets: Number(event.target.value) })} className="w-full text-center"/></td>
                          <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle"><input type="number" value={editingExercise.weight} onChange={(event) => setEditingExercise({ ...editingExercise, weight: Number(event.target.value) })} className="w-full text-center"/></td>
                          <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                            <button onClick={() => handleRemoveExercise(index)}> <img src="/images/remove.png" alt="Remove icon" width="24" height="30" /> </button>
                            <button onClick={() => handleUneditExercise(index)}> <img src="/images/unedit.png" alt="Unedit icon" width="24" height="30" /> </button>
                          </td> 
                          */}
                        </>
                      ) : (
                        <>
                          <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle text-md">{exercise.exerciseName}</td>
                          <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle text-md">{exercise.numberOfReps}</td>
                          <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle text-md">{exercise.numberOfSets}</td>
                          <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle text-md">{exercise.weight}</td>
                          <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle text-md">
                            <button className="px-1" onClick={() => handleRemoveExercise(index)}> <img src="/images/remove.png" alt="Remove icon" width="24" height="30" /> </button>
                            <button className="px-1"  onClick={() => handleEditExercise(index)}> <img src="/images/edit1.png" alt="Edit icon" width="24" height="30" /> </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  <tr>
                    <td className="min-w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                      <Select
                        styles={customSelect}
                        className="w-full rounded-md text-black"
                        options={exerciseOptions.map(exercise => ({ value: exercise, label: exercise }))}
                        name='exerciseName'
                        value={exerciseOptions.find(option => option === currentExercise.exerciseName) ? { value: currentExercise.exerciseName, label: currentExercise.exerciseName } : null}
                        onChange={handleSelectChange}
                        isSearchable
                        loadingMessage={() => 'Loading...'}
                        noOptionsMessage={() => 'No options found.'}
                      />
                    </td>
                    <td className="min-w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                      <input className="text-white text-md text-center text-opacity-75" type="number" name="numberOfReps" placeholder="Number of Reps" value={currentExercise.numberOfReps} onChange={handleInputChange} />
                    </td>
                    <td className="min-w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                      <input className="text-white text-md text-center text-opacity-75" type="number" name="numberOfSets" placeholder="Number of Sets" value={currentExercise.numberOfSets} onChange={handleInputChange} />
                    </td>
                    <td className="minw-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                      <input className="text-white text-md text-center text-opacity-75" type="number" name="weight" placeholder="Weight" value={currentExercise.weight} onChange={handleInputChange} />
                    </td>
                    <td className="minw-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                    <button className={styles.button} id={styles["add-exercise-button"]} onClick={handleAddExercise}>Add Exercise</button>
                    </td>
                  </tr>
                </tbody>
              </table>

              
              <button className={styles.button} onClick={toggleSidePanel} id={styles["sidepanel-toggle-button"]}>All exercises</button>
              <button className={styles.button} id={styles["save-exercise-button"]} onClick={handleSaveExercises}>Finish Workout</button>
            </div>
            <div>
              {isSidePanelOpen && (
                <aside className={styles.sidePanel}>
                  <div className="search-bar-container" style={searchBarStyle}>
                    <SearchBar />
                  </div>
                </aside>
              )}
            </div>
          </>
        ) : (
          <button onClick={addActivity}>
            Add Activity
          </button>
        )}
      </div>
    </DefLayout >
  );
}

// Makes sure serverside matches client
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Check the 'log' cookie on the server-side
  const isLogging = getCookie('log', context) === 'true';

  // Pass the value to the component as a prop
  return {
    props: {
      isLogging,
    },
  };
};

export default Log2Page;

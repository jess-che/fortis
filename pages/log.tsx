import Image from 'next/image';
import Link from 'next/link';
import DefLayout from '@/components/def_layout';
import Select from 'react-select';
import SearchBar from "./SearchBarComponents/SearchBar";
import { useUser } from '@auth0/nextjs-auth0/client';
import { setCookie, getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import React, { FC, useState, useEffect, ChangeEvent } from 'react';
import '@/public/styles/log.css';     // style sheet for animations
import { useRouter } from 'next/router';


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

  const router = useRouter(); // use for redirecting to different pages

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

  // State for the name title and whether the edit mode is enabled
  const [title, setTitle] = useState('No Name');
  const [isEditing, setIsEditing] = useState(false);
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

  // delete newest activity of uid in cookie
  const deleteActivity = async () => {
    try {
      const response = await fetch('/api/deleteActivity', {
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
  };

  // update end time and duration
  const endAndDuration = async () => {
    try {
      const response = await fetch('/api/endAndDuration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: getCookie('uid'),
          name: title,
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      // Handle the response here
    } catch (error) {
      console.error('Failed to add activity:', error);
      // Handle errors here
    }
  };


  // signals that user is no longer logging workout
  const toggleLogging = () => {
    // Toggle the value of 'log' cookie
    setCookie('log', isLogging ? 'false' : 'true');

    // also want to clear local storage
    setExercises([]);

    // also delete the most recent activity
    deleteActivity();

    // Cause the component to re-render
    window.location.reload();
  };

  // signals that user is done logging workout
  const handleSave = async () => {
    // Toggle the value of 'log' cookie
    setCookie('log', isLogging ? 'false' : 'true');

    // also want to clear local storage
    setExercises([]);

    // update end time and duration
    await endAndDuration();

    // also delete the most recent activity
    await handleSaveExercises();

    // redirect to new page to edit things
    router.push('/logfinish');
  };
  // ---- end of api/cookie to change between log or not log ----

  // ---- start of code to display exercises in the drop down menu ---- 
  // Handles the change of the input field
  const handleChange = (event: any) => {
    setTitle(event.target.value);
  };

  // Toggles the edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Toggle editing off when enter key hit
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      setIsEditing(!isEditing);
    }
  };

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
    const newValue = parseInt(e.target.value, 10);
    if (newValue < 0) {
      e.target.value = '0';
    }

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
    menu: (styles: any) => ({ ...styles, backgroundColor: 'rgba(18, 18, 18, 0.6)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)', }),
    option: (provided: any, state: any) => ({
      ...provided,
      color: state.isSelected ? 'white' : 'white', // Text color for options
      backgroundColor: state.isSelected ? 'rgba(85, 187, 164, .75)' : 'rgba(255, 255, 255, 0)', // Background color for options
      ':active': {
        backgroundColor: state.isSelected
          ? 'rgba(255, 255, 255, 0)'
          : 'rgba(85, 187, 164, .5)',
      },
    }),
    singleValue: (provided: any, state: any) => ({
      ...provided,
      color: 'white'
    }),
    dropdownIndicator: (base: any, state: any) => ({
      ...base,
      color: 'white',
      opacity: .75,
      transition: 'all .2s ease',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
      ':hover': {
        color: 'white', // Color on hover
        opacity: 0.6, // Adjust transparency on hover
      },
    }),
  };
  // ---- end of styling ----

  return (
    <DefLayout>
      <div className="flex w-screen min-h-[90vh] justify-center items-center">
        {/* if the user is in the middle of a log (or priorly was logging) */}
        {isLogging ? (
          <>
            <div className="w-screen flex flex-row items-center justify-center">
              <div className="flex flex-col overflow-hidden items-center">
                <div>
                  {isEditing ? (
                    // Render an input field if edit mode is active
                    <input
                      type="text"
                      className="font-bold text-3xl text-center text-white text-opacity-80"
                      value={title}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      autoFocus
                    />
                  ) : (
                    // Render the title text if not in edit mode
                    <div onClick={toggleEdit} className="font-bold text-3xl text-center flex flex-row">{title}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 ml-2 opacity-70">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>

                    </div>
                  )}
                </div>
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
                              <div className="button-hover relative group">
                                <span className="absolute hidden group-hover:block bg-black text-white text-sm py-1 px-2 rounded-lg z-10 -translate-y-2 translate-x-[-50%] left-1/2 bottom-full">
                                  Delete
                                </span>
                                <button className="px-1" onClick={() => handleRemoveExercise(index)}> <img src="/images/remove.png" alt="Remove icon" width="24" height="30" /> </button>
                              </div>
                              <div className="button-hover relative group">
                                <span className="absolute hidden group-hover:block bg-black text-white text-sm py-1 px-2 rounded-lg z-10 -translate-y-2 translate-x-[-50%] left-1/2 bottom-full">
                                  Edit
                                </span>
                                <button className="px-1" onClick={() => handleEditExercise(index)}> <img src="/images/edit1.png" alt="Edit icon" width="24" height="30" /> </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    <tr>
                      <td className="flex flex-row min-w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle items-center">
                        <Select
                          styles={customSelect}
                          className="w-[15vw] rounded-md text-black"
                          options={exerciseOptions.map(exercise => ({ value: exercise, label: exercise }))}
                          name='exerciseName'
                          value={exerciseOptions.find(option => option === currentExercise.exerciseName) ? { value: currentExercise.exerciseName, label: currentExercise.exerciseName } : null}
                          onChange={handleSelectChange}
                          isSearchable
                          loadingMessage={() => 'Loading...'}
                          noOptionsMessage={() => 'No options found.'}
                        />
                        <button className="ml-3 button-hover relative group" onClick={toggleSidePanel}>
                          <span className="absolute hidden group-hover:block bg-black text-white text-sm py-1 px-2 rounded-lg z-10 -translate-y-2 translate-x-[-50%] left-1/2 bottom-full">
                            Show All
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </td>
                      <td className="min-w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                        <input className="text-white text-md text-center text-opacity-75" type="number" name="numberOfReps" placeholder="Number of Reps" value={currentExercise.numberOfReps} onChange={handleInputChange} min="0" />
                      </td>
                      <td className="min-w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                        <input className="text-white text-md text-center text-opacity-75" type="number" name="numberOfSets" placeholder="Number of Sets" value={currentExercise.numberOfSets} onChange={handleInputChange} min="0" />
                      </td>
                      <td className="minw-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                        <input className="text-white text-md text-center text-opacity-75" type="number" name="weight" placeholder="Weight" value={currentExercise.weight} onChange={handleInputChange} min="0" />
                      </td>
                      <td className="minw-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                        <button className="button-hover relative group" onClick={handleAddExercise}>
                          <span className="absolute hidden group-hover:block bg-black text-white text-sm py-1 px-2 rounded-lg z-10 -translate-y-2 translate-x-[-50%] left-1/2 bottom-full">
                            Add Exercise
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div>
                  <button onClick={toggleLogging}>
                    <p className="pl-2 pr-3 border-r text-white text-opacity-75 text-lg hover:gradient-text-bp duration-300 text-center">CANCEL</p>
                  </button>
                  <button onClick={handleSave}>
                    <p className="pl-3 text-white text-opacity-75 text-lg hover:gradient-text-pg duration-300 text-center">FINISH</p>
                  </button>
                </div>
              </div>
              <div>
                {isSidePanelOpen && (
                  <aside className="w-[25vw] pl-[5vw] ml-[5vw] border-l border-white border-opacity-50">
                    <div className="search-bar-container" style={searchBarStyle}>
                      <SearchBar />
                    </div>
                  </aside>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-row w-screen min-h-[90vh] justify-center items-center">
            {/* this side is add Activity button, but also make it cooler */}
            <div className="flex flex-col w-[60vw] justify-center items-center">
              <div className="relative">
                <button onClick={addActivity} className="startActivity rounded-md px-2 text-xl font-bold inset-0 text-center transition hover:bg-transparent border-2 border-[#55BBA4]">
                  Add Activity
                </button>
              </div>
            </div>

            <div className="h-[80vh] w-[2px] mx-[1vw] bg-white bg-opacity-50"></div>

            {/* this side show most popular templates */}
            <div className="flex flex-col w-[30vw] bg-red-400">

            </div>
          </div>
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

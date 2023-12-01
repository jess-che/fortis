import Image from 'next/image';
import Link from 'next/link';
import DefLayout from '@/components/def_layout';
import Select from 'react-select';
import SearchBar from "./SearchBarComponents/SearchBar";
import { useUser } from '@auth0/nextjs-auth0/client';
import { setCookie, getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import React, { FC, useState, useEffect, ChangeEvent, useContext } from 'react';
import '@/public/styles/log.css';     // style sheet for animations
import '@/public/styles/history.css';     // style sheet for animations
import { useRouter } from 'next/router';
// import ExerciseContext, { useExerciseContext, ExerciseProvider } from './ExerciseContext';

// exercise type
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
  type?: string;
}
type DataType = {
  workouts: any[];
};

interface ButtonStyles {
  textOpacity: number;
  isClicked: boolean;
}

type GymState = {
  [key: string]: ButtonStyles;
};

const Log2Page: React.FC<{ isLogging: boolean }> = ({ isLogging }) => {
  // ---- start of use state declarations + other declarations ----
  // const { selectedExercise } = useExerciseContext();
  // const { selectedExercise } = useContext(ExerciseContext);
  const [loading, setLoading] = useState(true);       // if data is being fetched for sidebar
  const [activityData, setActivityData] = useState<any[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [searchGym, setSearchGym] = useState('any');
  const [searchBarKey, setSearchBarKey] = useState(0);
  const [buttonStyles, setButtonStyles] = useState<{ [key: string]: ButtonStyles }>({
    any: {
      textOpacity: 100,
      isClicked: false,
    },
    wilson: {
      textOpacity: 50,
      isClicked: false,
    },
    brodie: {
      textOpacity: 50,
      isClicked: false,
    },
  });

  // store current activity
  const [specificAid, setSpecificAid] = useState<number | null>(null); // specificAid of clicked workout   

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseEids, setExerciseEids] = useState<number[]>([]);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  const [dataFromSearch, setDataFromSearch] = useState('');

  const router = useRouter(); // use for redirecting to different pages

  // is show all exercises open
  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const receiveDataFromSearch = (data: any) => {
    setDataFromSearch(data);
    setCurrentExercise({ ...currentExercise, exerciseName: data.name, eid: data.eid });
  };

  const ExcDatafromEID = async (query: any) => {
    try {
      const response = await fetch('/api/ExcDatafromEID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery: query
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch exercise data');
      }
      const data = await response.json();
      // console.log("Exercise Data:", data); // Log to inspect the structure
      return data.data.rows[0];
    } catch (error) {
      console.error('Error fetching exercise data:', error);
      return null;
    }
  };

  const handleGymSwitch = (gym: string) => {
    setSearchGym(gym);
    setSearchBarKey((prevKey) => prevKey + 1); // Change the key to force a re-render

    
    // Initialize textOpacity and isClicked for all gyms that are not selected
    const updatedButtonStyles: GymState = Object.keys(buttonStyles).reduce((styles: GymState, gymKey) => {
      styles[gymKey] = {
        textOpacity: gymKey === gym.toLowerCase() ? (buttonStyles[gymKey].isClicked ? 50 : 100) : 50,
        isClicked: gymKey === gym.toLowerCase() ? !buttonStyles[gymKey].isClicked : false,
      };
      return styles;
    }, {}); 

    // Update button styles
    setButtonStyles(updatedButtonStyles);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // set loading to true while data is being fetched

      try {
        const activityResponse = await fetch('/api/templateActivitiesLog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: getCookie('uid')
          }),
        });

        if (!activityResponse.ok) {
          throw new Error('Failed to fetch activity data');
        }

        const activityData = await activityResponse.json();

        const mapActivities = await Promise.all(activityData.data.rows.map(async (activity: any) => {
          const workoutResponse = await fetch('/api/HistoryWorkouts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uid: getCookie('uid'),
              aid: activity.Aid, // Use the activity's Aid here
            }),
          });

          if (!workoutResponse.ok) {
            throw new Error('Failed to retrieve history workouts');
          }

          const workoutData = await workoutResponse.json();

          const workoutsWithExerciseData = await Promise.all(workoutData.data.rows.map(async (workout: any) => {
            const exerciseData = await ExcDatafromEID(workout.Eid);

            return {
              ...workout,
              exerciseData: exerciseData,
            };
          }));

          return {
            ...activity,
            workouts: workoutsWithExerciseData,
          };
        }));

        console.log(mapActivities); // This will contain both activity and workout data
        console.log(mapActivities[0].workouts);

        setActivityData(mapActivities);
        setLoading(false); // set loading to false now that data is fetched

      } catch (error) {
        console.error('Error in getting activity history:', error);
      }
    };

    fetchData();
    console.log("data", data);
  }, []);

  // use state for exercise
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    exerciseName: '',
    numberOfReps: 0,
    numberOfSets: 0,
    weight: 0,
    eid: 0,
    aid: 0,
    uid: '',
    time: '',
    notes: '',
    type: '',
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

  const addActivity2 = async () => {

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
          // console.log(eidData.data)
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

      console.log(selectedOption);

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

  const handleTypeChange = () => {
    const new_type = currentExercise.type === 'timenotes' ? 'weight' : 'timenotes';
    setCurrentExercise({ ...currentExercise, type: new_type });
  }
  // ---- end of code for user input ----

  // ---- start of storing to database ----
  // get the aid from database (largest aid from uid)
  const fetchAid = async () => {
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
    let transfAID: string | null = data.data.rows[0].Aid.toString();
    if (transfAID != null)
      localStorage.setItem('aidTransfer', transfAID);
    return parseInt(data.data.rows[0].Aid);
  };

  function kilogramsToPounds(kilograms:any) {
    return Math.round(kilograms / 0.453592);
  }  

  // save the exercises to uid, aid
  const handleSaveExercises = async () => {
    const modifiedExercises = exercises.map((exercise) => {
      const isMetric = getCookie('units') === 'Metric';
    
      // Convert the weight property if necessary
      const convertedWeight = isMetric ? kilogramsToPounds(exercise.weight) : exercise.weight;
    
      // Return the modified Exercise object
      return {
        ...exercise,
        weight: convertedWeight,
      };
    });

    try {
      console.log(modifiedExercises);
      const response = await fetch('/api/saveExercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(modifiedExercises)
      });
      // console.log(response)
      // console.log('Response body:', await response.text());

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
      const aid = await fetchAid();
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
          time: '',
          notes: '',
          type: '',
        });
      }
    }
  };

  function poundsToKilograms(pounds: any) {
    return Math.round(pounds * 0.453592);
  }

  const handleSaveClick = async (workoutData: any[]) => {
    if (getCookie('log') === 'false') {
      await addActivity2();
    }
    // console.log(workoutData);
    const templateAid = await fetchAid();

    const exerciseArray: Exercise[] = workoutData.map((item) => {
      const isMetric = getCookie('units') === 'Metric';
      const convertedWeight = isMetric ? poundsToKilograms(item.Weight) : item.Weight;

      return {
        exerciseName: item.exerciseData.name,
        numberOfReps: item.Rep,
        numberOfSets: item.Set,
        weight: convertedWeight,
        eid: item.Eid,
        aid: templateAid,
        uid: item.Uid,
      };
    });

    // console.log("exercise array", exerciseArray);
    // Retrieve existing data from localStorage or initialize it as an empty array
    const existingDataString = localStorage.getItem('exercises');
    const existingData: Exercise[] = existingDataString
      ? JSON.parse(existingDataString)
      : [];

    // Append the new data to the existing data
    const combinedData = [...existingData, ...exerciseArray];

    // Save the combined data back to localStorage
    localStorage.setItem('exercises', JSON.stringify(combinedData));

    setCookie('log', 'true');       // sets cookie to show that user is logging workout
    window.location.reload();
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
    input: (styles: any) => ({ ...styles, color: 'white' }),
    menu: (styles: any) => ({ ...styles, backgroundColor: 'rgba(18, 18, 18, 0.6)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)', zIndex: 9999, maxHeight: '150px', }),
    menuList: (base: any) => ({
      ...base,
      maxHeight: '150px', // Set the maximum height to 5vh
      overflowY: 'auto', // Enable vertical scrolling if content exceeds maxHeight
    }),
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
              <div className="flex flex-col items-center">
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
                      {currentExercise.type === 'timenotes' ? (
                        <>
                          <th className="border border-white border-opacity-50 px-5 py-2 min-w-[6vw] text-center align-middle ">Time</th>
                          <th className="border border-white border-opacity-50 px-5 py-2 min-w-[6vw] text-center align-middle">Notes</th>
                        </>
                      ) : (
                        <>
                          <th className="border border-white border-opacity-50 px-5 py-2 min-w-[6vw] text-center align-middle">Reps</th>
                          <th className="border border-white border-opacity-50 px-5 py-2 min-w-[6vw] text-center align-middle">Sets</th>
                          <th className="border border-white border-opacity-50 px-5 py-2 min-w-[6vw] text-center align-middle">Weight</th>
                        </>
                      )}
                      <th className="border border-white border-opacity-50 px-5 py-2 min-w-[6vw] text-center align-middle">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercises.map((exercise, index) => (
                      <tr key={index}>
                        {editingIndex === index ? (
                          <>
                            {/* This ensures Edit and Delete work as intended. */}
                            <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                              <input
                                type="text"
                                value={editingExercise.exerciseName}
                                onChange={(event) => setEditingExercise({ ...editingExercise, exerciseName: event.target.value })}
                                className="w-full text-center text-white"
                              />
                            </td>
                            {currentExercise.type === 'timenotes' ? (
                              <>
                                <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                                  <input
                                    type="text" // Change type to text for "Time"
                                    value={editingExercise.time} // Use a new property like "time" instead of "numberOfReps"
                                    onChange={(event) => setEditingExercise({ ...editingExercise, time: event.target.value })}
                                    className="w-full text-center text-white"
                                  />
                                </td>
                                <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                                  <input
                                    type="text" // Use "text" type for "Notes"
                                    value={editingExercise.notes} // Use "notes" for Notes
                                    onChange={(event) => setEditingExercise({ ...editingExercise, notes: event.target.value })}
                                    className="w-full text-center text-white"
                                  />
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                                  <input
                                    type="number"
                                    value={editingExercise.numberOfReps}
                                    onChange={(event) => setEditingExercise({ ...editingExercise, numberOfReps: Number(event.target.value) })}
                                    className="w-full text-center text-white"
                                  />
                                </td>
                                <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                                  <input
                                    type="number"
                                    value={editingExercise.numberOfSets}
                                    onChange={(event) => setEditingExercise({ ...editingExercise, numberOfSets: Number(event.target.value) })}
                                    className="w-full text-center text-white"
                                  />
                                </td>
                                <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                                  <input
                                    type="number"
                                    value={editingExercise.weight}
                                    onChange={(event) => setEditingExercise({ ...editingExercise, weight: Number(event.target.value) })}
                                    className="w-full text-center text-white"
                                  />
                                </td>
                              </>
                            )}
                            <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                              <button onClick={() => handleRemoveExercise(index)}>
                                <img src="/images/remove.png" alt="Remove icon" width="24" height="30" />
                              </button>
                              <button onClick={() => handleUneditExercise(index)}>
                                <img src="/images/unedit.png" alt="Unedit icon" width="24" height="30" />
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle text-md">{exercise.exerciseName}</td>
                            {currentExercise.type === 'timenotes' ? (
                              <>
                                <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle text-md">{exercise.time}</td>
                                <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle text-md">{exercise.notes}</td>
                              </>
                            ) : (
                              <>
                                <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle text-md">{exercise.numberOfReps}</td>
                                <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle text-md">{exercise.numberOfSets}</td>
                                <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle text-md">{exercise.weight}</td>
                              </>
                            )}
                            <td className="w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle text-md">
                              <div className="button-hover relative group">
                                <span className="absolute hidden group-hover:block bg-black text-white text-sm py-1 px-2 rounded-lg z-10 -translate-y-2 translate-x-[-50%] left-1/2 bottom-full">
                                  Delete
                                </span>
                                <button className="px-1" onClick={() => handleRemoveExercise(index)}>
                                  <img src="/images/remove.png" alt="Remove icon" width="24" height="30" />
                                </button>
                              </div>
                              <div className="button-hover relative group">
                                <span className="absolute hidden group-hover:block bg-black text-white text-sm py-1 px-2 rounded-lg z-10 -translate-y-2 translate-x-[-50%] left-1/2 bottom-full">
                                  Edit
                                </span>
                                <button className="px-1" onClick={() => handleEditExercise(index)}>
                                  <img src="/images/edit1.png" alt="Edit icon" width="24" height="30" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    <tr>
                      <td className="min-w-full h-full px-5 py-2 text-center align-middle">
                        <div className="flex flex-row items-center justify-center">
                          <Select
                            styles={customSelect}
                            className="w-[15vw] rounded-md text-black"
                            options={exerciseOptions.map(exercise => ({ value: exercise, label: exercise }))}
                            name='exerciseName'
                            value={{ value: currentExercise.exerciseName, label: currentExercise.exerciseName }}
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
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      {currentExercise.type === 'timenotes' ? (
                        <>
                          <td className="min-w-[10vw] border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                            <input
                              className="text-white text-sm text-center text-opacity-75"
                              type="text"
                              name="time"
                              placeholder="Time"
                              value={currentExercise.time}
                              onChange={handleInputChange}
                            />
                          </td>
                          <td className="min-w-[20vw] border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                            <input
                              className="text-white text-sm text-center text-opacity-75"
                              type="text"
                              name="notes"
                              placeholder="Notes"
                              value={currentExercise.notes}
                              onChange={handleInputChange}
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="min-w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                            <input
                              className="text-white text-md text-center text-opacity-75"
                              type="number"
                              name="numberOfReps"
                              placeholder="Number of Reps"
                              value={currentExercise.numberOfReps}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </td>
                          <td className="min-w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                            <input
                              className="text-white text-md text-center text-opacity-75"
                              type="number"
                              name="numberOfSets"
                              placeholder="Number of Sets"
                              value={currentExercise.numberOfSets}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </td>
                          <td className="min-w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                            <input
                              className="text-white text-md text-center text-opacity-75"
                              type="number"
                              name="weight"
                              placeholder="Weight"
                              value={currentExercise.weight}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </td>
                        </>
                      )}
                      <td className="min-w-full border border-white border-opacity-50 px-5 py-2 text-center align-middle">
                        <button className="button-hover relative group" onClick={handleAddExercise}>
                          <span className="absolute hidden group-hover:block bg-black text-white text-sm py-1 px-2 rounded-lg z-10 -translate-y-2 translate-x-[-50%] left-1/2 bottom-full">
                            Add Exercise
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button className="button-hover relative group" onClick={handleTypeChange}>
                          {currentExercise.type === 'timenotes' ? (
                            <>
                              <span className="absolute min-w-[8vw] hidden group-hover:block bg-black text-white text-sm py-1 px-2 rounded-lg z-10 -translate-y-2 translate-x-[-50%] left-1/2 bottom-full">
                                Log Reps, Sets, Weight
                              </span>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
                              </svg>
                            </>
                          ) : (
                            <>
                              <span className="absolute min-w-[8vw] hidden group-hover:block bg-black text-white text-sm py-1 px-2 rounded-lg z-10 -translate-y-2 translate-x-[-50%] left-1/2 bottom-full">
                                Log Time and Notes
                              </span>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
                              </svg>
                            </>
                          )}
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
                    <div className="flex flex-row justify-between mb-4">
                      <button
                        onClick={() => handleGymSwitch('any')}
                        className={`text-white text-xl hover:gradient-text-bp duration-300 font-bold text-center ${
                          searchGym === 'any' ? 'gradient-text-bp' : ''
                        }`}
                        style={{ opacity: buttonStyles.any.textOpacity / 100 }}
                      >
                        <p>ALL</p>
                      </button>
                      <button
                        onClick={() => handleGymSwitch('Wilson')}
                        className={`text-white text-xl hover:gradient-text-pg duration-300 font-bold text-center ${
                          searchGym === 'Wilson' ? 'gradient-text-pg' : ''
                        }`}
                        style={{ opacity: buttonStyles.wilson.textOpacity / 100 }}
                      >
                        <p>WILSON</p>
                      </button>
                      <button
                        onClick={() => handleGymSwitch('Brodie')}
                        className={`text-white text-xl hover:gradient-text-gb duration-300 font-bold text-center ${
                          searchGym === 'Brodie' ? 'gradient-text-pg' : ''
                        }`}
                        style={{ opacity: buttonStyles.brodie.textOpacity / 100 }}
                      >
                        <p>BRODIE</p>
                      </button>
                    </div>
                    <div className="search-bar-container w-[20vw]" style={searchBarStyle}>
                      <SearchBar sendDataToA={receiveDataFromSearch} gym={searchGym} key={searchBarKey} />
                    </div>
                  </aside>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-row w-screen min-h-[90vh] justify-center items-center">
            {/* this side is add Activity button, but also make it cooler */}
            <div className="flex flex-col h-[85vh] w-[60vw] justify-center items-center">
              <div className="container grid grid-cols-3 gap-0">
                <div className="flex flex-col column justify-center items-center h-[75vh]">
                  <h2 className="mb-4 text-[5vw] font-bold displayheader gradient-text-bp">New</h2>
                  <div className="text-sm mx-2 text-center">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt eligendi possimus iure maiores tempora. Nesciunt alias repellat soluta minima ad vel explicabo nemo non autem mollitia? Iste, illo? Corporis, asperiores.</div>
                  <div className="relative mt-8">
                    <button onClick={addActivity} className="startActivity rounded-md px-2 text-xl font-bold inset-0 text-center transition hover:bg-transparent border-2 border-[#55BBA4]">
                      Add Activity
                    </button>
                  </div>
                </div>
                <div className="flex flex-col column justify-center items-center h-[75vh]">
                  <h2 className="mb-4 text-[5vw] font-bold displayheader gradient-text-pg">Discover</h2>
                  <div className="text-sm mx-2 text-center">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt eligendi possimus iure maiores tempora. Nesciunt alias repellat soluta minima ad vel explicabo nemo non autem mollitia? Iste, illo? Corporis, asperiores.</div>
                  <div className="relative mt-8">
                    <Link href="/discover" className="discover rounded-md px-2 text-xl font-bold inset-0 text-center transition hover:bg-transparent border-2 border-[#2FABDD]">
                      Discover
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col column justify-center items-center h-[75vh]">
                  <h2 className="mb-4 text-[5vw] font-bold displayheader gradient-text-gb">History</h2>
                  <div className="text-sm mx-2 text-center">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt eligendi possimus iure maiores tempora. Nesciunt alias repellat soluta minima ad vel explicabo nemo non autem mollitia? Iste, illo? Corporis, asperiores.</div>
                  <div className="relative mt-8">
                    <Link href="/history" className="history rounded-md px-2 text-xl font-bold inset-0 text-center transition hover:bg-transparent border-2 border-[#C32E67]">
                      History
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[80vh] w-[2px] mx-[1vw] bg-white bg-opacity-50"></div>

            {/* this side show most recent templates */}
            <div className="flex flex-col w-[30vw]">

              <div className="flex flex-col h-[85vh] min-w-[25vw] max-w-[27vw] items-center justify-center">
                <h2 className="mb-4 text-[5vw] font-bold displayheader gradient-text-bp">Quick Add</h2>

                <ul className="overflow-y-auto mb-3 min-w-[19vw]">
                  {/* waiting for query */}
                  <style jsx>{`
                    .ellipsis::after {
                      content: ".";
                      animation: ellipsisAnimation 2s infinite;
                    }
                  `}</style>
                  {loading &&
                    <div className="flex flex-col items-center opacity-60">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[6vw] h-[6vw] rotate-svg">
                        <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clip-rule="evenodd" />
                      </svg>
                      <div className="text-xl ellipsis">Loading</div>
                    </div>
                  }
                  {/* no data */}
                  {!loading && activityData.length === 0 &&
                    <div className="flex flex-col items-center opacity-60">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" className="w-[6vw] h-[6vw]">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
                      </svg>
                      <div className="text-xl">No Data</div>
                    </div>
                  }
                  {/* load data */}
                  {!loading && activityData.length > 0 && activityData.map((activity: any, i: number) => (
                    <li key={i} className="min-w-[25vw] max-w-[27vw] activity-item relative list-none mx-3 p-2 rounded-xl border-t border-b border-white border-opacity-60">
                      <div className="flex flex-col relative z-10">
                        <div className="flex flex-row justify-between p-2">
                          <div className="text-xl">{activity.Activity_name}</div>
                          <button
                            onClick={() => {
                              handleSaveClick(activityData[i].workouts);
                            }}
                            className="inline-flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Check if data exists and has no workouts */}
                      {activityData[i].workouts !== null && activityData[i].workouts.length === 0 && (
                        <div>
                          <div className="w-[20vw] h-[1px] m-[1vw] bg-white bg-opacity-50"></div>
                          <div className="text-md text-center opacity-60">No Exercise Data</div>
                        </div>
                      )}

                      {/* Check if data exists and has workouts */}
                      {activityData[i].workouts !== null && activityData[i].workouts.length > 0 && (
                        <div className="w-[20vw] h-[1px] m-[1vw] bg-white bg-opacity-50"></div>
                      )}

                      {/* Map over data and render exercises */}
                      {activityData[i].workouts !== null && activityData[i].workouts.map((workout: any, index: number) => (
                        <li key={index} className="">
                          <div className="text-md text-center">{workout.exerciseData.name}</div>
                        </li>
                      ))}
                    </li>
                  ))}

                </ul>

              </div>

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

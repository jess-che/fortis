import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useState } from 'react';
import DefLayout from '@/components/def_layout';
import './StreakGraphs.css'; 
import StreakGraph from './StreakGraph'; // Adjust the path as needed



const ProfilePage: React.FC = () => {
  // Define state variables to store user information
  interface DataPoint {
    date: string;
    duration: number;
  }
  
  // Declare the type of the state variable as an array of DataPoint objects
  const [parsedData, setParsedData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false); // new state for loading indicator
  const [workoutTime, setWorkoutTime] = useState('');



  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(175); // in centimeters
  const [weight, setWeight] = useState(70); // in kilograms
  const [gender, setGender] = useState('Male');
  const [units, setUnits] = useState('Imperial');
  const [privacy, setPrivacy] = useState("Public");
  
  // Define state variables to track edit mode
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAge, setIsEditingAge] = useState(false);
  const [isEditingHeight, setIsEditingHeight] = useState(false);
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [isEditingGender, setIsEditingGender] = useState(false);
  const [isEditingUnits, setIsEditingUnits] = useState(false);
  const [isEditingPrivacy, setIsEditingPrivacy] = useState(false);

  // Function to save changes and exit edit mode when Enter is pressed
  const handleSaveOnEnter = (event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the Enter key from adding new lines in text fields
      event.currentTarget.blur(); // Remove focus from the input field
      // Trigger the save action based on the field being edited
      if (isEditingName) {
        setIsEditingName(false);
        // Save name changes here
      } else if (isEditingAge) {
        setIsEditingAge(false);
        // Save age changes here
      } else if (isEditingHeight) {
        setIsEditingHeight(false);
        // Save height changes here
      } else if (isEditingWeight) {
        setIsEditingWeight(false);
        // Save weight changes here
      } else if (isEditingGender) {
        setIsEditingGender(false);
        // Save gender changes here
      } else if (isEditingUnits) {
        setIsEditingUnits(false);
        // Save units changes here
      } else if (isEditingPrivacy) {
        setIsEditingPrivacy(false);
        // Save privacy changes here
      }
    }
  };

  const time = async (query: any) => {
    try {
      const res = await fetch('api/TotalTime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery: "b24e24f4-86b8-4b83-8947-b2472a43b436",
        }),
      });
  
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const data = await res.json();
      const totalMinutes = Math.round(parseFloat(data.data.rows[0].total_workout_minutes));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
  
      const formattedTime = `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
      console.log(formattedTime);
      setWorkoutTime(formattedTime);
      return formattedTime; // This line returns the formatted time, which can be used elsewhere
    } catch (error) {
      console.error('Error in time:', error);
      return ''; // Return an empty string or some default value in case of an error
    }
  };  

  const Bob = async (query: any) => {
    try {
      const res = await fetch('api/Bob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery: "b24e24f4-86b8-4b83-8947-b2472a43b436",
        }),
      });
  
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const data = await res.json();
      const muscleGroups = data.data.rows.map((row: { muscle_group: any; total_sets: string; }) => ({
        muscle_group: row.muscle_group,
        sets: parseInt(row.total_sets)
      }));
  
      console.log(muscleGroups);
    } catch (error) {
      console.error('Error in Bob:', error);
    }
  };

   // The AnalStreaks function to fetch and process data
   const AnalStreaks = async (query: any) => {
    setIsLoading(true); // Set loading to true before fetching data
    try {
      const response = await fetch('api/AnalStreaks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery: "b24e24f4-86b8-4b83-8947-b2472a43b436",
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responseData = await response.json();

      if (responseData.data && Array.isArray(responseData.data.rows)) {
        // This will hold dates as keys and durations as values
        const durationByDate: Record<string, number> = {};

        responseData.data.rows.forEach((row: any) => {
          const date = new Date(row.Date).toLocaleDateString("en-US");
          const duration = (row.Duration.hours || 0) * 60 + (row.Duration.minutes || 0);
          durationByDate[date] = (durationByDate[date] || 0) + duration;
        });

        // Convert the durationByDate object into an array of DataPoint objects
        const newParsedData: DataPoint[] = Object.entries(durationByDate).map(([date, duration]): DataPoint => ({
          date,
          duration
        }));

        setParsedData(newParsedData); // Update state with the new parsed data
      } else {
        console.error('Unexpected data structure:', responseData);
      }
    } catch (error) {
      console.error('Error in AnalStreaks:', error);
    }
    setIsLoading(false); // Set loading to false after fetching data
  };

  
  const handleAnalStreaksButtonClick = async () => {
    //if (user && user.email) {
      try {
        await time({email: "lalanmao@gmail.com"});
        console.log('time Done')
      } catch (error) {
        console.error('Error calling time:', error);
      }

      try {
        await Bob({email: "lalanmao@gmail.com"});
        console.log('Bobby Done')
      } catch (error) {
        console.error('Error calling Bob:', error);
      }

      try {
        await AnalStreaks({ email: "lalanmao10@gmail.com" });
        console.log('AnalStreaks called successfully');
      } catch (error) {
        console.error('Error calling AnalStreaks:', error);
      }

    //} else {
    //  console.error('User email is not available.');
    //}
  };

  return (
    <DefLayout>
    <div className="let me cook">
      <button onClick={handleAnalStreaksButtonClick}>Get Streaks</button>
      {!isLoading && parsedData.length > 0 ? (
          <StreakGraph parsedData={parsedData} />
        ) : (
          isLoading ? <p>Loading...</p> : <p>No data to display</p>
        )}    
    </div>
    <div className="workout-time-display">
        <h2>Weekly Workout Summary</h2>
        <p>Workout Time This Week: <span className="workout-time">{workoutTime}</span></p>
    </div>

    <style jsx>{`
      .workout-time {
          font-weight: bold;
          font-size: 1.2em;
          color: #007bff; /* Or any color that suits your design */
      }
    `}</style>

    <div className="container">
        <div className="profile-container">
            <h1>Profile</h1>

            <div className="profile-info">
            <div>
                <strong>Name:</strong> {isEditingName ? (
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleSaveOnEnter} onBlur={() => setIsEditingName(false)}/>
                ) : (
                name
                )} 
                {isEditingName ? (
                <button className="edit-button" onClick={() => setIsEditingName(false)}>Save</button>
                ) : (
                <button className="edit-button" onClick={() => setIsEditingName(true)}>Edit</button>
                )}
            </div>
            <p><strong>Email:</strong> {email}</p>
            <div>
                <strong>Age:</strong> {isEditingAge ? (
                <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} onKeyDown={handleSaveOnEnter} onBlur={() => setIsEditingAge(false)}/>
                ) : (
                age
                )} 
                {isEditingAge ? (
                <button className="edit-button" onClick={() => setIsEditingAge(false)}>Save</button>
                ) : (
                <button className="edit-button" onClick={() => setIsEditingAge(true)}>Edit</button>
                )}
            </div>
            <div>
                <strong>Height:</strong> {isEditingHeight ? (
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} onKeyDown={handleSaveOnEnter} onBlur={() => setIsEditingHeight(false)} />
                ) : (
                height
                )} cm
                {isEditingHeight ? (
                <button className="edit-button" onClick={() => setIsEditingHeight(false)}>Save</button>
                ) : (
                <button className="edit-button" onClick={() => setIsEditingHeight(true)}>Edit</button>
                )}
            </div>
            <div>
                <strong>Weight:</strong> {isEditingWeight ? (
                <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} onKeyDown={handleSaveOnEnter} onBlur={() => setIsEditingWeight(false)}/>
                ) : (
                weight
                )} kg
                {isEditingWeight ? (
                <button className="edit-button" onClick={() => setIsEditingWeight(false)}>Save</button>
                ) : (
                <button className="edit-button" onClick={() => setIsEditingWeight(true)}>Edit</button>
                )}
            </div>
            <div>
                <strong>Gender:</strong> {isEditingGender ? (
                <select value={gender} onChange={(e) => setGender(e.target.value)} onKeyDown={handleSaveOnEnter} onBlur={() => setIsEditingGender(false)}>
                    <option value="Man">Man</option>
                    <option value="Woman">Woman</option>
                    <option value="Other">Other</option>
                </select>
                ) : (
                gender
                )}
                {isEditingGender ? (
                <button className="edit-button" onClick={() => setIsEditingGender(false)}>Save</button>
                ) : (
                <button className="edit-button" onClick={() => setIsEditingGender(true)}>Edit</button>
                )}
            </div>
            </div>
        </div>

        <div className="preferences">
            <div>
                <strong>Unit of Measurement:</strong> {isEditingUnits ? (
                <select value={units} onChange={(e) => setUnits(e.target.value)} onKeyDown={handleSaveOnEnter} onBlur={() => setIsEditingUnits(false)}>
                    <option value="Imperial">Imperial</option>
                    <option value="Metric">Metric</option>
                </select>
                ) : (
                units
                )}
                {isEditingUnits ? (
                <button className="edit-button" onClick={() => setIsEditingUnits(false)}>Save</button>
                ) : (
                <button className="edit-button" onClick={() => setIsEditingUnits(true)}>Edit</button>
                )}
            </div>

            <div>
                <strong>Privacy:</strong> {isEditingPrivacy ? (
                <select value={privacy} onChange={(e) => setPrivacy(e.target.value)} onKeyDown={handleSaveOnEnter} onBlur={() => setIsEditingPrivacy(false)}>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                </select>
                ) : (
                privacy
                )}
                {isEditingPrivacy ? (
                <button className="edit-button" onClick={() => setIsEditingPrivacy(false)}>Save</button>
                ) : (
                <button className="edit-button" onClick={() => setIsEditingPrivacy(true)}>Edit</button>
                )}
            </div>

            <div>
                <button className="lightdarkmode">Light/Dark Mode</button>
            </div>

            <div>
                <button className="delete-account">Delete Account</button>
            </div>
            

            
        </div>
      </div>

      <style jsx>{`
        .container {
            display: flex;
            flex-direction: row;

        }
        .profile-container {
          width: 30vw;
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          color: black;
          margin-right: 10px;
        }

        .profile-info {
          margin-top: 20px;
        }

        p {
          margin: 8px 0;
        }

        .edit-button {
            border: 2px solid black;
            border-radius: 8px;
            margin-left: 15px;
        }

        .preferences {
            width: 30vw;
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            color: black;
          }

        .lightdarkmode {
            border: 2px solid black;
            border-radius: 8px;
            padding: 3px;
        }

        .delete-account {
            color: red;
            border: 2px solid red;
            border-radius: 8px;
            padding: 3px;
        }
      `}</style>
    </DefLayout>
  );
};

export default ProfilePage;
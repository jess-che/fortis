import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import DefLayout from "@/components/def_layout";
import { isTemplateSpan } from "typescript";
import { useState } from "react";

import SearchBar from "./SearchBarComponents/SearchBar";
import SearchResultsList from "./SearchBarComponents/SearchResultsList";
import SharedResultsDiv from "./SearchBarComponents/SharedResultsDiv";



const DiscoverPage: React.FC = () => {

  const workouts = [
    { name: "Push", description: "A push workout targets your chest, shoulder, and triceps" },
    { name: "Pull", description: "A pull workout targets your back and biceps" },
    { name: "Legs", description: "A leg workout targets your quadriceps, hamstrings, and calves" },
    { name: "Core", description: "An abs workout targets your abdominal muscles, lower back, and obliques" },
    { name: "Cardio", description: "A cardio workout trains your aerobic metabolism and cardiovascular health" },
    { name: "HIIT", description: "High Intensity Interval Training incorporate rounds of higher and lower intensity movements" },
  ];

  // Inline styles for workout-name and workout-rectangle
  const workoutNameStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
  };

  const workoutRectangleStyle = {
    background: 'gray',
    border: '1px solid #ccc',
    padding: '10px',
    margin: '10px',
    borderRadius: '10px',
  };

  const searchBarStyle = {
    margin: 'auto',
    width: '40%',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    minWidth: '200px',
  };

  const populatelistMuscle = async (query: string) => {
    const response = await fetch('/api/FilterExcMuscle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchQuery: query
      }),
    });
    
    if (!response.ok) {
        throw new Error('Failed to save query');
      }
    const data = await response.json();
    const dataName = data.data.rows.map((row: { name: any; }) => row.name);
    console.log(dataName);
    setResults(dataName);
  };

  const [results, setResults] = useState([]);
  // const handleWorkoutClick = (workoutName: string) => {console.log(`You clicked ${workoutName}`);};
  
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const handleWorkoutClick = (workoutName: string) => {
    setSelectedWorkout(prevWorkout => {
      if (prevWorkout === workoutName) {
        return null; // if the workout is clicked again, unselect it
      } else {
        console.log(workoutName);
        populatelistMuscle(workoutName);
        return workoutName; // otherwise, select the clicked workout
      }
    });
  };

  return (
    <DefLayout>
      <div className="discover-page">
        <div className="search-bar-container" style={searchBarStyle}>
          <SearchBar />
        </div>

        <div className="workout-list">
          {workouts.map((workout) => {
            const isSelected = workout.name === selectedWorkout;
            const itemStyle = isSelected
              ? { ...workoutRectangleStyle, background: "green" }
              : workoutRectangleStyle;

            return (
              <div key={workout.name} className="workout-item" style={itemStyle} onClick={() => handleWorkoutClick(workout.name)}>
                <div className="workout-rectangle">
                  <p className="workout-name" style={workoutNameStyle}>
                    {workout.name}
                  </p>
                  <p className="workout-description">{workout.description}</p>
                </div>
              </div>
            );
          })}

          <SharedResultsDiv>
            {results && results.length > 0 && <SearchResultsList results={results} />}
          </SharedResultsDiv>
        </div>
      </div>
    </DefLayout>
  );
};

// export default DiscoverPage;


//   return (
//     <DefLayout>
//       <div className="discover-page">
//         <div className="search-bar-container" style={searchBarStyle}>
//           <SearchBar />
//         </div>

//         <div className="workout-list">
          
//         {workouts.map((workout) => {
//           const isSelected = workout.name === selectedWorkout;
//           const itemStyle = isSelected ? { ...workoutRectangleStyle, background: 'green' } : workoutRectangleStyle;

//           return (
//             <div>
//               <div 
//                 key={workout.name}
//                 className="workout-item" 
//                 style={itemStyle} onClick={() => handleWorkoutClick(workout.name)}
//               >
//                 <div className="workout-rectangle" >
//                   <p className="workout-name" style={workoutNameStyle}>{workout.name}</p>
//                   <p className="workout-description">{workout.description}</p>
//                 </div>
//               </div>
//               <div className="search-results">
//                 {results && results.length > 0 && <SearchResultsList results={results} />}
//               </div>
//             </div>
            
//           );
//         })}
//         </div>
//       </div>
//     </DefLayout>
//   );
// };


  // return (
  //   <DefLayout>
  //     <div className="discover-page">
  //       <div className="search-bar-container" style={searchBarStyle}>
  //         {/* <SearchBar results={setResults} />
  //         {results && results.length > 0 && <SearchResultsList results={results} />} */}
  //       </div>

  //       <div className="workout-list">
          
  //         {workouts.map((workout) => (
  //           <div key={workout.name} className="workout-item" style={workoutRectangleStyle} >
  //             <div className="workout-rectangle" >
  //               <p className="workout-name" style={workoutNameStyle}>{workout.name}</p>
  //               <p className="workout-description">{workout.description}</p>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   </DefLayout>
  // );

export default DiscoverPage;



import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import DefLayout from "@/components/def_layout";
import { isTemplateSpan } from "typescript";
import { useState } from "react";

import { SearchBar } from "./SearchBarComponents/SearchBar";
import { SearchResultsList } from "./SearchBarComponents/SearchResultsList";


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
    // backgroundColor: '#aaa',
    margin: 'auto',
    width: '40%',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    minWidth: '200px',
  };

  const [results, setResults] = useState([]);

  return (
    <DefLayout>
      <div className="discover-page">
        <div className="search-bar-container" style={searchBarStyle}>
          <SearchBar />
          <SearchResultsList />
        </div>

        <div className="workout-list">
          
          {workouts.map((workout) => (
            <div key={workout.name} className="workout-item" style={workoutRectangleStyle} >
              <div className="workout-rectangle" >
                <p className="workout-name" style={workoutNameStyle}>{workout.name}</p>
                <p className="workout-description">{workout.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DefLayout>
  );

};

export default DiscoverPage;

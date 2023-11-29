import React, { FC, useEffect, useState } from 'react';
import DefLayout from "@/components/def_layout";
import './disoverpage.css'; // Import the CSS for styling
const DiscoverPage: React.FC = () => {
  const workouts = [
    { name: "Push", description: "A push workout targets your chest, shoulder, and triceps" },
    { name: "Pull", description: "A pull workout targets your back and biceps" },
    { name: "Legs", description: "A leg workout targets your quadriceps, hamstrings, and calves" },
    { name: "Core", description: "An abs workout targets your abdominal muscles, lower back, and obliques" },
    { name: "Cardio", description: "A cardio workout trains your aerobic metabolism and cardiovascular health" },
    { name: "HIIT", description: "HIIT incorporate rounds of higher and lower intensity movements" },
  ];
  type StringToArrayMappingType = {
    [key: string]: string[];
  };
 
  type CategorySetCounts = {
    [category: string]: number;
  };
  // State to track the selected category for filtering
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const workout_muscle_map: StringToArrayMappingType = {
    "Push": ["Chest", "Shoulder", "Triceps"],
    "Pull": ["Back", "Biceps"],
    "Legs": ["Quadriceps", "Hamstrings", "Calves"],
    "Core": ["Abs", "Back", "Obliques"],
    "Cardio": [],
    "HIIT": []
  }
  const muscleToWorkoutMap: { [muscle: string]: string } = {};
  Object.entries(workout_muscle_map).forEach(([workout, muscles]) => {
    muscles.forEach((muscle) => {
      muscleToWorkoutMap[muscle] = workout;
    });
  });
  const [activityData, setActivityData] = useState<any[]>([]);
  type MuscleGroupSetCounts = {
    [key: string]: number;
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
  // Filter and sort activities based on the selected category and set count
  const filteredAndSortedActivityData = selectedCategory
  ? activityData
      .filter(activity => activity.categorySetCounts[selectedCategory] > 5)
      .sort((a, b) => b.categorySetCounts[selectedCategory] - a.categorySetCounts[selectedCategory])
  : activityData;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/TemplateActivities');
        if (!response.ok) {
          throw new Error('Failed to fetch activity data');
        }
        const activityJson = await response.json();
        const activitiesWithCategorySetCounts = await Promise.all(activityJson.data.rows.map(async (activity: any) => {
        const categorySetCounts: CategorySetCounts = {};

          const workoutResponse = await fetch('/api/TemplateWorkouts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            // body: JSON.stringify({ eid })
            body: JSON.stringify({
              aid: activity.Aid,
            }),
          });
        
          if (!workoutResponse.ok) {
            throw new Error('Failed to retrieve history workouts');
          }
          const workoutJson = await workoutResponse.json();
          const workoutsWithExerciseData = await Promise.all(workoutJson.data.rows.map(async (workout: any) => {
            const exerciseDataResponse = await ExcDatafromEID(workout.Eid);
            const muscleGroups = exerciseDataResponse?.muscle_group?.split(',') || [];
          muscleGroups.forEach((muscleGroup: string) => {
            const trimmedMuscleGroup = muscleGroup.trim();
            const category = muscleToWorkoutMap[trimmedMuscleGroup];
            if (category) {
              categorySetCounts[category] = (categorySetCounts[category] || 0) + parseInt(workout.Set, 10);
            }
          });
          return {
            ...workout,
            exerciseData: exerciseDataResponse,
          };
        }));
        return {
          ...activity,
          workouts: workoutsWithExerciseData,
          categorySetCounts,
        };
      }));
      setActivityData(activitiesWithCategorySetCounts);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);
 


  const workoutRectangleStyle = {
    background: 'gray',
    border: '1px solid #ccc',
    padding: '.5rem',
    borderRadius: '10px',
  };
 
  const [results, setResults] = useState<string[]>([]);
  // const handleWorkoutClick = (workoutName: string) => {console.log(`You clicked ${workoutName}`);};
 
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const handleWorkoutClick = (workoutName: string) => {
    setSelectedWorkout(prevWorkout => {
      if (prevWorkout === workoutName) {
        return null; // if the workout is clicked again, unselect it
      } else {
        // console.log(workoutName);
        return workoutName; // otherwise, select the clicked workout
      }
    });
  };
  // Function to handle clicking a workout category button
  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(prevCategory => {
      // Toggle the category off if it's already selected, or set the new one
      return prevCategory === categoryName ? null : categoryName;
    });
  };
  // Filter activities based on the selected category and set count
  const filteredActivityData = selectedCategory
  ? activityData.filter(activity => activity.categorySetCounts[selectedCategory] > 5)
  : activityData;

  return (
    <DefLayout>
      <div className="discover-page">
        <div className="workout-list grid grid-cols-6 gap-2">
          {workouts.map((workout) => {
            const isSelected = workout.name === selectedCategory;
            const itemStyle = isSelected
              ? { ...workoutRectangleStyle, background: "green" }
              : workoutRectangleStyle;
 
            return (
              <div key={workout.name} className="workout-item" style={itemStyle} onClick={() => handleCategoryClick(workout.name)}>
                <div className="workout-rectangle">
                  <p className="text-xl font-bold">
                    {workout.name}
                  </p>
                  <p className="text-xs">{workout.description}</p>
                </div>
              </div>
            );
          })}
          {/* ... other divs ... */}
        </div>
      </div>
      <div className="history-container">
        <h1>Activity Templates</h1>
        <ul className="activity-list">
          {filteredAndSortedActivityData.map((activity: any, i: number) => (
            <li key={i} className="activity-item">
              <div className="activity-info">
                <h2>{activity.Activity_name}</h2>
                <span>Aid: {activity.Aid}</span>
                <span>favorites: {activity.Favorite}</span>
                {/* Display the aggregated set counts by category */}
                {Object.entries(activity.categorySetCounts).map(([category, count]) => (
                  <div key={category}>{category}: {count as number} sets</div>
                ))}
              </div>
              <ul className="workout-list">
                {activity.workouts.map((workout: any, j: number) => (
                  <li key={j} className="workout-item">
                    <div>Eid: {workout.Eid}</div>
                    <div>Set: {workout.Set}</div>
                    <div>Exercise Name: {workout.exerciseData?.name}</div>
                    <div>Exercise Description: {workout.exerciseData?.description}</div>
                    <div>Muscle Group: {workout.exerciseData?.muscle_group}</div>
                    <div>Equipment: {workout.exerciseData?.equipment}</div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </DefLayout>
  );
}
export default DiscoverPage;
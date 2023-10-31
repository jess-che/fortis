import React, { FC, useEffect, useState } from 'react';
import DefLayout from '@/components/def_layout';
import './HistoryPage.css';                             // Import the CSS for styling
import '@/public/styles/history.css';                      // style sheet for animations

const HistoryPage: FC = () => {
  // get activity data
  const [activityData, setActivityData] = useState<any[]>([]);

  // get exercise data from EID
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
      console.log("Exercise Data:", data); // Log to inspect the structure

      return data.data.rows[0];
    } catch (error) {
      console.error('Error fetching exercise data:', error);
      return null;
    }
  };

  // get data for each activity
  useEffect(() => {
    const fetchData = async () => {
      try {
        const activityResponse = await fetch('/api/HistoryActivities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            searchQuery: "b24e24f4-86b8-4b83-8947-b2472a43b436",            // uid, to be replaced
          }),
        });

        if (!activityResponse.ok) {
          throw new Error('Failed to fetch activity data');
        }

        const activityData = await activityResponse.json();
        console.log(activityData)
        // Fetch workout data for each activity
        const activitiesWithWorkouts = await Promise.all(activityData.data.rows.map(async (activity: any) => {
          const workoutResponse = await fetch('/api/HistoryWorkouts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uid: "b24e24f4-86b8-4b83-8947-b2472a43b436",                  // uid, to be replaced
              aid: activity.Aid,
            }),
          });

          if (!workoutResponse.ok) {
            throw new Error('Failed to retrieve history workouts');
          }

          const workoutData = await workoutResponse.json();

          // Fetch exercise data for each workout
          const workoutsWithExerciseData = await Promise.all(workoutData.data.rows.map(async (workout: any) => {
            const exerciseData = await ExcDatafromEID(workout.Eid);
            console.log("Fetched Exercise Data:", exerciseData); // Log the fetched exercise data

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

        console.log("Final Activities with Workouts:", activitiesWithWorkouts); // Log the final data
        setActivityData(activitiesWithWorkouts);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <DefLayout>
      {/* main container */}
      <div className="flex w-screen min-h-[90vh] justify-center items-center">
        {/* summary of history */}
        <div className="h-[85vh] w-[30vw] bg-white bg-opacity-10 rounded-3xl border-2 border-white opacity-40 bg-blur mr-[1vw]">

        </div>
        {/* summary of history */}
        <div className="h-[85vh] w-[62vw] bg-white bg-opacity-10 rounded-3xl border-2 border-white opacity-40 bg-blur ml-[1vw]">
          
        </div>
      </div>


      <div className="history-container">
        <h1>History Activities</h1>
        <ul className="activity-list">
          {activityData.map((activity: any, i: number) => (
            <li key={i} className="activity-item">
              <div className="activity-info">
                <h2>{activity.Activity_name}</h2>
                <span>Aid: {activity.Aid}&emsp;</span>
                <br/>
                <span>Date: {activity.Date}&emsp;</span>
                <br/>
                <span>Start Time: {activity.Start_Time}</span>
                <span>Duration: {activity.Duration}</span>
              </div>
              <ul className="workout-list">
                {activity.workouts.map((workout: any, j: number) => (
                  <li key={j} className="workout-item">
                    <div>Eid: {workout.Eid}</div>
                    <div>Rep: {workout.Rep}</div>
                    <div>Seq_num: {workout.Seq_num}</div>
                    <div>Set: {workout.Set}</div>
                    <div>Uid: {workout.Uid}</div>
                    <div>Weight: {workout.Weight}</div>
                    <div>Exercise Name: {workout.exerciseData?.name}</div>
                    <div>Exercise Description: {workout.exerciseData?.description}</div>
                    <div>Muscle Group: {workout.exerciseData?.muscle_group}</div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </DefLayout>
  );
};

export default HistoryPage;

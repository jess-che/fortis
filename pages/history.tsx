import React, { FC, useEffect, useState } from 'react';
import DefLayout from '@/components/def_layout';
import '@/public/styles/history.css';                      // style sheet for animations

const HistoryPage: FC = () => {
  // get activity data
  const [activityData, setActivityData] = useState<any[]>([]);

  // if workout is clicked
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

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

  // format date in MM/DD/YYYY
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0 indexed in JavaScript
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }


  return (
    <DefLayout>
      {/* main container */}
      <div className="flex w-screen min-h-[90vh] justify-center items-center">

        {/* summary of history */}
        <div className="flex flex-col h-[85vh] w-[20vw] bg-white bg-opacity-5 rounded-3xl border-2 border-white border-opacity-40 bg-blur">
          <div className="font-bold text-[2vw] p-3">Workout History</div>
          
          <ul className="max-h-[75vh] overflow-y-auto">
          {activityData.map((activity: any, i: number) => (
            <li key={i}
              onClick={() => setClickedIndex(clickedIndex === i ? null : i)}
              className={`activity-item relative list-none mx-3 p-2 rounded-xl border-t border-b border-white border-opacity-80 
                        ${clickedIndex === i ? 'bg-white text-black' : 'transition hover:bg-transparent  border-b border-white border-opacity-80 '}
                        `}>
              <div className="mb-2 flex flex-col relative z-10">
                <div className="text-2xl">{activity.Activity_name}</div>
                {/* <span>Aid: {activity.Aid}&emsp;</span> */}
                <span>Date: {formatDate(activity.Date)}</span>
                {/* <span>Start Time: {activity.Start_Time}</span> */}
                <span>Duration: {activity.Duration}</span>
              </div>
            </li>
          ))}
        </ul>

        </div>

        {/* line divider */}
        <div className="h-[80vh] w-[2px] mx-[1vw] bg-white bg-opacity-50"></div>

        {/* summary of history */}
        <div className="h-[85vh] w-[72vw] bg-blur">
        </div>

      </div>

      

                {/* <ul className="list-none p-0">
                  {activity.workouts.map((workout: any, j: number) => (
                    <li key={j} className="grid grid-cols-3 gap-2.5 bg-black rounded-2xl mb-2 p-2">
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
                </ul> */}

    </DefLayout>
  );
};

export default HistoryPage;

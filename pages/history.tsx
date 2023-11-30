'use client'
import React, { FC, useEffect, useState } from 'react';
import DefLayout from '@/components/def_layout';
import LoginLayout from '@/components/login_layout';  // !! FOR DEVELOPMENT ONLY
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { setCookie, getCookie } from 'cookies-next';
import '@/public/styles/history.css';     // style sheet for animations
import { useRouter } from 'next/router';
import '@/pages/StreakGraphs.css';
import StreakGraph from '@/pages/StreakGraph'; // Adjust the path as needed

// define type
type DataType = {
  workouts: any[];
};

interface DataPoint {
  date: string;
  duration: number;
}


const HistoryPage: FC = () => {
  const router = useRouter();

  console.log(getCookie('uid'));
  // ---- start of auth0 setup ----
  // set auth0 state
  const { user, error, isLoading } = useUser();
  // ---- end of auth0 setup ---- 

  // ---- start of use state components ----
  // activity and workout data
  const [activityData, setActivityData] = useState<any[]>([]);
  const [data, setData] = useState<DataType | null>(null);

  // store current activity
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);  // set if workout is clicked
  const [specificAid, setSpecificAid] = useState<number | null>(null);                   // specificAid of clicked workout   

  // side bar
  const [weeksBefore, setWeeksBefore] = useState(1);  // weeks -- used to query by week in sidebar
  const [loading, setLoading] = useState(true);       // if data is being fetched for sidebar

  const [showGraph, setShowGraph] = useState(false);

  const toggleGraph = () => {
    setShowGraph(!showGraph);
  };
  // ---- end of use state components ----

  // ---- start of API fn calls ----
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
      console.error('Error getting exercise data:', error);
      return null;
    }
  };
  // ---- end of API fn calls ----

  // get activities per week
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);   // set loading to true while data is being fetched

      const today = new Date();
      const today2 = new Date();
      today2.setDate(today.getDate() + 1);                                       // add a day for edge case
      const currentDateString = new Date(today2).toISOString().split('T')[0];   // make postgre able

      try {
        console.log("called history");
        const activityResponse = await fetch('/api/HistoryActivities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            searchQuery: getCookie('uid'),
            currentDate: currentDateString,
            weeksBefore: weeksBefore
          }),
        });

        if (!activityResponse.ok) {
          throw new Error('Failed to fetch activity data');
        }

        const activityData = await activityResponse.json();

        const mapActivities = await Promise.all(activityData.data.rows.map(async (activity: any) => {
          return {
            ...activity
          };
        }));

        setLoading(false);    // set loading to false now that data is fetched

        console.log("Mapped Activities: ", mapActivities);  // Log the final data
        setActivityData(mapActivities);
      } catch (error) {
        console.error('Error in getting activity history:', error);
      }
    };

    fetchData();
  }, [weeksBefore]);

  // get data for specific activity
  useEffect(() => {
    const fetchData = async () => {
      try {
        const workoutResponse = await fetch('/api/HistoryWorkouts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: getCookie('uid'),
            aid: specificAid,
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

        setData({
          workouts: workoutsWithExerciseData,
        });

      } catch (error) {
        console.error('Error in getting workouts for history:', error);
      }
    };

    fetchData();
    if (specificAid != null) {
      let transfAID: string | null = specificAid.toString();
      localStorage.setItem('aidTransfer', transfAID);
    }
  }, [specificAid]);
  // ---- end of API calls with useEffect ----

  // Add a new function to handle the Save click
  const handleSaveClick = (workoutData: any[]) => {
    localStorage.setItem('workoutData', JSON.stringify(workoutData));
    router.push('/log'); // Assuming '/log' is the path to Log2Page
  };

  // ---- start of random functions ----
  // getting weekRange
  const getWeekRange = (weeksBefore: any) => {
    const today = new Date();
    const endOfWeek = new Date(); // Set the endOfWeek to be the end of the current week (Tuesday)

    // now move it back how many weeks
    endOfWeek.setDate(today.getDate() - (weeksBefore - 1) * 7);

    // Subtract the days to go back to the previous weeks
    const daysToSubtract = (weeksBefore * 7);
    today.setDate(today.getDate() - daysToSubtract + 1);

    // Now, we set the startOfWeek to be the same as today's adjusted date 
    const startOfWeek = new Date(today);

    return {
      start: startOfWeek,
      end: endOfWeek
    };
  };
  // ---- end of random functions ----

  // ---- start of reformating ----
  // format interval to something readable and printable for activity
  function intervalToString(interval: any) {
    let str = '';

    if (!interval) {
      return str;
    }

    if (interval.days) {
      str += interval.days + 'd ';
    }
    if (interval.hours) {
      str += interval.hours + 'h ';
    }
    if (interval.minutes) {
      str += interval.minutes + 'm ';
    }
    if (interval.seconds) {
      str += interval.seconds + 's';
    }

    return str.trim();
  }

  // format date for the weekrange at top
  const formatDateforRange = (date: any) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // return the whole formatted week range
  const getFormattedDateRange = (weeksBefore: any) => {
    const { start, end } = getWeekRange(weeksBefore);
    return `${formatDateforRange(start)}-${formatDateforRange(end)}`;
  };
  // ---- start of reformating ----


  // trying to add graph
  const [parsedData, setParsedData] = useState<DataPoint[]>([]);
  const [loadingGraph, setIsGraphLoading] = useState(false); // new state for loading indicator
  const [workoutTimeText, setWorkoutTimeText] = useState('');
  const [workoutChangeText, setWorkoutChangeText] = useState('');
  const [isPositiveChange, setIsPositiveChange] = useState(false);

  useEffect(() => {
    const handleAnalStreaks = async () => {
      try {
        await AnalStreaks();
        console.log('AnalStreaks called successfully');
      } catch (error) {
        console.error('Error calling AnalStreaks:', error);
      }
      // } else {
      //   console.error('User email is not available.');
      // }

      try {
        await time();
        console.log('time Done');
      } catch (error) {
        console.error('Error calling time:', error);
      }
    };

    handleAnalStreaks();
  }, [setIsGraphLoading]);

  // work time this week
  const time = async () => {
    try {
      const res = await fetch('api/TotalTime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery: getCookie('uid'),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await res.json();
      const totalMinutes = Math.round(parseFloat(data.data.rows[0].total_workout_minutes));
      const previousWeekMinutes = Math.round(parseFloat(data.data.rows[0].previous_week_minutes));

      // Calculate percentage change
      let percentageChange = 0;
      if (previousWeekMinutes > 0) {
        percentageChange = ((totalMinutes - previousWeekMinutes) / previousWeekMinutes) * 100;
      }

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      const formattedTime = `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
      setWorkoutTimeText(`${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`);
      setWorkoutChangeText(`${percentageChange.toFixed(1)}%`);
      setIsPositiveChange(percentageChange > 0);

      console.log(formattedTime);

      return formattedTime; // This line returns the formatted time, which can be used elsewhere
    } catch (error) {
      console.error('Error in time:', error);
      return ''; // Return an empty string or some default value in case of an error
    }
  };

  // the your workout streaks
  const AnalStreaks = async () => {
    setIsGraphLoading(true); // Set loading to true before fetching data
    try {
      const response = await fetch('api/AnalStreaks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery: getCookie('uid'),
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
    setIsGraphLoading(false); // Set loading to false after fetching data
  };

  if (user) {
    return (
      <DefLayout>
        {/* main container */}
        <div className="flex w-screen min-h-[90vh] justify-center items-center">

          {/* summary of history */}
          <div className="flex flex-col h-[85vh] min-w-[20vw] max-w-[27vw] bg-white bg-opacity-5 rounded-3xl border border-white border-opacity-40 bg-blur items-center">
            <div className="flex flex-row min-w-[19vw] py-3 px-1 justify-between items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"
                onClick={() => {
                  if (weeksBefore > 1) {
                    setWeeksBefore(prev => prev - 1); // move to the previous week only if weeksBefore > 1
                    setClickedIndex(null);            // reset clickedIndex
                    setSpecificAid(null);             // reset specificAid
                  }
                }}
                style={{ opacity: weeksBefore === 1 ? 0.5 : 1 }} // apply 50% opacity if weeksBefore is 0
              >
                <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
              </svg>
              <div className="font-bold text-3xl text-center">{getFormattedDateRange(weeksBefore)}</div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"
                onClick={() => {
                  setWeeksBefore(prev => prev + 1);
                  setClickedIndex(null);  // reset clickedIndex
                  setSpecificAid(null);   // reset specificAid
                }}>
                <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
              </svg>
            </div>

            <button onClick={toggleGraph} className={`w-[15vh] h-[15vh] border border-white border-opacity-20 mb-3 rounded-2xl flex-shrink-0 text-center items-center justify-center glow ${showGraph ? 'clicked' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[15vh] h-[15vh]">
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75" fill="#2FABDD" />
                <path d="M9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625" fill="#55BBA4" />
                <path d="M3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75" fill="#C32E67" />
              </svg>
            </button>

            <div className="h-[2px] w-[18vw] bg-white bg-opacity-50 mb-5"></div>

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
                <li key={i}
                  onClick={() => {
                    setClickedIndex(clickedIndex === i ? null : i);
                    setSpecificAid(activity.Aid);
                  }}
                  className={`activity-item relative list-none mx-3 p-2 rounded-xl border-t border-b border-white border-opacity-80 
                        ${clickedIndex === i ? 'clicked' : 'glow hover:bg-transparent  border-b border-white border-opacity-80 '}
                        `}>
                  <div className="flex flex-col relative z-10">
                    <div className="text-2xl">{activity.Activity_name}</div>
                    {/* <span>Aid: {activity.Aid}&emsp;</span> */}
                    <span>Date: {activity.formatted_date}</span>
                    {/* <span>Start Time: {activity.Start_Time}</span> */}
                    <span>Duration: {intervalToString(activity.Duration)}</span>
                  </div>
                </li>
              ))}
            </ul>

          </div>

          {/* line divider */}
          <div className="h-[80vh] w-[2px] mx-[1vw] bg-white bg-opacity-50"></div>

          {/* summary of history */}
          <div className="h-[85vh] w-[70vw] bg-blur overflow-y-auto">
            {showGraph && (
              <div className="absolute  border border-white border-opacity-40 rounded-xl h-[85vh] w-[70vw] flex flex-row items-center justify-center flex-shrink-0 text-center bg-[#121212] backdrop-blur-md bg-opacity-10 z-50">
                <div className="flex flex-col items-center justify-center">
                  {!isLoading && parsedData.length > 0 ? (
                    <StreakGraph parsedData={parsedData} /> // Render the StreakGraph component here
                  ) : (
                    isLoading ? <p>Loading...</p> : <p>No data to display</p>
                  )}

                  <div className="w-full h-[1px] bg-white mb-5"></div>

                  <div className="flex flex-col items-center">
                    <div className="ml-2 text-2xl">
                      <span className='text-3xl font-bold'>Workout Time This Week: {" "}{" "}</span>
                      {` ${workoutTimeText}`}
                    </div>

                    <div className="mr-3">
                      {workoutChangeText && (
                        <div
                          style={{
                            color: isPositiveChange ? '#55BBA4' : '#C32E67',
                          }}
                          className="text-xl"
                        >
                          ({isPositiveChange ? '+' : ''}{workoutChangeText} change from last week)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <ul className="space-y-4">
              {/* no activity been clicked */}
              {specificAid === null &&
                <div>
                  <div className="text-xl">No Data</div>
                </div>
              }

              {/* if there is an activity clicked */}
              {specificAid != null &&
                <div className="flex justify-between items-center">
                  {/* display data (name, date, duration) */}
                  {specificAid !== null && activityData.find(activity => activity.Aid === specificAid) && (
                    <>
                      <div className="text-3xl font-bold">
                        {activityData.find(activity => activity.Aid === specificAid).Activity_name}
                      </div>
                      <div className="text-xl opacity-70">
                        Date: {" "} {
                          activityData.find(activity => activity.Aid === specificAid).formatted_date
                        } {" "} || {" "}
                        Duration: {" "} {intervalToString(
                          activityData.find(activity => activity.Aid === specificAid).Duration
                        )}
                      </div>
                    </>
                  )}

                  {/* link to save or edit */}
                  <div className="flex flex-row">
                    <div className="flex flex-row">
                      <Link href="/logfinish" className="inline-flex items-center border-r">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>

                        <p className="pl-2 pr-3 text-white text-opacity-75 text-md hover:gradient-text-bp duration-300 text-center">EDIT METADATA</p>
                      </Link>
                    </div>

                    <div className="pl-3 flex flex-row">
                      <button
                        onClick={() => {
                          if (data && data.workouts) {
                            console.log("suck")
                            handleSaveClick(data.workouts);
                          } else {
                            console.log("No workout data to save");
                            // Optionally, you could display a notification or alert to the user here.
                          }
                        }}
                        className="inline-flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                        <p className="pl-2 text-white text-opacity-75 text-md hover:gradient-text-pg duration-300 text-center">USE AS TEMPLATE</p>
                      </button>
                    </div>
                  </div>
                </div>
              }
              {/* if clicked but no data */}
              {specificAid != null && data != null && data.workouts.length === 0 &&
                <div>
                  <div className="text-xl">No Exercise Data</div>
                </div>
              }
              {/* clicked and data -- display eacch exercise */}
              {data != null && data.workouts.map((workout, index) => (
                <li key={index} className="border p-4 rounded-xl border-white border-opacity-40 ">
                  <div className="text-2xl font-semibold">{workout.exerciseData?.name}</div>
                  <p className="text-white opacity-70">{workout.exerciseData?.description}</p>
                  <div className="text-sm text-white opacity-60">Muscle Group: {workout.exerciseData?.muscle_group}</div>

                  <div className="w-[66vw] h-[1px] m-[1vw] bg-white bg-opacity-50"></div>

                  <div className="grid grid-cols-4 gap-5">
                    <div className="col-span-1 flex flex-row items-center">
                      <Image
                        src="/animated/set.svg"
                        alt=""
                        width={40}
                        height={40}
                      />
                      <div className="text-lg pl-2 text-white opacity-70">Set: {workout.Set}</div>
                    </div>
                    <div className="col-span-1 flex flex-row items-center">
                      <Image
                        src="/animated/rep.svg"
                        alt=""
                        width={42}
                        height={42}
                      />
                      <div className="text-lg pl-2 text-white opacity-70">Rep: {workout.Rep}</div>
                    </div>
                    <div className="col-span-1 flex flex-row items-center border-r">
                      <Image
                        src="/animated/weight.svg"
                        alt=""
                        width={38}
                        height={38}
                      />
                      <div className="text-lg pl-2 text-white opacity-70">Weight: {workout.Weight}</div>
                    </div>
                    <div className="col-span-1 flex flex-row items-center">
                      <Image
                        src="/animated/totalWeight.svg"
                        alt=""
                        width={45}
                        height={45}
                      />
                      <div className="text-xl text-white pl-1">Total Weight: {workout.Rep * workout.Set * workout.Weight}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DefLayout>
    );
  }
  else {
    return (
      // !! FOR DEPLOYMENT ONLY !! 
      <LoginLayout>
        {/* main container */}
        <div className="flex w-screen min-h-[90vh] justify-center items-center">

          {/* summary of history */}
          <div className="flex flex-col h-[85vh] min-w-[20vw] max-w-[27vw] bg-white bg-opacity-5 rounded-3xl border border-white border-opacity-40 bg-blur items-center">
            <div className="flex flex-row min-w-[19vw] py-3 px-1 justify-between items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"
                onClick={() => {
                  if (weeksBefore > 1) {
                    setWeeksBefore(prev => prev - 1); // move to the previous week only if weeksBefore > 1
                    setClickedIndex(null);            // reset clickedIndex
                    setSpecificAid(null);             // reset specificAid
                  }
                }}
                style={{ opacity: weeksBefore === 1 ? 0.5 : 1 }} // apply 50% opacity if weeksBefore is 0
              >
                <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
              </svg>
              <div className="font-bold text-3xl text-center">{getFormattedDateRange(weeksBefore)}</div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"
                onClick={() => {
                  setWeeksBefore(prev => prev + 1);
                  setClickedIndex(null);  // reset clickedIndex
                  setSpecificAid(null);   // reset specificAid
                }}>
                <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
              </svg>
            </div>

            <button onClick={toggleGraph} className={`w-[15vh] h-[15vh] border border-white border-opacity-20 mb-3 rounded-2xl flex-shrink-0 text-center items-center justify-center glow ${showGraph ? 'clicked' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[15vh] h-[15vh]">
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75" fill="#2FABDD" />
                <path d="M9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625" fill="#55BBA4" />
                <path d="M3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75" fill="#C32E67" />
              </svg>
            </button>

            <div className="h-[2px] w-[18vw] bg-white bg-opacity-50 mb-5"></div>

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
                <li key={i}
                  onClick={() => {
                    setClickedIndex(clickedIndex === i ? null : i);
                    setSpecificAid(activity.Aid);
                  }}
                  className={`activity-item relative list-none mx-3 p-2 rounded-xl border-t border-b border-white border-opacity-80 
                        ${clickedIndex === i ? 'clicked' : 'glow hover:bg-transparent  border-b border-white border-opacity-80 '}
                        `}>
                  <div className="flex flex-col relative z-10">
                    <div className="text-2xl">{activity.Activity_name}</div>
                    {/* <span>Aid: {activity.Aid}&emsp;</span> */}
                    <span>Date: {activity.formatted_date}</span>
                    {/* <span>Start Time: {activity.Start_Time}</span> */}
                    <span>Duration: {intervalToString(activity.Duration)}</span>
                  </div>
                </li>
              ))}
            </ul>

          </div>

          {/* line divider */}
          <div className="h-[80vh] w-[2px] mx-[1vw] bg-white bg-opacity-50"></div>

          {/* summary of history */}
          <div className="h-[85vh] w-[70vw] bg-blur overflow-y-auto">
            {showGraph && (
              <div className="absolute  border border-white border-opacity-40 rounded-xl h-[85vh] w-[70vw] flex flex-row items-center justify-center flex-shrink-0 text-center bg-[#121212] backdrop-blur-md bg-opacity-10 z-50">
                <div className="flex flex-col items-center justify-center">
                  {!isLoading && parsedData.length > 0 ? (
                    <StreakGraph parsedData={parsedData} /> // Render the StreakGraph component here
                  ) : (
                    isLoading ? <p>Loading...</p> : <p>No data to display</p>
                  )}

                  <div className="w-full h-[1px] bg-white mb-5"></div>

                  <div className="flex flex-col items-center">
                    <div className="ml-2 text-2xl">
                      <span className='text-3xl font-bold'>Workout Time This Week: {" "}{" "}</span>
                      {` ${workoutTimeText}`}
                    </div>

                    <div className="mr-3">
                      {workoutChangeText && (
                        <div
                          style={{
                            color: isPositiveChange ? '#55BBA4' : '#C32E67',
                          }}
                          className="text-xl"
                        >
                          ({isPositiveChange ? '+' : ''}{workoutChangeText} change from last week)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <ul className="space-y-4">
              {/* no activity been clicked */}
              {specificAid === null &&
                <div>
                  <div className="text-xl">No Data</div>
                </div>
              }

              {/* if there is an activity clicked */}
              {specificAid != null &&
                <div className="flex justify-between items-center">
                  {/* display data (name, date, duration) */}
                  {specificAid !== null && activityData.find(activity => activity.Aid === specificAid) && (
                    <>
                      <div className="text-3xl font-bold">
                        {activityData.find(activity => activity.Aid === specificAid).Activity_name}
                      </div>
                      <div className="text-xl opacity-70">
                        Date: {" "} {
                          activityData.find(activity => activity.Aid === specificAid).formatted_date
                        } {" "} || {" "}
                        Duration: {" "} {intervalToString(
                          activityData.find(activity => activity.Aid === specificAid).Duration
                        )}
                      </div>
                    </>
                  )}

                  {/* link to save or edit */}
                  <div className="flex flex-row">
                    <div className="flex flex-row">
                      <Link href="/logfinish" className="inline-flex items-center border-r">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>

                        <p className="pl-2 pr-3 text-white text-opacity-75 text-md hover:gradient-text-bp duration-300 text-center">EDIT METADATA</p>
                      </Link>
                    </div>

                    <div className="pl-3 flex flex-row">
                      <button
                        onClick={() => {
                          if (data && data.workouts) {
                            handleSaveClick(data.workouts);
                          } else {
                            console.log("No workout data to save");
                            // Optionally, you could display a notification or alert to the user here.
                          }
                        }}
                        className="inline-flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                        <p className="pl-2 text-white text-opacity-75 text-md hover:gradient-text-pg duration-300 text-center">USE AS TEMPLATE</p>
                      </button>
                    </div>
                  </div>
                </div>
              }
              {/* if clicked but no data */}
              {specificAid != null && data != null && data.workouts.length === 0 &&
                <div>
                  <div className="text-xl">No Exercise Data</div>
                </div>
              }
              {/* clicked and data -- display eacch exercise */}
              {data != null && data.workouts.map((workout, index) => (
                <li key={index} className="border p-4 rounded-xl border-white border-opacity-40 ">
                  <div className="text-2xl font-semibold">{workout.exerciseData?.name}</div>
                  <p className="text-white opacity-70">{workout.exerciseData?.description}</p>
                  <div className="text-sm text-white opacity-60">Muscle Group: {workout.exerciseData?.muscle_group}</div>

                  <div className="w-[66vw] h-[1px] m-[1vw] bg-white bg-opacity-50"></div>

                  <div className="grid grid-cols-4 gap-5">
                    <div className="col-span-1 flex flex-row items-center">
                      <Image
                        src="/animated/set.svg"
                        alt=""
                        width={40}
                        height={40}
                      />
                      <div className="text-lg pl-2 text-white opacity-70">Set: {workout.Set}</div>
                    </div>
                    <div className="col-span-1 flex flex-row items-center">
                      <Image
                        src="/animated/rep.svg"
                        alt=""
                        width={42}
                        height={42}
                      />
                      <div className="text-lg pl-2 text-white opacity-70">Rep: {workout.Rep}</div>
                    </div>
                    <div className="col-span-1 flex flex-row items-center border-r">
                      <Image
                        src="/animated/weight.svg"
                        alt=""
                        width={38}
                        height={38}
                      />
                      <div className="text-lg pl-2 text-white opacity-70">Weight: {workout.Weight}</div>
                    </div>
                    <div className="col-span-1 flex flex-row items-center">
                      <Image
                        src="/animated/totalWeight.svg"
                        alt=""
                        width={45}
                        height={45}
                      />
                      <div className="text-xl text-white pl-1">Total Weight: {workout.Rep * workout.Set * workout.Weight}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LoginLayout>
    );
  }
};

export default HistoryPage;
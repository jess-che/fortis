'use client'
import React, { FC, useEffect, useState } from 'react';
import DefLayout from '@/components/def_layout';
import LoginLayout    from '@/components/login_layout';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import '@/public/styles/history.css';     // style sheet for animations

// define type
type DataType = {
  workouts: any[];
};

const HistoryPage: FC = () => {
  // ---- start of auth0 setup ----
  // set auth0 state
  const { user, error, isLoading } = useUser();
  // ---- end of auth0 setup ---- 

  // ---- start of use state components ----
  // save user uid (only have to query once per load)
  const [UID, setUID] = useState('');

  // activity and workout data
  const [activityData, setActivityData] = useState<any[]>([]);
  const [data, setData] = useState<DataType | null>(null);

  // store current activity
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);  // set if workout is clicked
  const [specificAid, setSpecificAid] = useState(null);                   // specificAid of clicked workout   

  // side bar
  const [weeksBefore, setWeeksBefore] = useState(1);  // weeks -- used to query by week in sidebar
  const [loading, setLoading] = useState(true);       // if data is being fetched for sidebar
  // ---- end of use state components ----

  // if (isLoading) {
  //   // Handle loading state, e.g., show a loading spinner
  //   return <div>Loading...</div>;
  // }
  // !! FOR DEVELOPMENT ONLY !!
  let userEmail = "x@gmail.com";               // default email if no user
  // if (user) {
  //   userEmail = user.email || "";   // if user
  // }
  // console.log("History: " + userEmail);

  // ---- start of API fn calls ----
  // get UID from auth0 email
  const getUID = async (query: any) => {
    try {
      const response = await fetch('/api/GetUIDfromEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery: userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get UID from email');
      }

      const data = await response.json();
      setUID(data.data.rows[0].uid);
      console.log("Got UID in History: ");
      console.group(UID);
      return data.data.rows[0].uid;
    }
    catch {
      // !! FOR DEVELOPMENT ONLY !! 
      console.log("Unable to fetch UID using getUIDfromEmail. Manually setting it to b24.... now");
      // setUID("71379e91-a26a-41fe-9901-4478133052e6");
      setUID("b24e24f4-86b8-4b83-8947-b2472a43b436");
    }
  };

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

  // ---- start of API calls with useEffect ----
  // useEffect(() => {
  //   getUID({ userEmail });
  // }, []);

  // get activities per week
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);   // set loading to true while data is being fetched
      getUID({ userEmail });
      const uid = UID;

      const today = new Date();
      const today2 = new Date(); 
      today2.setDate(today.getDate()+ 1); // add a day for edge case
      const currentDateString = new Date(today2).toISOString().split('T')[0];   // make postgre able

      try {
        console.log("called history");
        const activityResponse = await fetch('/api/HistoryActivities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            searchQuery: uid,
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
  }, [weeksBefore, UID]);   // need UID as dependency, because want to update when UID changes (is intially fetched)

  // get data for specific activity
  useEffect(() => {
    const fetchData = async () => {
      getUID({ userEmail });
      const uid = UID;

      try {
        const workoutResponse = await fetch('/api/HistoryWorkouts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: uid,
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
  }, [specificAid, UID]);   // need UID as dependency, because want to update when UID changes (is intially fetched)
  // ---- end of API calls with useEffect ----

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
  // format date in MM/DD/YYYY for displaying activity date
  const formatDate = (dateString: any) => {
    console.log(dateString);
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0 indexed in JavaScript
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

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

  if (user) {
    userEmail = user.email || ""; 
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

            <div className="w-[15vh] h-[15vh] bg-red-400 mb-3 rounded-2xl flex-shrink-0 text-center opacity-50">graph</div>

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
                      <Link href="/" className="inline-flex items-center border-r">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>

                        <p className="pl-2 pr-3 text-white text-opacity-75 text-lg hover:gradient-text-bp duration-300 text-center">EDIT</p>
                      </Link>
                    </div>

                    <div className="pl-3 flex flex-row">
                      <Link href="/" className="inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>

                        <p className="pl-2 text-white text-opacity-75 text-lg hover:gradient-text-pg duration-300 text-center">SAVE</p>
                      </Link>
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

            <div className="w-[15vh] h-[15vh] bg-red-400 mb-3 rounded-2xl flex-shrink-0 text-center opacity-50">graph</div>

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
                      <Link href="/" className="inline-flex items-center border-r">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>

                        <p className="pl-2 pr-3 text-white text-opacity-75 text-lg hover:gradient-text-bp duration-300 text-center">EDIT</p>
                      </Link>
                    </div>

                    <div className="pl-3 flex flex-row">
                      <Link href="/" className="inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>

                        <p className="pl-2 text-white text-opacity-75 text-lg hover:gradient-text-pg duration-300 text-center">SAVE</p>
                      </Link>
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
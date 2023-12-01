import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import DefLayout from '@/components/def_layout';
import { setCookie, getCookie } from 'cookies-next';
import '@/public/styles/logfinish.css';     // style sheet for animationsi
import PrivacyOptionsDialog from '@/components/PrivacyOptionsDialog';

type DataType = {
  workouts: any[];
};

const LogFinish: React.FC = () => {
  const [aid, setAid] = useState<string | null>(null);
  const [activityData, setActivityData] = useState<any[]>([]);

  const [data, setData] = useState<DataType | null>(null);

  const [title, setTitle] = useState('No Name');
  const [date, setDate] = useState('No Date');
  const [duration, setDuration] = useState('No Duraition');

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSavePrivacyOption = async (option: any) => {
    try {
      console.log(getCookie('uid'), aid, option)
      const response = await fetch('/api/updateTemplateStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: getCookie('uid'),
          aid: aid,
          option: option
        }),
      });

      console.log('Response status:', response.status);
      const responseBody = await response.text();
      console.log('Response body:', responseBody);

      alert('Changes saved successfully!');

      if (!response.ok) throw new Error('Network response was not ok.');
      // Handle the response here
    } catch (error) {
      alert('Failed to add to templates.');
      // Handle errors here
    }
  }
  
  function poundsToKilograms(pounds: any) {
    return Math.round(pounds * 0.453592);
  }

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  function intervalToString(interval: any) {
    let str = '';

    if (!interval) {
      return str;
    }
    if (interval.days) {
      str += interval.days + 'd ';
    } else {
      str += '0' + 'd ';
    }
    if (interval.hours) {
      str += interval.hours + 'h ';
    } else {
      str += '0' + 'h ';
    }
    if (interval.minutes) {
      str += interval.minutes + 'm ';
    } else {
      str += '0' + 'm ';
    }
    if (interval.seconds) {
      str += interval.seconds + 's';
    } else {
      str += '0' + 's ';
    }

    return str.trim();
  }

  const updateActivityMetaData = async () => {
    try {
      console.log(getCookie('uid'), aid, title, date, duration)
      const response = await fetch('/api/updateActivityMetaData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: getCookie('uid'),
          aid: aid,
          name: title,
          date: new Date(date).toISOString().split('T')[0],
          duration: duration
        }),
      });

      console.log('Response status:', response.status);
      const responseBody = await response.text();
      console.log('Response body:', responseBody);

      alert('Changes saved successfully!');

      if (!response.ok) throw new Error('Network response was not ok.');
      // Handle the response here
    } catch (error) {
      alert('Please use YYYY-MM-DD format for date and _d _h _m _s for duration.');
      // Handle errors here
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("called history");
        const activityResponse = await fetch('/api/getActivities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            searchQuery: getCookie('uid'),
            aid: aid,
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

        setTitle(activityData.data.rows[0].Activity_name);
        setDate(activityData.data.rows[0].formatted_date);
        setDuration(intervalToString(activityData.data.rows[0].Duration));

        console.log("Mapped Activities: ", activityData);  // Log the final data
        setActivityData(mapActivities);


        const workoutResponse = await fetch('/api/HistoryWorkouts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: getCookie('uid'),
            aid: aid,
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
  }, [aid]);

  useEffect(() => {
    // Access localStorage here
    const localStorageAid = localStorage.getItem('aidTransfer');
    setAid(localStorageAid);
  }, []);

  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
  };

  const handleDate = (event: any) => {
    setDate(event.target.value);
  };

  const handleDuration = (event: any) => {
    setDuration(event.target.value);
  };

  if (!aid) {
    return (
      <DefLayout>
        <div>No data in local storage</div>
      </DefLayout>
    );
  }



  return (
    <DefLayout>
      <div className='flex flex-col w-screen items-center justify-center'>
        {activityData.map((activity: any, i: number) => (
          <div className="flex flex-row w-[90vw] items-end justify-between relative z-10 px-4 my-4">
            <div className="text-4xl font-bold flex flex-row relative">
              <input
                type="text"
                className="appearance-none bg-transparent border-transparent text-white text-opacity-80"
                value={title}
                onChange={handleTitleChange}
                autoFocus
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="absolute top-2 right-2 w-4 h-4 opacity-70"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </div>
            <span className="text-2xl flex flex-row relative">
              <input
                type="text"
                className="appearance-none bg-transparent border-transparent text-white text-opacity-80"
                value={date}
                onChange={handleDate}
                autoFocus
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="absolute top-2 right-2 w-4 h-4 opacity-70"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </span>
            <span className="text-2xl mt-auto flex flex-row relative">
              <input
                type="text"
                className="appearance-none bg-transparent border-transparent text-white text-opacity-80"
                value={duration}
                onChange={handleDuration}
                autoFocus
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="absolute top-2 right-2 w-4 h-4 opacity-70"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </span>

          </div>
        ))}

        <div className='p-2 mt-3 flex flex-row mb-4 border border-white rounded-md border-opacity-50 bg-white bg-opacity-10'>
          <button
            onClick={() => {
              updateActivityMetaData();
            }}
            className="inline-flex items-center border-r"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#55BBA4" className="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>

            <p className="pl-2 pr-3 text-white text-opacity-75 text-md hover:gradient-text-bp duration-300 text-center">SAVE EDITS</p>
          </button>

          <div className="pl-3 flex flex-row border-r">
            <div className="inline-flex items-center">
              <button
                onClick={toggleDialog}
                className="inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2FABDD" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
                <p className="pl-2 pr-3 text-white text-opacity-75 text-md hover:gradient-text-pg duration-300 text-center">ADD TO TEMPLATES</p>
              </button>
              {isDialogOpen && (
                <div className="absolute backdrop-blur-md opacity-100 z-50">
                  <PrivacyOptionsDialog
                    onClose={toggleDialog}
                    onSave={handleSavePrivacyOption}
                  />
                </div>
              )}
            </div>
          </div>

          <Link href="/history" className="inline-flex items-center pl-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#C32E67" className="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>

            <p className="pl-2 text-white text-opacity-75 text-md hover:gradient-text-gb duration-300 text-center">VIEW HISTORY</p>
          </Link>
        </div>


        <div className="w-[80vw] h-[1px] bg-white bg-opacity-65"></div>

        <div className='w-[85vw] px-5'>

          <ul>
            {data != null && data.workouts.map((workout, index) => (
              <li key={index} className="border p-4 my-4 rounded-xl border-white border-opacity-40 ">
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
                    <div className="text-lg pl-2 text-white opacity-70">Weight: {getCookie('units') === 'Metric' ? poundsToKilograms(workout.Weight) : workout.Weight}</div>
                  </div>
                  <div className="col-span-1 flex flex-row items-center">
                    <Image
                      src="/animated/totalWeight.svg"
                      alt=""
                      width={45}
                      height={45}
                    />
                    <div className="text-xl text-white pl-1">Total Weight: {workout.Rep * workout.Set * (getCookie('units') === 'Metric' ? poundsToKilograms(workout.Weight) : workout.Weight)}</div>
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

export default LogFinish;

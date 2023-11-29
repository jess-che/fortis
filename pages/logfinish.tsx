import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import DefLayout from '@/components/def_layout';
import { setCookie, getCookie } from 'cookies-next';
import '@/public/styles/logfinish.css';     // style sheet for animationsi

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
          <div className="flex flex-row w-[90vw] items-end justify-between relative z-10 px-4 mb-4">
            <div className="text-4xl font-bold">
              <input
                type="text"
                className="appearance-none bg-transparent border-transparent text-white text-opacity-80"
                value={title}
                onChange={handleTitleChange}
                autoFocus
              />
            </div>
            <span className="text-2xl">
            <input
                type="text"
                className="appearance-none bg-transparent border-transparent text-white text-opacity-80"
                value={date}
                onChange={handleDate}
                autoFocus
              />
            </span>
            <span className="text-2xl mt-auto">
            <input
                type="text"
                className="appearance-none bg-transparent border-transparent text-white text-opacity-80"
                value={duration}
                onChange={handleDuration}
                autoFocus
              />
            </span>

          </div>
        ))}


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

export default LogFinish;

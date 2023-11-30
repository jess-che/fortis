'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';
import DefLayout from '@/components/def_layout';
import LoginLayout from '@/components/login_layout';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { setCookie, getCookie } from 'cookies-next';
import '@/pages/StreakGraphs.css';
import StreakGraph from '@/pages/StreakGraph'; // Adjust the path as needed
import MuscleModel from '@/pages/MuscleModel'; // Adjust the path as needed
import '@/public/styles/home.css';                              // style sheet for animations

// !! FOR DEVELOPMENT ONLY !!
setCookie('uid', 'b24e24f4-86b8-4b83-8947-b2472a43b436');
// setCookie('uid', 'neot logged in');  // <- change to this to get it to work for development first login
console.log(getCookie('uid'));

setCookie('name', 'temp name');

interface DataPoint {
  date: string;
  duration: number;
}

const Home: React.FC = () => {
  const { user, error, isLoading } = useUser();                 // auth0 login status
  let firstLogin = false;                                       // check if first time logged in

  // Declare the type of the state variable as an array of DataPoint objects
  const [parsedData, setParsedData] = useState<DataPoint[]>([]);
  const [loading, setIsLoading] = useState(false); // new state for loading indicator
  const [workoutTimeText, setWorkoutTimeText] = useState('');
  const [workoutChangeText, setWorkoutChangeText] = useState('');
  const [isPositiveChange, setIsPositiveChange] = useState(false);
  const [muscleGroups, setMuscleGroups] = useState([]);

  // ---- start of scroll effect ----
  // states to do scrolling information effect
  const [showTextBox, setShowTextBox] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(true);

  useEffect(() => {
    // This function will be called on scroll events
    const handleScroll = () => {
      if (window.scrollY > 5) {
        setShowTextBox(true);
        setShowScrollArrow(false);
      } else {
        setShowTextBox(false);
        setShowScrollArrow(true);
      }
    };

    // Add the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Dependencies for useEffect
  // ---- end of scroll effect ----

  // ---- start of API fn ----
  // get UID from email (auth0) and save to uid cookie
  const getUID = async (userEmail: any) => {
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
      setCookie('uid', data.data.rows[0].uid);
      console.log("Got UID in History: ");
      console.log(getCookie('uid'));
      window.location.reload();
      return data.data.rows[0].uid;
    }
    catch {
      await handleUserSave();
      if (user)
        await getUID(user.email);
      await handleUserDataSave();
      window.location.reload();
    }
  };

  const getName = async (uid: any) => {
    try {
      console.log(uid);

      const response = await fetch('/api/getNamefromUID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery: uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get UID from email');
      }

      const data = await response.json();
      console.log(getCookie('name'))
      setCookie('name', data.data.rows[0].name);
      return data.data.rows[0].name;
    }
    catch (err){
      console.log('Error in GetUIDfromEmail:', err);
    }
  };

  // request to save user to database
  const saveUserToDatabase = async (user: any) => {
    const response = await fetch('/api/insertAuthUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save user');
    }
  };
  const saveUserDataToDatabase = async (username: any) => {
    const response = await fetch('/api/insertUserData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: getCookie('uid'),
        // name: 'test'
        name: username
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save user data');
    }
  };
  // ---- end of API fn ----

  // ---- start of API calls ----
  // function to call to access saving user to database
  const handleUserSave = async () => {
    if (!user) {
      console.error('No user is logged in.');
      return;
    }

    try {
      await saveUserToDatabase(user);
      console.log('User saved successfully');
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };
  const handleUserDataSave = async () => {
    if (!user) {
      console.error('No user is logged in.');
      return;
    }

    try {
      await saveUserDataToDatabase(user.name);
      console.log('User saved successfully');
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };
  // ---- end of API calls ----

  // ---- start of analytics API calls ----
  // this calls analytics on mount and once user uid gets updated
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

      try {
        await Bob();
        console.log('Bobby Done');
      } catch (error) {
        console.error('Error calling Bob:', error);
      }
    };

    handleAnalStreaks();
  }, [user, loading, isLoading, error]);

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

  // Bob, just bob
  const Bob = async () => {
    try {
      const res = await fetch('api/Bob', {
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
      const muscleGroups = data.data.rows.map((row: { muscle_group: any; total_sets: string; }) => ({
        muscle_group: row.muscle_group,
        sets: parseInt(row.total_sets)
      }));

      setMuscleGroups(muscleGroups); // Update the state
      console.log(muscleGroups);
    } catch (error) {
      console.error('Error in Bob:', error);
    }
  };

  // the your workout streaks
  const AnalStreaks = async () => {
    setIsLoading(true); // Set loading to true before fetching data
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
    setIsLoading(false); // Set loading to false after fetching data
  };
  // ---- end of analytics API calls ----

  // home if no one is logged in
  if (!user) {
    return (
      // login layout so we get the login effect
      <LoginLayout>
        <div className="flex flex-col w-screen min-h-[90vh] mb-5 justify-center items-center">
          {/* default center */}
          <Image
            src="/animated/pulseLogo.svg"
            alt="Pulsing Logo"
            width={150}
            height={150}
          />

          <div className="text-7xl font-bold glow-text text-center">Fort&iacute;s</div>

          <div className="mt-7 relative">
            <Link href="/api/auth/login">
              <button className="startNow rounded-md px-2 text-xl font-bold inset-0 text-center transition hover:bg-transparent border-2 border-[#55BBA4]">
                Start Now
              </button>
            </Link>
          </div>
          {/* default center */}

          {/* scrolling effects */}
          {/* animation for . .. */}
          <style jsx>{`
              .ellipsis::after {
                content: ".";
                animation: ellipsisAnimation 3s ease-in infinite;
              }
            `}</style>

          {/* hides when scroll */}
          <div className={`${showScrollArrow ? 'block' : 'hidden'} mt-5 opacity-75`}>
            <div className="text-sm ellipsis">Scroll down</div>
          </div>

          {/* appears when scroll */}
          <div className={`${showTextBox ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-all duration-500 mt-5 text-white text-center w-[45vw]`}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat rem quidem inventore consequatur quis doloribus perspiciatis illum nam dicta tempora facilis, corporis atque. Quos beatae, laudantium dicta cupiditate pariatur doloremque?
          </div>
          {/* scrolling effects */}
        </div>
      </LoginLayout>
    );
  }

  // ---- start of auth0 logic ----
  // set whether or not it is user's first login
  if (user && user['https://cs316-fortis.vercel.app/firstLogin']) {
    firstLogin = user['https://cs316-fortis.vercel.app/firstLogin'] as boolean;
  }

  // if first login, insert into database
  if (firstLogin) {
    handleUserSave();
    getUID(user.email);
    handleUserDataSave();
  }

  // since you got here, you are logged in 
  // thus get the uid from email and set the cookies
  async function setCookies() {
    try {
      if (user != null)
        await getUID(user.email);
       await getName(getCookie('uid'));
  
    } catch (error) {
      // Handle errors here if necessary
      console.error(error);
    }
  }
  setCookies();
  // ---- end of auth0 logic ----

  return (
    <DefLayout>
      <div>
        <div className="w-[100vw] min-h-[90vh] flex flex-row items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="text-center">
              <span className='text-4xl font-bold'>Welcome {" "}{" "}</span>
              <span className='text-5xl font-bold glow-text'>{getCookie('name')}</span>
              <span className='text-4xl font-bold'>!</span>
            </div>

            <div className="w-full h-[1px] bg-white mt-5 opacity-50"></div>

            {!isLoading && parsedData.length > 0 ? (
              <StreakGraph parsedData={parsedData} />
            ) : (
              isLoading ? <p>Loading...</p> : <p>No data to display</p>
            )}

            <div className="w-full h-[1px] bg-white mb-5"></div>

            <div className="flex flex-col items-center">
              <div className="ml-2 text-2xl"> <span className='text-3xl font-bold'>Workout Time This Week: {" "}{" "}</span>
                {` ${workoutTimeText}`}
              </div>

              <div className=" mr-3">
                {workoutChangeText && (
                  <div
                    style={{
                      color: isPositiveChange ? '#55BBA4' : '#C32E67', // Replace with your desired colors
                    }}
                    className="text-xl"
                  >
                    ({isPositiveChange ? '+' : ''}{workoutChangeText} change from last week)
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            {muscleGroups.length > 0 ? (
              <MuscleModel muscleGroups={muscleGroups} />
            ) : (
              <Image
                src="/images/front_bobby/Front.svg"
                alt="Front View"
                width={400}
                height={700}
              />
            )}
          </div>
        </div>
      </div>

    </DefLayout>
  );

}

export default Home;

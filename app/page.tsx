'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';
import DefLayout from '@/components/def_layout';
import LoginLayout from '@/components/login_layout';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { setCookie, getCookie } from 'cookies-next';
import '@/public/styles/home.css';                              // style sheet for animations

// !! FOR DEVELOPMENT ONLY !!
// setCookie('uid', 'db41de11-819e-4884-804f-3791e45d2119');
// setCookie('uid', 'not logged in');  // <- change to this to get it to work for development first login
// console.log(getCookie('uid'));
// setCookie('login', 'false');

// setCookie('name', 'temp name');
// remove this (for development only)
// setCookie('units', 'Imperial');

interface DataPoint {
  date: string;
  duration: number;
}

const Home: React.FC = () => {
  const { user, error, isLoading } = useUser();                 // auth0 login status
  let firstLogin = false;                                       // check if first time logged in

  // ---- start of scroll effect ----
  // states to do scrolling information effect
  const [showTextBox, setShowTextBox] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(true);

  useEffect(() => {
    // This function will be called on scroll events
    const handleScroll = () => {
      console.log(getCookie('uid'));
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
      setCookie('login', 'true');
      console.log("Got UID in History: ");
      console.log(getCookie('uid'));
      return data.data.rows[0].uid;
    }
    catch {
      await handleUserSave();
      if (user)
        await getUID(user.email);
      await handleUserDataSave();
      setCookie('units', 'Imperial');
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
      return data.data.rows[0].name;
    }
    catch (err) {
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
            Fortís is an intuitive, simple fitness tracker that lets you log all types of workout activities. Its ease of use makes it a beloved tool for beginner, intermediate, and advanced athletes alike.
          </div>
          {/* scrolling effects */}
        </div>
      </LoginLayout>
    );
  }

  if (user) {
    setCookie('login', 'true');
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
  if (getCookie('login') === 'true') {
    setCookies();
    console.log(getCookie('uid'));
  }

  // ---- end of auth0 logic ----

  return (
    <DefLayout>
      <div>
        <div className="w-[100vw] min-h-[90vh] flex flex-col items-center justify-center pb-[20vh]">
          <div className="grid grid-cols-5 gap-2 h-[60vh] w-[95vw] justify-center">
            <div className='flex flex-col items-center justify-end'>
              <h2 className="mb-4 text-[4vw] font-bold displayheader gradient-text-bp">PROFILE</h2>
            </div>
            <div className='flex flex-col items-center justify-end'>
              <h2 className="mb-4 text-[4vw] font-bold displayheader gradient-text-pg">HISTORY</h2>
            </div>
            <div className='flex flex-col items-center justify-end'>
              <h2 className="mb-4 text-[4vw] font-bold displayheader text-[#55BBA4]">LOG</h2>
            </div>
            <div className='flex flex-col items-center justify-end'>
              <h2 className="mb-4 text-[4vw] font-bold displayheader gradient-text-gp">SOCIAL</h2>
            </div>
            <div className='flex flex-col items-center justify-end'>
              <h2 className="mb-4 text-[4vw] font-bold displayheader gradient-text-bp">DISCOVER</h2>
            </div>

            <div className="text-sm mx-2 text-center overflow-y-auto flex flex-row items-center">View or Edit User Attributes</div>
            <div className="text-sm mx-2 text-center overflow-y-auto flex flex-row items-center">View Past Workouts and Analytics</div>
            <div className="text-sm mx-2 text-center overflow-y-auto flex flex-row items-center">Log a Workout</div>
            <div className="text-sm mx-2 text-center overflow-y-auto flex flex-row items-center">Find Friends and Workout Buddies (To use friends, status must be public)</div>
            <div className="text-sm mx-2 text-center overflow-y-auto flex flex-row items-center">Find Workout Templates By Other Users</div>


            <div className="flex flex-row justify-center">
              <div className="relative">
                <div className="relative mt-8">
                  <Link href="/profile" className="profile rounded-md px-2 text-xl font-bold inset-0 text-center transition hover:bg-transparent border-2 border-[#55BBA4]">
                    Profile
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-center">
              <div className="relative">
                <div className="relative mt-8">
                  <Link href="/history" className="history rounded-md px-2 text-xl font-bold inset-0 text-center transition hover:bg-transparent border-2 border-[#2FABDD]">
                    History
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-center">
              <div className="relative">
                <div className="relative mt-8">
                  <Link href="/log" className="log rounded-md px-2 text-xl font-bold inset-0 text-center transition hover:bg-transparent border-2 border-[#C32E67]">
                    Log
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-center">
              <div className="relative">
                <div className="relative mt-8">
                  <Link href="/social" className="social rounded-md px-2 text-xl font-bold inset-0 text-center transition hover:bg-transparent border-2 border-[#2FABDD]">
                    Social
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-center">
              <div className="relative">
                <div className="relative mt-8">
                  <Link href="/discover" className="discover rounded-md px-2 text-xl font-bold inset-0 text-center transition hover:bg-transparent border-2 border-[#55BBA4]">
                    Discover
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </DefLayout>
  );

}

export default Home;

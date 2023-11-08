'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';
import DefLayout from '@/components/def_layout';
import LoginLayout from '@/components/login_layout';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { setCookie, getCookie} from 'cookies-next';
import '@/public/styles/home.css';                              // style sheet for animations

setCookie('uid', 'b24e24f4-86b8-4b83-8947-b2472a43b436');
console.log(getCookie('uid'));

const Home: React.FC = () => {
  const { user, error, isLoading } = useUser();                 // auth0 login status
  let firstLogin = false;                                       // check if first time logged in

  // states to do scrolling information effect
  const [showTextBox, setShowTextBox] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(true);

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
      return data.data.rows[0].uid;
    }
    catch {

    }
  };

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

    // Call AnalStreaks with the user's email if the user is logged in
    if (user && !isLoading && !error) {
      AnalStreaks({ email: user.email }).catch(console.error);
    }

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [user, isLoading, error]); // Dependencies for useEffect

  const AnalStreaks = async (query: any) => {
    const response = await fetch('/api/AnalStreaks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchQuery: "b24e24f4-86b8-4b83-8947-b2472a43b436"
        //query
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save query');
    }

    const data = await response.json();
    console.log(data)
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

  // get if it is there first time logging in
  if (user && user['https://cs316-fortis.vercel.app/firstLogin']) {
    firstLogin = user['https://cs316-fortis.vercel.app/firstLogin'] as boolean;
  }

  // if it is, handle th esave
  if (firstLogin) {
    handleUserSave();
  }

  getUID(user.email);

  // since you got here, you are logged in -- see this
  return (
    <DefLayout>

      <div>
        Welcome, {user.name}. This is home page.
        Your email is {user.email}.
      </div>

    </DefLayout>
  );

}

export default Home;


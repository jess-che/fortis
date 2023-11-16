import Image                    from 'next/image';
import Link                     from 'next/link';
import React, { FC }            from 'react';
import DefLayout                from '@/components/def_layout';
import { useUser }              from '@auth0/nextjs-auth0/client';
import { setCookie, getCookie } from 'cookies-next';
import { GetServerSideProps }   from 'next';

const Log2Page: React.FC<{ isLogging: boolean }> = ({ isLogging }) => {
  const addActivity = async () => {
    setCookie('log', 'true');

    try {
      const response = await fetch('/api/addActivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: getCookie('uid'),
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      // Handle the response here
    } catch (error) {
      console.error('Failed to add activity:', error);
      // Handle errors here
    }
    window.location.reload();
  };

  const toggleLogging = () => {
    // Toggle the value of 'log' cookie
    setCookie('log', isLogging ? 'false' : 'true');
    // Cause the component to re-render
    window.location.reload();
  };

  return (
    <DefLayout>
      <div className="">
        {isLogging ? (
          <button onClick={toggleLogging}>
            Stop Logging
          </button>
        ) : (
          <button onClick={addActivity}>
            Add Activity
          </button>
        )}
      </div>
    </DefLayout>
  );
}

// Makes sure serverside matches client
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Check the 'log' cookie on the server-side
  const isLogging = getCookie('log', context) === 'true';

  // Pass the value to the component as a prop
  return {
    props: {
      isLogging,
    },
  };
};

export default Log2Page;

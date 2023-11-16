import Image                    from 'next/image';
import Link                     from 'next/link';
import React, { FC }            from 'react';
import DefLayout                from '@/components/def_layout';
import { useUser }              from '@auth0/nextjs-auth0/client';
import { setCookie, getCookie}  from 'cookies-next';

const Log2Page: React.FC = () => {
  const addActivity = async () => {
    try {
      const response = await fetch('/api/addActivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: getCookie('uid'),
          // uid: "71379e91-a26a-41fe-9901-4478133052e6",
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      // Handle the response here
    } catch (error) {
      console.error('Failed to add activity:', error);
      // Handle errors here
    }
  };

  return (
    <DefLayout>
      <div className="">
        <button onClick={addActivity}>Add Activity</button>
      </div>
    </DefLayout>
  );
}

export default Log2Page;

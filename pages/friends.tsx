import '@/public/styles/friends.css';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import DefLayout from '@/components/def_layout';

import SearchBar from "./SocialSearchBarComponents/SearchBar";
// import SearchResultsList from "./SocialSearchBarComponents/SearchResultsList";
// import styleform from './WorkoutBuddyMatcher.module.css';

import styles from './WorkoutBuddy.module.css';
import { getCookie } from 'cookies-next';
import Styles from './social.module.css';


interface Person {
  uid: string;
  name: string;
  location: string;
  workoutTypes: string;
  softPreferences: string;
  frequency: string;
  gymAvailability: string;
  // Add other fields as needed
}

interface FlexiblePerson {
  uid: string;
  name: string;
  age?: number | null;
  height?: number | null;
  weight?: number | null;
  gender?: string | null;
  unit?: string;
  privacy?: string;
  about?: string;
}

interface MatchedPersonDisplayProps {
  person: Person;
}

const MatchedPersonDisplay: React.FC<MatchedPersonDisplayProps> = ({ person }) => {
  // Function to parse frequency and workout types to a more readable format
  const parseList = (listString: string) => {
    return listString.replace(/[{}"]/g, '').split(',').join(', ');
  };

  // Function to parse gym availability to a more readable format
  const parseGymAvailability = (availabilityString: string) => {
    const times = ["6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
    return availabilityString.replace(/[{}"]/g, '').split(',')
      .map((available, index) => available === 'true' ? times[index] : null)
      .filter(time => time !== null)
      .join(', ');
  };

  return (
    <div className={styles.matchedPerson}>
      <p>Name: {person.name || 'Not specified'}</p>
      <p>Location: {person.location}</p>
      <p>Frequency: {parseList(person.frequency)}</p>
      <p>Gym availability: {parseGymAvailability(person.gymAvailability)}</p>
      <p>Workout Types: {parseList(person.workoutTypes)}</p>
      <p>Soft Preferences: {person.softPreferences}</p>
      {/* Add more fields as needed */}
    </div>
  );
};

const handleFriendRequest = async (userId: string) => {
  const currentUser = getCookie('uid');

  console.log(userId);

  const endpoint = '/api/friends/deleteFriendRequest';
  const method = 'POST';
  // console.log(isFriend);
  // console.log(endpoint);
  // console.log(method);
  try {
    // console.log("Current user is ",currentUser);
    // current user works so far
    // console.log("Receing user is ",receiverUid);
    // userId gives name 

    const response = await fetch(endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        // Include any auth headers if necessary
      },
      body: JSON.stringify({ sender: currentUser, receiver: userId })
    });
    console.log(response);
  } catch (error) {
    console.error('Error handling friend request:', error);
    // Handle errors (e.g., show a notification to the user)
  }
  window.location.reload();
};

interface FlexiblePersonListProps {
  people: FlexiblePerson[];
  onAcceptFriendRequest?: (receiver: any, sender: string) => void;
  onRejectFriendRequest?: (receiver: any, sender: string) => void;
}

const FlexiblePersonList1: React.FC<FlexiblePersonListProps> = ({ people, onAcceptFriendRequest, onRejectFriendRequest }) => {
  const receiverUid = getCookie('uid');

  const [showMore, setShowMore] = useState<boolean[]>(people.map(() => false));

  const toggleShowMore = (index: number) => {
    const updatedShowMore = [...showMore];
    updatedShowMore[index] = !updatedShowMore[index];
    setShowMore(updatedShowMore);
  };

  const MAX_ABOUT_LENGTH = 50;

  return (
    <ul className="">
      {people.map((person, index) => (
        <li key={person.uid} className="border border-white p-3 rounded-md m-3 border-opacity-60  bg-white bg-opacity-5">
          <div className='flex flex-row items-center justify-between'>
            <h2 className="text-2xl font-bold  gradient-text-pb">{person.name || 'Not specified'}</h2>
            <button onClick={() => handleFriendRequest(person.uid)} className="">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </button>
          </div>

          <div className='grid grid-cols-5 gap-1'>
            <p className="col-span-1 font-bold">Age:</p>
            <p className="col-span-4">{person.age !== null ? person.age : 'Not specified'}</p>

            <p className="col-span-1 font-bold">Gender:</p>
            <p className="col-span-4">{person.age !== null ? person.gender : 'Not specified'}</p>

            <p className="col-span-1 font-bold">About:</p>
            <p className="col-span-4">
              {showMore[index] ? person.about : person.about?.slice(0, MAX_ABOUT_LENGTH) || 'Not specified'}
              {person.about && person.about.length > MAX_ABOUT_LENGTH && (
                <button onClick={() => toggleShowMore(index)} className="text-[#2FABDD] hover:underline ml-2">
                  {showMore[index] ? 'Show Less' : 'Show More'}
                </button>
              )}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

const FlexiblePersonList2: React.FC<FlexiblePersonListProps> = ({ people, onAcceptFriendRequest, onRejectFriendRequest }) => {
  const receiverUid = getCookie('uid');

  const [showMore, setShowMore] = useState<boolean[]>(people.map(() => false));

  const toggleShowMore = (index: number) => {
    const updatedShowMore = [...showMore];
    updatedShowMore[index] = !updatedShowMore[index];
    setShowMore(updatedShowMore);
  };

  const MAX_ABOUT_LENGTH = 50;

  return (
    <ul className="">
      {people.map((person, index) => (
        <li key={person.uid} className="border border-white p-3 rounded-md m-3 border-opacity-60  bg-white bg-opacity-5">
          <div className='flex flex-row items-center justify-between'>
            <h2 className="text-2xl font-bold  gradient-text-gp">{person.name || 'Not specified'}</h2>
            <button onClick={() => handleFriendRequest(person.uid)} className="">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </button>
          </div>

          <div className='grid grid-cols-5 gap-1'>
            <p className="col-span-1 font-bold">Age:</p>
            <p className="col-span-4">{person.age !== null ? person.age : 'Not specified'}</p>

            <p className="col-span-1 font-bold">Gender:</p>
            <p className="col-span-4">{person.age !== null ? person.gender : 'Not specified'}</p>

            <p className="col-span-1 font-bold">About:</p>
            <p className="col-span-4">
              {showMore[index] ? person.about : person.about?.slice(0, MAX_ABOUT_LENGTH) || 'Not specified'}
              {person.about && person.about.length > MAX_ABOUT_LENGTH && (
                <button onClick={() => toggleShowMore(index)} className="text-[#2FABDD] hover:underline ml-2">
                  {showMore[index] ? 'Show Less' : 'Show More'}
                </button>
              )}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

const FlexiblePersonList: React.FC<FlexiblePersonListProps> = ({ people, onAcceptFriendRequest, onRejectFriendRequest }) => {
  const receiverUid = getCookie('uid');

  const [showMore, setShowMore] = useState<boolean[]>(people.map(() => false));

  const toggleShowMore = (index: number) => {
    const updatedShowMore = [...showMore];
    updatedShowMore[index] = !updatedShowMore[index];
    setShowMore(updatedShowMore);
  };

  const MAX_ABOUT_LENGTH = 50;

  return (
    <ul className={styles.flexiblePersonList}>
      {people.map((person, index) => (
        <li key={person.uid} className="border border-white p-3 rounded-md m-3 border-opacity-60  bg-white bg-opacity-5">
          <h2 className="text-2xl font-bold  gradient-text-bg">{person.name || 'Not specified'}</h2>

          <div className='grid grid-cols-5 gap-1'>
            <p className="col-span-1 font-bold">Age:</p>
            <p className="col-span-4">{person.age !== null ? person.age : 'Not specified'}</p>

            <p className="col-span-1 font-bold">Gender:</p>
            <p className="col-span-4">{person.age !== null ? person.gender : 'Not specified'}</p>

            <p className="col-span-1 font-bold">About:</p>
            <p className="col-span-4">
              {showMore[index] ? person.about : person.about?.slice(0, MAX_ABOUT_LENGTH) || 'Not specified'}
              {person.about && person.about.length > MAX_ABOUT_LENGTH && (
                <button onClick={() => toggleShowMore(index)} className="text-[#2FABDD] hover:underline ml-2">
                  {showMore[index] ? 'Show Less' : 'Show More'}
                </button>
              )}
            </p>
          </div>

          <div className='items-center justify-center p-2 mt-3 flex flex-row border border-white rounded-md border-opacity-50'>
            {onAcceptFriendRequest && (
              <button onClick={() => onAcceptFriendRequest(receiverUid, person.uid)} className="inline-flex items-center border-r">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#55BBA4" className="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>


                <p className="pl-2 pr-3 text-white text-opacity-75 text-sm hover:gradient-text-bp duration-300 text-center">ACCEPT</p>
              </button>
            )}
            {onRejectFriendRequest && (
              <button onClick={() => onRejectFriendRequest(receiverUid, person.uid)} className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2FABDD" className="ml-3 w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>


                <p className="pl-2 pr-3 text-white text-opacity-75 text-sm hover:gradient-text-pg duration-300 text-center">REJECT</p>
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};


const SocialPage: React.FC = () => {
  const [showMatcherForm, setShowMatcherForm] = useState(false);
  const [matchedPersons, setMatchedPersons] = useState<Person[]>([]);


  const [friendsList, setFriendsList] = useState<FlexiblePerson[]>([]);
  const [pendingFriends, setPendingFriends] = useState<FlexiblePerson[]>([]);
  const [friendRequests, setFriendRequests] = useState<FlexiblePerson[]>([]);



  const friendslist = async (query: any) => {
    const response = await fetch('/api/friends/friendList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchQuery: getCookie('uid'),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save query');
    }

    const data = await response.json();
    console.log("Here are your friends: ", data.data);
    setFriendsList(data.data);
  };

  const friendsPending = async (query: any) => {
    const response = await fetch('/api/friends/friendPending', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchQuery: getCookie('uid'),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save query');
    }

    const data = await response.json();
    console.log("Pending friends :( ", data.data);
    setPendingFriends(data.data);
  };


  const friendLanding = async (query: any) => {
    const response = await fetch('/api/friends/friendLanding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchQuery: getCookie('uid'),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save query');
    }

    const data = await response.json();
    console.log("Here the people who have sent you a friend request: ", data.data);
    setFriendRequests(data.data);
  };


  const toggleMatcherForm = () => setShowMatcherForm(!showMatcherForm);

  useEffect(() => {
    getMatcher("monkey banana");
    friendslist("Monkey");
    friendLanding("Monkey");
    friendsPending("Monkey");
  }, []);

  const handleAcceptFriendRequest = async (receiver: any, sender: any) => {
    try {
      console.log(receiver, sender);
      const response = await fetch('/api/friends/acceptFriendRequest', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiver, sender }),
      });

      if (!response.ok) {
        throw new Error('Failed to accept friend request');
      }

      // Optionally, update your state or UI based on the successful acceptance
      console.log(`Friend request from ${sender} to ${receiver} accepted`);

      window.location.reload();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectFriendRequest = async (receiver: any, sender: any) => {
    try {
      const response = await fetch('/api/friends/deleteFriendRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiver, sender }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject friend request');
      }

      // Optionally, update your state or UI based on the successful rejection
      console.log(`Friend request from ${sender} to ${receiver} rejected`);

      window.location.reload();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };



  const getMatcher = async (query: any) => {
    const response = await fetch('/api/getMatcher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchQuery: String(getCookie('uid'))
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }

    const data = await response.json();
    console.log('API response:', data); // Log the full response
    if (data && data.data.rows) {
      setMatchedPersons(data.data.rows);
    } else {
      console.log('No rows in response'); // Log if no rows are found
    }
  };

  return (
    <DefLayout>
      <div className="flex w-screen h-[88vh] justify-center items-center">
        <div className="grid grid-cols-3 gaps-5 w-[80vw]">
          {/* My Friends List */}
          <div className="px-4">
            <h2 className="mb-4 text-4xl font-bold displayheader gradient-text-bp">My Friends</h2>
            <ul className='h-[75vh] overflow-y-auto '>
              <FlexiblePersonList1 people={friendsList} />
            </ul>
          </div>

          {/* Pending Friends List */}
          <div className="px-4">
            <h2 className="mb-4 text-4xl font-bold displayheader gradient-text-pg">Pending Friends</h2>
            <ul className='h-[75vh] overflow-y-auto '>
              <FlexiblePersonList2 people={pendingFriends} />
            </ul>
          </div>

          {/* Friend Requests List */}
          <div className="px-4">
            <h2 className="mb-4 text-4xl font-bold displayheader gradient-text-gb">Friends Request</h2>
            <ul className='h-[75vh] overflow-y-auto '>
              {Array.isArray(friendRequests) && friendRequests.map(person => (
                <li key={person.uid} className="">
                  <FlexiblePersonList
                    people={[person]}
                    onAcceptFriendRequest={handleAcceptFriendRequest}
                    onRejectFriendRequest={handleRejectFriendRequest}
                  />
                </li>
              ))}
            </ul>
          </div>

        </div>


        <div className="h-[80vh] w-[2px] mx-[1vw] bg-white bg-opacity-50"></div>

        <div className="">
          <div className="w-[15vw] mb-2">
            <SearchBar />
          </div>
        </div>
      </div>

    </DefLayout>
  );
};

export default SocialPage;



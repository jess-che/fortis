import Image          from 'next/image';
import Link           from 'next/link';
import React, { FC, useEffect, useState }  from 'react';
import DefLayout      from '@/components/def_layout';

import SearchBar from "./SocialSearchBarComponents/SearchBar";
import SearchResultsList from "./SocialSearchBarComponents/SearchResultsList";
import styleform from './WorkoutBuddyMatcher.module.css';

import Modal from './modal'; // Make sure you have this component created
import WorkoutBuddyMatcher from './WorkoutBuddyMatcher'; // This is the separate form component
import styles from './WorkoutBuddy.module.css';
import { getCookie } from 'cookies-next';
import Styles from './social.module.css';

const searchBarStyle = {
  // backgroundColor: '#aaa',
  margin: 'auto',
  width: '40%',
  display: 'flex',
  flexDirection: 'column' as 'column',
  alignItems: 'center',
  minWidth: '200px',
};

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

interface FlexiblePersonListProps {
  people: FlexiblePerson[];
}

const FlexiblePersonList: React.FC<FlexiblePersonListProps> = ({ people }) => {
  return (
    <ul className={styles.flexiblePersonList}>
      {people.map(person => (
        <li key={person.uid} className={styles.flexiblePersonItem}>
          <p>Name: {person.name || 'Not specified'}</p>
          <p>Age: {person.age !== null ? person.age : 'Not specified'}</p>
          <p>Height: {person.height !== null ? `${person.height} cm` : 'Not specified'}</p>
          <p>Weight: {person.weight !== null ? `${person.weight} kg` : 'Not specified'}</p>
          <p>Gender: {person.gender || 'Not specified'}</p>
          <p>Unit: {person.unit || 'Not specified'}</p>
          <p>Privacy: {person.privacy || 'Not specified'}</p>
          <p>About: {person.about || 'Not specified'}</p>
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
      <div className="social-page">
        <div className="search-bar-container" style={searchBarStyle}>
          <SearchBar />
        </div>
  
        <button onClick={toggleMatcherForm} className={styleform.matcherButton}>
          Matcher Form
        </button>
  
        <Modal show={showMatcherForm} onClose={toggleMatcherForm}>
          <WorkoutBuddyMatcher />
        </Modal>
  
        <div className={styles.matchedPersonsList}>
          {matchedPersons.length > 0 ? (
            <div>
              <h3>Congratulations! You've matched with:</h3>
              {matchedPersons.map(person => (
                <MatchedPersonDisplay key={person.uid} person={person} />
              ))}
            </div>
          ) : (
            <p>No matches found.</p>
          )}
        </div>
      </div>

      <div className={Styles.listsContainer}>
          {/* My Friends List */}
          <div className={Styles.listColumn}>
            <h3>My Friends</h3>
            <ul>
              {Array.isArray(friendsList) && friendsList.map(person => (
                <li key={person.uid} className={Styles.listItemBox}>
                <FlexiblePersonList people={friendsList} />
                </li>
              ))}
            </ul>
          </div>

          {/* Pending Friends List */}
          <div className={Styles.listColumn}>
            <h3>Pending Friends</h3>
            <ul>
              {Array.isArray(pendingFriends) && pendingFriends.map(person => (
                <li key={person.uid} className={Styles.listItemBox}>
                <FlexiblePersonList people={pendingFriends} />
                </li>
              ))}
            </ul>
          </div>

          {/* Friend Requests List */}
          <div className={Styles.listColumn}>
            <h3>Friend Requests</h3>
            <ul>
              {Array.isArray(friendRequests) && friendRequests.map(person => (
                <li key={person.uid} className={Styles.listItemBox}>
                <FlexiblePersonList people={friendRequests} />
                </li>
              ))}
            </ul>
          </div>
        </div>

    </DefLayout>
  );
};

export default SocialPage;



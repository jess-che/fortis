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
  // Add other fields as needed
}

interface MatchedPersonDisplayProps {
  person: Person;
}

const MatchedPersonDisplay: React.FC<MatchedPersonDisplayProps> = ({ person }) => {
  return (
    <div className={styles.matchedPerson}>
      <p>Name: {person.name || 'Not specified'}</p>
      <p>Location: {person.location}</p>
      <p>Workout Types: {person.workoutTypes}</p>
      <p>Soft Preferences: {person.softPreferences}</p>
      {/* Add more fields as needed */}
    </div>
  );
};


const SocialPage: React.FC = () => {
  const [showMatcherForm, setShowMatcherForm] = useState(false);
  const [matchedPersons, setMatchedPersons] = useState<Person[]>([]);


  const toggleMatcherForm = () => setShowMatcherForm(!showMatcherForm);

  useEffect(() => {
    getMatcher("monkey banana");
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
    if (data && data.rows) {
      setMatchedPersons(data.rows);
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
    </DefLayout>
  );
};

export default SocialPage;



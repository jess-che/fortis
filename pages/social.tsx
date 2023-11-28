import Image          from 'next/image';
import Link           from 'next/link';
import React, { FC, useState }  from 'react';
import DefLayout      from '@/components/def_layout';

import SearchBar from "./SocialSearchBarComponents/SearchBar";
import SearchResultsList from "./SocialSearchBarComponents/SearchResultsList";
import styleform from './WorkoutBuddyMatcher.module.css';

import Modal from './modal'; // Make sure you have this component created
import WorkoutBuddyMatcher from './WorkoutBuddyMatcher'; // This is the separate form component
import styles from './App.module.css'; // Your main styles




const searchBarStyle = {
  // backgroundColor: '#aaa',
  margin: 'auto',
  width: '40%',
  display: 'flex',
  flexDirection: 'column' as 'column',
  alignItems: 'center',
  minWidth: '200px',
};


const SocialPage: React.FC = () => {
  const [showMatcherForm, setShowMatcherForm] = useState(false);

  const toggleMatcherForm = () => setShowMatcherForm(!showMatcherForm);

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
      </div>
    </DefLayout>
  );
};

export default SocialPage;



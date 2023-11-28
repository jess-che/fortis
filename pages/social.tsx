import Image          from 'next/image';
import Link           from 'next/link';
import React, { FC, useState }  from 'react';
import DefLayout      from '@/components/def_layout';

import SearchBar from "./SocialSearchBarComponents/SearchBar";
import SearchResultsList from "./SocialSearchBarComponents/SearchResultsList";
import styles from './WorkoutBuddyMatcher.module.css';




// const searchBarStyle = {
//   // backgroundColor: '#aaa',
//   margin: 'auto',
//   width: '40%',
//   display: 'flex',
//   flexDirection: 'column' as 'column',
//   alignItems: 'center',
//   minWidth: '200px',
// };

const timeSlots = Array.from({ length: 32 }, (_, index) => `${Math.floor(index / 2) + 6}:${index % 2 === 0 ? '00' : '30'}`);

interface FormData {
  gymTime: string;
  workoutTypes: string[]; // Specify as string array
  location: string;
  frequency: string;
  genderPreference: string;
  gymAvailability: any[];
}

const WorkoutBuddyMatcher = () => {
  const [formData, setFormData] = useState<FormData>({
    gymTime: '',
    workoutTypes: [],
    location: '',
    frequency: '',
    genderPreference: '',
    gymAvailability: Array(timeSlots.length).fill(false) // Initialize all times as unavailable

  });

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleTimeSlotToggle = (index: number) => {
    setFormData(prevState => ({
      ...prevState,
      gymAvailability: prevState.gymAvailability.map((slot, i) => i === index ? !slot : slot),
    }));
  };

  const handleMultiSelectChange = (e: { target: { options: any; }; }) => {
    const { options } = e.target;
    const value: any[] = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setFormData(prevState => ({
      ...prevState,
      workoutTypes: value
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Process the form data
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.formGroup}>
        <label className={styles.label}>Gym Time:</label>
        <div className={styles.timeGrid}>
          {timeSlots.map((time, index) => (
            <button
              type="button"
              key={time}
              className={`${styles.timeSlot} ${formData.gymAvailability[index] ? styles.selected : ''}`}
              onClick={() => handleTimeSlotToggle(index)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Workout Types:</label>
        <select
          multiple
          name="workoutTypes"
          onChange={handleMultiSelectChange}
          className={styles.select}
        >
          <option value="climbing">Climbing</option>
          <option value="push">Push</option>
          <option value="pull">Pull</option>
          <option value="legs">Legs</option>
          <option value="swimming">Swimming</option>
          <option value="hiking">Hiking</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Location (Gym):</label>
        <input
          type="text"
          name="location"
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Frequency:</label>
        <input
          type="text"
          name="frequency"
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Gender Preference:</label>
        <select
          name="genderPreference"
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="any">Any</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </div>
    </form>
  );
};


const SocialPage = () => {
  return (
    <DefLayout>
      <div className="social-page">
        <WorkoutBuddyMatcher />
      </div>
    </DefLayout>
  );
};

export default SocialPage;
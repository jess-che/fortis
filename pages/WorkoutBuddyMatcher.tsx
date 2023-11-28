import Image          from 'next/image';
import Link           from 'next/link';
import React, { FC, useState }  from 'react';
import DefLayout      from '@/components/def_layout';

import SearchBar from "./SocialSearchBarComponents/SearchBar";
import SearchResultsList from "./SocialSearchBarComponents/SearchResultsList";
import styles from './WorkoutBuddyMatcher.module.css';

const timeSlots = Array.from({ length: 17 }, (_, index) => `${index + 6}:00`); // 6:00 to 22:00
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface FormData {
  gymTime: string;
  workoutTypes: string[]; // Specify as string array
  location: string;
  frequency: string[];
  genderPreference: string;
  gymAvailability: boolean[];
}

const WorkoutBuddyMatcher = () => {
  const [formData, setFormData] = useState<FormData>({
    gymTime: '',
    workoutTypes: [],
    location: '',
    frequency: [],
    genderPreference: '',
    gymAvailability: Array(timeSlots.length).fill(false)
  });

  const handleDayToggle = (day: string) => {
    setFormData(prevState => ({
      ...prevState,
      frequency: prevState.frequency.includes(day) 
        ? prevState.frequency.filter(d => d !== day) 
        : [...prevState.frequency, day],
    }));
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process the form data
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Location (Gym):</label>
        <select
          name="location"
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="">Select a gym</option>
          <option value="Brodie">Brodie</option>
          <option value="Wilson">Wilson</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Frequency:</label>
        <div className={styles.daysGrid}>
          {daysOfWeek.map(day => (
            <button
              type="button"
              key={day}
              className={`${styles.dayButton} ${formData.frequency.includes(day) ? styles.selected : ''}`}
              onClick={() => handleDayToggle(day)}
            >
              {day.substring(0, 3)} {/* Display only the first three letters of the day */}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Usual times:</label>
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
        <label className={styles.label}>Workout Types (select multiple):</label>
        <select
          multiple
          name="workoutTypes"
          onChange={handleMultiSelectChange}
          className={styles.select}
          size={6} // Optional: Sets the visible number of options in a drop-down list
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

export default WorkoutBuddyMatcher;

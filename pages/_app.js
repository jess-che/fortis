import '@/app/globals.css';
import { UserProvider } from "@auth0/nextjs-auth0/client";
import React, { useState } from 'react';
import ExerciseContext from './ExerciseContext';

export default function MyApp({ Component, pageProps }) {
  const [selectedExercise, setSelectedExercise] = useState(null);

  return (
    <ExerciseContext.Provider value={{ selectedExercise, setSelectedExercise }}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ExerciseContext.Provider>
  );
}

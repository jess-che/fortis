import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const MuscleModel = ({ muscleGroups }) => {
  const [view, setView] = useState('front');          // 'front' or 'back' view

  // fail safe check
  if (!muscleGroups || muscleGroups.length === 0) {
    return <p>No muscle group data available.</p>;
  }

  // opacity based on set time
  const getOpacityForSets = (sets) => {
    // Define the MAX_SETS for each interval
    const MAX_SETS_1_4 = 4;
    const MAX_SETS_4_12 = 12;
    const MAX_SETS_12_20 = 20;
    const MAX_SETS_20_28 = 28;

    // If there are no sets, the opacity is 0
    if (sets === 0) {
      return 0;
    }

    // 1-4 = .1 - .2 opacity
    if (sets >= 1 && sets <= MAX_SETS_1_4) {
      return 0.1 + (sets - 1) * (0.2 - 0.1) / (MAX_SETS_1_4 - 1);
    }

    // 4-12 = .3-.5 opacity
    if (sets > MAX_SETS_1_4 && sets <= MAX_SETS_4_12) {
      return 0.3 + (sets - MAX_SETS_1_4) * (0.5 - 0.3) / (MAX_SETS_4_12 - MAX_SETS_1_4);
    }

    // 12-20 = .55-.75 opacity
    if (sets > MAX_SETS_4_12 && sets <= MAX_SETS_12_20) {
      return 0.55 + (sets - MAX_SETS_4_12) * (0.75 - 0.55) / (MAX_SETS_12_20 - MAX_SETS_4_12);
    }

    // 20-28 = .8-1 opacity
    if (sets > MAX_SETS_12_20 && sets <= MAX_SETS_20_28) {
      return 0.8 + (sets - MAX_SETS_12_20) * (1 - 0.8) / (MAX_SETS_20_28 - MAX_SETS_12_20);
    }

    // If sets is out of the specified range
    return 1;
  };

  return (
    <div className="flex flex-row items-center">
      {/* model (front view) */}
      {view === 'front' && (
        <div className="relative">
          {/* default man */}
          <Image
            src="/images/front_bobby/Front.svg"
            alt="Front View"
            width={400}
            height={700}
          />
          {/* Render front muscle groups with correct opacity */}
          {muscleGroups.map((group, index) => {
            const imageOpacity = getOpacityForSets(group.sets);
            const imageSrc = `/images/front_bobby/Front_${group.muscle_group}.svg`;

            return (
              <Image
                key={index}
                className="absolute top-0 left-0"
                style={{ opacity: imageOpacity }}
                src={imageSrc}
                alt={group.muscle_group}
                width={400}
                height={700}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            );
          })}
        </div>
      )}
      {/* model (back view) */}
      {view === 'back' && (
        <div className="relative">
          <Image
            src="/images/back_bobby/Back.svg"
            alt="Back View"
            width={400}
            height={700}
          />
          {/* Render front muscle groups with correct opacity */}
          {muscleGroups.map((group, index) => {
            const imageOpacity = getOpacityForSets(group.sets);
            const imageSrc = `/images/back_bobby/Back_${group.muscle_group}.svg`;

            return (
              <Image
                key={index}
                className="absolute top-0 left-0"
                style={{ opacity: imageOpacity }}
                src={imageSrc}
                alt={group.muscle_group}
                width={400}
                height={700}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            );
          })}
        </div>
      )}

      {/* legend + flip */}
      <div className="flex flex-col">
        {/* legend */}
        {muscleGroups.map((group, index) => (
          <div
            className="flex flex-row items-center pt-2"
            key={index}
          >
            <div className="w-4 h-4 rounded-full bg-[#C32E67] mr-2 border border-white border-opacity-50" style={{ opacity: getOpacityForSets(group.sets) }} />
            <div>
              <div className="text-sm font-medium">{group.muscle_group}</div>
              <div className="text-xs">Sets: {group.sets}</div>
            </div>
          </div>
        ))}

        {/* flip front or back view */}
        <div className="flex justify-center mt-4">
          {view === 'front' ? (
            <div
              className="cursor-pointer hover:opacity-75"
              onClick={() => setView('back')}
            >
              <Image
                src="/images/Flip_Back.svg" // Path to the back view image
                alt="Back View"
                width={80}
                height={40}
              />
            </div>
          ) : (
            <div
              className="cursor-pointer hover:opacity-75"
              onClick={() => setView('front')}
            >
              <Image
                src="/images/Flip_Front.svg" // Path to the front view image
                alt="Front View"
                width={80}
                height={40}
              />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default MuscleModel;

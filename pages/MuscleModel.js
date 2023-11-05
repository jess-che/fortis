import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const MAX_SETS = 20; // Maximum number of sets for full color intensity

const MuscleModel = ({ muscleGroups }) => {
  if (!muscleGroups || muscleGroups.length === 0) {
    return <p>No muscle group data available.</p>;
  }

  const getColorForSets = (sets) => {
    const intensity = Math.min(sets / MAX_SETS, 1);
    const colorIntensity = Math.floor(255 * intensity);
    return `rgb(${colorIntensity}, 0, 0)`;
  };

  const getOpacityForSets = (sets) => {
    // If there are no sets, the opacity is 0
    if (sets === 0) {
      return 0;
    }

    // Normalize sets value from 0 to 1, but consider the range only starts at 0.2 for sets of 1
    const normalized = (sets - 1) / (MAX_SETS - 1);

    // Scale the normalized value to range from 0.2 to 1
    return 0.2 + normalized * 0.8;
  };

  return (
    <div className="flex flex-row items-center">
      <div className="relative">
        <Image
          src="/images/front_bobby/Front.svg"
          alt=""
          width={400}
          height={700}
        />
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
              onError={(e) => { e.target.style.display = 'none'; }} // Hides the image if it fails to load
            />
          );
        })}
      </div>


      <div className="flex flex-col">
        {muscleGroups.map((group, index) => (
          <div
            className="flex flex-row items-center pt-2"
            key={index}
          >
            <div className="w-4 h-4 rounded-full bg-[#55BBA4] mr-2 border border-white border-opacity-50" style={{ opacity: getOpacityForSets(group.sets) }} />
            <div>
              <div className="text-sm font-medium">{group.muscle_group}</div>
              <div className="text-xs">Sets: {group.sets}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default MuscleModel;

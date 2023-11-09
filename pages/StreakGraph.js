import React from 'react';
import './StreakGraphs.css';

const StreakGraph = ({ parsedData }) => {
  // what to display if no data available
  if (!Array.isArray(parsedData)) {
    return <div>No data available</div>;
  }

  // get the returned date
  const dataMap = new Map(
    parsedData.map(({ date, duration }) => [new Date(date).toISOString().split('T')[0], duration])
  );

  // set the start date to be 21 from today (so show 3 full weeks and then extra)
  const today = new Date(); // Get today's date
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDate.getDay() - 21);

  // Create an array of dates for the last 4 weeks up until today
  const daysArray = Array.from({ length: 28 }, (_, index) => {
    const date = new Date(startDate);       // start from start date
    date.setDate(date.getDate() + index);   // then go up by index
    return date;
  }).filter(date => date <= today);

  // get last two digits of datekey
  function getDayFromDateKey(dateKey) {
    return dateKey.substring(dateKey.length - 2);
  }

  return (
    <div className="p-5 rounded-xl max-w-[75vw]">
      <div className="text-center text-3xl font-bold mb-3">Your Workout Streaks</div>
      <div className="grid grid-cols-7 grid-rows-4 gap-1 justify-center">
        {/* mapped workout calendar */}
        {daysArray.map((date, index) => {
          // get the date
          const dateKey = date.toISOString().split('T')[0];
          // find duration based on date
          const duration = dataMap.get(dateKey) || 0;

          // calculate color from duration
          const intensity = Math.min(1, duration / 60);
          const colorIntensity = Math.floor((1 - intensity) * 255);
          const factor = colorIntensity / 255;
          const red = Math.round(47 * (1 - factor));
          const green = Math.round(171 * (1 - factor));
          const blue = Math.round(221 * (1 - factor));
          const color = `rgb(${red}, ${green}, ${blue})`;

          return (
            <div key={dateKey} className="day-box min-w-[6vw] min-h-[6vh] rounded-md relative flex flex-row items-center justify-center border border-white border-opacity-50" style={{ backgroundColor: color }}>
              <div className="relative inline-block">
                <div className="tooltiptext">Date: {dateKey}, <br />  Duration: {duration} minutes</div>
                <div className="text-xl">{getDayFromDateKey(dateKey)}</div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* legend */}
      <div className="flex flex-row justify-center mt-3">
        <div className="inline-block w-8 h-5 border border-white mr-1" style={{ backgroundColor: 'rgb(0, 0, 0)' }}></div>0 m
        <div className="inline-block w-8 h-5 border border-whitem ml-3 mr-1" style={{ backgroundColor: 'rgb(16, 57, 74)' }}></div>1-30 m
        <div className="inline-block w-8 h-5 border border-whitem ml-3 mr-1" style={{ backgroundColor: 'rgb(31, 114, 147)' }}></div>30-60 m
        <div className="inline-block w-8 h-5 border border-white ml-3 mr-1" style={{ backgroundColor: 'rgb(47, 171, 221)' }}></div>60+ m
      </div>
    </div>
  );
};

export default StreakGraph;

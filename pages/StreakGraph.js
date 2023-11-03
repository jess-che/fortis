import React from 'react';
import './StreakGraphs.css';

const StreakGraph = ({ parsedData }) => {
  if (!Array.isArray(parsedData)) {
    return <div>No data available</div>;
  }

  const dataMap = new Map(
    parsedData.map(({ date, duration }) => [new Date(date).toISOString().split('T')[0], duration])
  );

  const today = new Date(); // Get today's date
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDate.getDay() - 21);

  // Create an array of dates for the last 4 weeks up until today
  const daysArray = Array.from({ length: 28 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    return date;
  }).filter(date => date <= today);

  return (
    <div className="streak-graph-container">
      <h2 className="title">Your Workout Streaks</h2>
      <div className="streak-graph">
        {daysArray.map((date, index) => {
          const dateKey = date.toISOString().split('T')[0];
          const duration = dataMap.get(dateKey) || 0;
          const intensity = Math.min(1, duration / 60);
          const colorIntensity = Math.floor((1 - intensity) * 255);
          const color = `rgb(0, 0, ${255 - colorIntensity})`;
          return (
            <div key={dateKey} className="day-box" style={{ backgroundColor: color }}>
              <div className="tooltip">
                <span className="tooltiptext">Date: {dateKey}, <br />  Duration: {duration} minutes</span>
                <span className="day-label">{date.getDate()}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="legend">
        <span style={{ backgroundColor: 'rgb(0, 0, 0)' }}></span>0 minutes
        <span style={{ backgroundColor: 'rgb(0, 0, 128)' }}></span>1-29 minutes
        <span style={{ backgroundColor: 'rgb(0, 0, 192)' }}></span>30-59 minutes
        <span style={{ backgroundColor: 'rgb(0, 0, 255)' }}></span>60+ minutes
      </div>
    </div>
  );
};

export default StreakGraph;

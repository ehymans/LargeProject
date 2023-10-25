import React, { useState, useEffect } from 'react';
import './CircularProgressBar.css';

function CircularProgressBar() {
  const [counter, setCounter] = useState(0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (counter / 100) * circumference;

  useEffect(() => {
    const interval = setInterval(() => {
      if (counter < 100) {
        setCounter(prevCounter => prevCounter + 1);  // Increment the counter
      } else {
        clearInterval(interval);  // Clear interval when counter reaches 100
      }
    }, 30);

    return () => clearInterval(interval);  // clear the interval when the component is unmounted
  }, [counter]);  // Add counter to the dependency array

  return (
    <div className="skill">
      <div className="outer">
        <div className="inner">
          <div>{counter}%</div>  {/* Directly use state value here */}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
          <defs>
            <linearGradient id="GradientColor">
              <stop offset="0%" stop-color="#e91e63" />
              <stop offset="100%" stop-color="#673ab7" />
            </linearGradient>
          </defs>
          <circle 
            cx="80" 
            cy="80" 
            r={radius} 
            stroke-linecap="round"
            stroke-width="10" 
            stroke="url(#GradientColor)"
            fill="none"
            stroke-dasharray={circumference}
            stroke-dashoffset={offset}  // Use the offset value calculated above
          />
        </svg>
      </div>
    </div>
  );
}

export default CircularProgressBar;

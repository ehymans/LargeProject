import React, { useState, useEffect } from 'react';
import '../styles/CircularProgressBar.css';

function CircularProgressBar({ progress }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  //const [counter, setCounter] = useState(progress); // Initialize with passed progress
  const [counter, setCounter] = useState(0); // Initialize counter at 0
  const offset = circumference - (counter / 100) * circumference;

  useEffect(() => {
    // Animate counter to the new progress value
    let animationFrameId;
    
    const animateProgress = () => {
      setCounter((prevCounter) => {
        if (prevCounter < progress) {
          animationFrameId = requestAnimationFrame(animateProgress);
          return prevCounter + 1; // This controls the speed of the animation
        } else {
          return progress; // When it reaches the progress, stop the animation
        }
      });
    };

    animateProgress();
    
    // Clean up the animation frame
    return () => cancelAnimationFrame(animationFrameId);
  }, [progress]);

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
            stroke="#eee"  // A light color for the base outline
            fill="none"
            stroke-dasharray={circumference}
          />
          <circle 
            cx="80" 
            cy="80" 
            r={radius} 
            stroke-linecap="round"
            stroke-width="10" 
            stroke="url(#GradientColor)"
            fill="none"
            stroke-dasharray={circumference}
            stroke-dashoffset={offset}
          />
        </svg>
      </div>
    </div>
  );
}

export default CircularProgressBar;

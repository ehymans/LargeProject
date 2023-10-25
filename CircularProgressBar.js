import React, { useEffect } from 'react';
import './CircularProgressBar.css';

function CircularProgressBar() {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let number = document.getElementById("number");
    let circle = document.getElementById("progressCircle");
    let counter = 0;

    const interval = setInterval(() => {
      if (counter === 100) {
        clearInterval(interval);
      } else {
        counter += 1;
        let offset = circumference - (counter / 100) * circumference;
        circle.setAttribute("stroke-dashoffset", offset);
        number.innerHTML = counter + "%";
      }
    }, 30);
  }, [circumference]);

  return (
    <div className="skill">
      <div className="outer">
        <div className="inner">
          <div id="number"></div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
          <defs>
            <linearGradient id="GradientColor">
              <stop offset="0%" stop-color="#e91e63" />
              <stop offset="100%" stop-color="#673ab7" />
            </linearGradient>
          </defs>
          <circle 
            id="progressCircle"
            cx="80" 
            cy="80" 
            r="70" 
            stroke-linecap="round"
            stroke-width="10" 
            stroke="url(#GradientColor)"
            fill="none"
            stroke-dasharray={circumference}
            stroke-dashoffset={circumference}
          />
        </svg>
      </div>
    </div>
  );
}

export default CircularProgressBar;


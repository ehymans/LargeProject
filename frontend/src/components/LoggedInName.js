import React, { useState, useEffect } from 'react';
import './HomePage.css';
import CircularProgressBar from './CircularProgressBar';

function LoggedInName() {
  const [user, setUser] = useState({});
  const [progress, setProgress] = useState(0); // Add progress state

  useEffect(() => {
    let _ud = localStorage.getItem('user_data');
    if (_ud) {
      let ud = JSON.parse(_ud);
      setUser(ud);
    }
  }, []);

  const addExperience = () => {
    // Ollie.
    setProgress(progress + 10);
  };

  const addTask = () => {
    // Julian.
  };

  return (
<CircularProgressBar />



  );
}

export default LoggedInName;

import React, { useState, useEffect } from 'react';
import './HomePage.css';

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

  const doLogout = event => {
    event.preventDefault();
    localStorage.removeItem('user_data');
    window.location.href = '/';
    alert('Logged out successfully');
  };

  const addExperience = () => {
    // Update progress here
    setProgress(progress + 10);
  };

  const addTask = () => {
    // Add your task-related code here
  };

  return (
    <div id="loggedInDiv">
      <span id="userName">{user.name}</span>
      {/* <CircularProgressBar /> */}
      <button type="button" id="addExp" className="buttons" onClick={addExperience}>
        Add Exp
      </button>
      <button type="button" id="addTask" className="buttons" onClick={addTask}>
        Add Task
      </button>
    </div>

  );
}

export default LoggedInName;

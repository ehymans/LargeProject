import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext'; // Adjust the path as necessary
import '../styles/HomeHeader.css';

function HomeHeader() {
  const [user, setUser] = useState({});
  const [tasks, setTasks] = useState([]);
  const { logout } = useContext(AuthContext); // Using AuthContext

  useEffect(() => {
    let _ud = localStorage.getItem('user_data');
    let ud = {};
    if (_ud) {
      ud = JSON.parse(_ud);
      setUser(ud);
    }
    
    // Fetch the tasks data
    async function fetchTasks() {
      try {
        const response = await fetch('/api/path-to-tasks', { // Use the correct path to your tasks API
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ud.token}`, // Adjust if you use different auth headers
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTasks(data.tasks); // Adjust if your API returns the tasks differently
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    }

    fetchTasks();
  }, []);

  const doLogout = (event) => {
    event.preventDefault();
    logout(); // Clear the token using AuthContext
    localStorage.removeItem('user_data'); // Clear the user data upon logout
    window.location.href = '/'; // Redirect to the login page
    alert('Logged out successfully');
  };

  // Count the tasks
  const tasksInProgress = tasks.filter(task => !task.TaskCompleted).length;
  const tasksCompleted = tasks.filter(task => task.TaskCompleted).length;

  return (
    <div className="home-header">
      <div className='title'>Dare2Do - Welcome {user.firstName}!</div>
      <div>
        <div>Tasks In Progress: {tasksInProgress}</div>
        <div>Tasks Completed: {tasksCompleted}</div>
      </div>
      <div className="btn-div">
        <button className='btn' onClick={doLogout}>Logout</button>
      </div>
    </div>
  );
}

export default HomeHeader;

// Previous stable version of HomeHeader.js - 11/15/23 - prior to Tasks in progress / Tasks completed - EWH
/*
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext'; // Adjust the path as necessary
import '../styles/HomeHeader.css';

function HomeHeader() {
  const [user, setUser] = useState({});
  const { logout } = useContext(AuthContext); // Using AuthContext

  useEffect(() => {
    let _ud = localStorage.getItem('user_data');
    if (_ud) {
      let ud = JSON.parse(_ud);
      setUser(ud);
    }
  }, []);

  const doLogout = (event) => {
    event.preventDefault();
    logout(); // Clear the token using AuthContext
    localStorage.removeItem('user_data'); // Clear the user data upon logout
    window.location.href = '/'; // Redirect to the login page
    alert('Logged out successfully');
  };

  const addExperience = () => {
    // For you to do Ollie.
    alert('Add this endpoint - Julian');
  };

  return (
    <div className="home-header">
      <div className='title'>Dare2Do - Welcome {user.firstName}!</div>
      <div className="btn-div">
        <button className='btn' onClick={doLogout}>Logout</button>
      </div>
    </div>
  );
}

export default HomeHeader;
*/
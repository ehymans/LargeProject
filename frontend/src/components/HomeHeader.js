import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext'; 
import CircularProgressBar from './CircularProgressBar';
import '../styles/HomeHeader.css';

function HomeHeader({ tasksInProgress, tasksCompleted }) {
  const [user, setUser] = useState({});

  const [level, setLevel] = useState(parseInt(localStorage.getItem('user_level'), 10) || 0);
  const [progress, setProgress] = useState(parseFloat(localStorage.getItem('user_progress')) || 0);

  const [levelDescription, setLevelDescription] = useState('');

  //console.log('initial level/progress:');  
  //console.log(level);   
  //console.log(progress);

  const { logout } = useContext(AuthContext); // Using AuthContext


  useEffect(() => {
    
    //console.log('useEffect called');

    let _ud = localStorage.getItem('user_data');
    let ud = JSON.parse(_ud || '{}');
    setUser(ud);

    // Fetch initial tasks data
    async function fetchTasks() 
    {
      try 
      {
        const response = await fetch('/api/usertasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ud.token}`,
          },
          body: JSON.stringify({ userId: ud.id }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        //setTasksInProgress(data.tasksInProgress);
        //setTasksCompleted(data.tasksCompleted);
        //console.log('API called L53');
        //console.log('api result:', data.tasksInProgress);
        //console.log('api result:', data.tasksCompleted);
      if (data) {
        const newLevel = calculateLevel(data.tasksInProgress, data.tasksCompleted);
        const newProgress = calculateProgress(data.tasksInProgress, data.tasksCompleted, newLevel);
        setLevel(newLevel);
        setProgress(newProgress);
        //console.log('within if(data)');
        //console.log('initial lvl:', newLevel);
        //console.log('initial prog:', newProgress);
        if (tasksInProgress !== null && tasksCompleted !== null) 
        {
          //console.log('updateLevelAndProgress useEffect call');   // debug
          //console.log(tasksInProgress);   // debug  
          //console.log(tasksCompleted);    // debug
          updateLevelAndProgress();
        }
      }

      }  
      catch (error) 
      {
        console.error('There was a problem with the fetch operation:', error);
      }
    }

    fetchTasks();

  }, []);

  const doLogout = (event) => {
    event.preventDefault();
      // Save current state before logging out
    //localStorage.setItem('user_level', level);
    //localStorage.setItem('user_progress', progress);
    logout(); // Clear the token using AuthContext
    localStorage.removeItem('user_data'); // Clear user data upon logout
    localStorage.removeItem('user_level'); // Clear user level
    localStorage.removeItem('user_progress'); // Clear user progress
    window.location.href = '/'; // Redirect to login page
  };


  const updateLevelAndProgress = () => {
    const newLevel = calculateLevel(tasksInProgress, tasksCompleted);
    const newProgress = calculateProgress(tasksInProgress, tasksCompleted, newLevel);

    if (level !== newLevel) {
      setProgress(100); // Set to 100% momentarily

      setTimeout(() => {
        setLevelAndProgress(newLevel, 0); // Reset to 0% for the new level
      }, 1000);
    } else {
      setLevelAndProgress(level, newProgress); // Update progress for the current level
    }
    //console.log('New level:', newLevel);
    //console.log('New progress:', newProgress);
  };

  const setLevelAndProgress = (newLevel, newProgress) => {
    setLevel(newLevel);
    setProgress(newProgress);
    localStorage.setItem('user_level', newLevel);
    localStorage.setItem('user_progress', newProgress);
  };

// Add a new useEffect hook that will update the level description whenever the level changes
useEffect(() => {
  let description = '';
  switch (level) {
    case 0:
      description = 'Level 0: Add a new task to get started!';
      break;
    case 1:
      description = 'Level 1: Complete 2 tasks to reach the next level!';
      break;
    case 2:
      description = 'Level 2: Complete 5 tasks to advance!';
      break;
    case 3:
      description = 'Level 3: Complete 10 tasks! Keep it up!';
      break;
    case 4:
      description = 'Level 4: Complete 20 tasks!';
      break;
    case 5:
      description = 'Level 5: Congratulations, you are a Dare2Doer!'
    default:
      description = `Level ${level}`;
  }
  setLevelDescription(description);
}, [level]);

  useEffect(() => {
    // Call this function whenever tasksInProgress or tasksCompleted changes
    //console.log('updateLevelAndProgress useEffect call');

    //console.log(tasksInProgress);   // debug  
    //console.log(tasksCompleted);    // debug

    if (tasksInProgress !== null && tasksCompleted !== null) 
    {
      //console.log('updateLevelAndProgress useEffect call 2');   // debug
      //console.log(tasksInProgress);   // debug  
      //console.log(tasksCompleted);    // debug
      updateLevelAndProgress();
    }
  }, [tasksInProgress, tasksCompleted]);


  function calculateLevel(tasksInProgress, tasksCompleted) {
    // Level 0 to 1: 1 task in progress, 0 completed
    if (tasksInProgress >= 1 && tasksCompleted === 0) return 1;
      
    // Level 1 to 2: 2 tasks completed
    if (tasksCompleted >= 2 && tasksCompleted < 5) return 2;
  
    // Level 2 to 3: 5 total tasks completed
    if (tasksCompleted >= 5 && tasksCompleted < 10) return 3;
  
    // Level 3: 10 total tasks completed
    if (tasksCompleted >= 10) return 4;

    // Level 4: 20 total tasks completed
    if (tasksCompleted >= 20) return 5;
  
    return level;
  }
  
  
  function calculateProgress(tasksInProgress, tasksCompleted, level) {
    let progress = 0;
  
    switch(level) {
      case 0:
        // 100% if at least one task is in progress
        progress = tasksInProgress > 0 ? 100 : 0;
        break;
      case 1:
        // Calculate progress based on tasks completed out of 2 required
        progress = (tasksCompleted / 2) * 100;
        break;
      case 2:
        // Calculate progress based on tasks completed out of 5 total
        progress = ((tasksCompleted - 2) / 3) * 100;
        break;
      case 3:
        progress = ((tasksCompleted - 5) / 5) * 100;
        break;
      case 4:
        progress = ((tasksCompleted - 10) / 10) * 100;
        break;
      default:
        progress = 0;
    }
  
    //return Math.min(100, progress); // Ensure progress doesn't exceed 100%
    return parseFloat(progress.toFixed(1)); // Format to one decimal place and convert back to a number
  }

  return (
    <div className="home-header">
      <div className="left-section">
        <CircularProgressBar progress={progress} />
      </div>
      <div className="center-section">
        <div className='title'>Dare2Do - Welcome {user.firstName}!</div>
        <div className='task-info'>
          <div>Tasks In Progress: {tasksInProgress}</div>
          <div>Tasks Completed: {tasksCompleted}</div>
          <div className='level-info'>{levelDescription}</div> {/* New div for level indication */}
        </div>
      </div>
      <div className="btn-div">
        <button className='btn' onClick={doLogout}>Logout</button>
      </div>
    </div>
  );
}

export default HomeHeader;
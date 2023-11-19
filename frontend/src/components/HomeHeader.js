import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext'; 
import CircularProgressBar from './CircularProgressBar';
import '../styles/HomeHeader.css';

function HomeHeader() {
  const [user, setUser] = useState({});
  const [tasksInProgress, setTasksInProgress] = useState(null);
  const [tasksCompleted, setTasksCompleted] = useState(null);

  const [level, setLevel] = useState(0); // State for user level
  const [progress, setProgress] = useState(0); // State for progress

  const { logout } = useContext(AuthContext); // Using AuthContext


  useEffect(() => {
    let _ud = localStorage.getItem('user_data');
    let ud = JSON.parse(_ud || '{}');
    setUser(ud);

    // Initialize level and progress from localStorage
    //const savedLevel = parseInt(localStorage.getItem('user_level'), 10) || 0;
    //const savedProgress = parseFloat(localStorage.getItem('user_progress')) || 0;
    //setLevel(savedLevel);
    //setProgress(savedProgress);

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
        setTasksInProgress(data.tasksInProgress);
        setTasksCompleted(data.tasksCompleted);

      if (data) {
        const newLevel = calculateLevel(data.tasksInProgress, data.tasksCompleted);
        const newProgress = calculateProgress(data.tasksInProgress, data.tasksCompleted, newLevel);
        setLevel(newLevel);
        setProgress(newProgress);
      }

      }  
      catch (error) 
      {
        console.error('There was a problem with the fetch operation:', error);
      }
    }

    fetchTasks();

    // WebSocket connection
    const ws = new WebSocket('wss://dare2do.online');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (e) => {
      if(e.data === 'ping')
      {
        ws.send('pong');
      }
      else
      {
        try 
        {
          const message = JSON.parse(e.data);
          if (message.type === 'update' && message.payload) {
            console.log("Received payload:", message.payload);
            setTasksInProgress(message.payload.tasksInProgress);
            setTasksCompleted(message.payload.tasksCompleted);
          } else {
            console.error("Invalid message format received");
          }
        } 
        catch (error) 
        {
          console.error("Error parsing WebSocket message:", error);
        }
      }
    };
    
    // clean up logic
    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => {
      ws.close();
    };
  }, []);

  const doLogout = (event) => {
    event.preventDefault();
    logout(); // Clear the token using AuthContext
    localStorage.removeItem('user_data'); // Clear user data upon logout
    window.location.href = '/'; // Redirect to login page
  };

  useEffect(() => {
    // Call this function whenever tasksInProgress or tasksCompleted changes
    updateLevelAndProgress();
  }, [tasksInProgress, tasksCompleted]);
  
  const updateLevelAndProgress = () => {
    const newLevel = calculateLevel(tasksInProgress, tasksCompleted);
    const newProgress = calculateProgress(tasksInProgress, tasksCompleted, newLevel);

    if (level !== newLevel) {
      setProgress(100); // Set to 100% momentarily

      setTimeout(() => {
        setLevel(newLevel);
        setProgress(0); // Reset to 0% for the new level
        localStorage.setItem('user_level', newLevel);
        localStorage.setItem('user_progress', 0);
      }, 1000);
    } else {
      setProgress(newProgress); // Update progress for the current level
      localStorage.setItem('user_progress', newProgress);
    }
  };

  function calculateLevel(tasksInProgress, tasksCompleted) {
    // Level 0 to 1: 1 task in progress, 0 completed
    if (level === 0 && tasksInProgress >= 1 && tasksCompleted === 0) return 1;
    
    // Level 1 to 2: 2 tasks completed
    if (level === 1 && tasksCompleted >= 2) return 2;
  
    // Level 2 to 3: 5 total tasks completed
    if (level === 2 && tasksCompleted >= 5) return 3;
  
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
      default:
        progress = 0;
    }
  
    //return Math.min(100, progress); // Ensure progress doesn't exceed 100%
    return parseFloat(progress.toFixed(1)); // Format to one decimal place and convert back to a number
  }
  
  
  /*
  const updateLevelAndProgress = () => {
    const newLevel = calculateLevel(tasksInProgress, tasksCompleted);
    const newProgress = calculateProgress(tasksInProgress, tasksCompleted, level);
    setProgress(newProgress);

    if (level !== newLevel) {
      // Temporarily set progress to 100% when leveling up
      setProgress(100);
  
      // Use a timeout to reset progress to 0% and update level after a short delay
      setTimeout(() => {
        setLevel(newLevel);
        setProgress(0); // Reset progress to 0% for the new level
      }, 1000); // Delay can be adjusted
    } else {
      // Calculate and update progress for the current level
      const newProgress = calculateProgress(tasksCompleted, level);
      setProgress(newProgress);
    }
  };
  
  
  function calculateLevel(tasksInProgress, tasksCompleted) {
    // Level 0 to 1 transition
    if (tasksInProgress > 0 && tasksCompleted === 0) return 1;
  
    // Level 1 to 2 transition
    if (tasksCompleted >= 2 && tasksCompleted < 5) return 2;
  
    // Level 2 to 3 transition
    if (tasksCompleted >= 5) return 3;
  
    return 0; // Default to level 0
  }
  
  
  function calculateProgress(tasksInProgress, tasksCompleted, level) {
    switch(level) {
      case 1: 
        // Level 1: No progress until a task is completed
        return 0;
      case 2: 
        // Level 2: Increment progress by 50% for each completed task
        if (tasksCompleted === 1) {
          return 50;
        } else if (tasksCompleted >= 2) {
          return 100;
        }
        return 0;
      case 3: 
        // Level 3: Increment progress by 33.3% for each task completed beyond the first 2
        if (tasksCompleted === 3) {
          return 33.3;
        } else if (tasksCompleted === 4) {
          return 66.6;
        } else if (tasksCompleted >= 5) {
          return 100;
        }
        return 0;
      default: 
        // Level 0: progress is 100% when the first task is added
        return tasksInProgress > 0 ? 100 : 0;
    }
  }*/
  
  
  
  

  /*
  useEffect(() => {
    // Call this function whenever tasksCompleted changes
    updateLevelAndProgress();
  }, [tasksCompleted]);

  const updateLevelAndProgress = () => {
    const newLevel = calculateLevel(tasksCompleted);
    const newProgress = calculateProgress(tasksCompleted, newLevel);

    setLevel(newLevel);
    setProgress(newProgress);
  };


  function calculateLevel(tasks) {
    // Define level based on the number of tasks completed
    if (tasks >= 5) return 3;
    if (tasks >= 3) return 2;
    if (tasks > 0) return 1;
    return 0;
  }

  function calculateProgress(tasks, level) {
    // Calculate progress based on the level and tasks completed
    switch(level) {
      case 1: return 100;
      case 2: return (tasks - 3) / 3 * 100;
      case 3: return (tasks - 5) / 5 * 100;
      default: return 0;
    }
  }*/

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
          <div className='level-info'>Level: {level}</div> {/* New div for level indication */}
        </div>
      </div>
      <div className="btn-div">
        <button className='btn' onClick={doLogout}>Logout</button>
      </div>
    </div>
  );
}

export default HomeHeader;
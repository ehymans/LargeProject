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
    let newProgress;
  
    if (level !== newLevel) {
      // Temporarily set progress to 100% when leveling up
      setProgress(100);
      // Use a timeout to decrease progress to 0% and update level after a short delay
      setTimeout(() => {
        setProgress(0);
        setLevel(newLevel);
      }, 1000); // Delay can be adjusted
    } else {
      newProgress = calculateProgress(tasksCompleted, newLevel);
      setProgress(newProgress);
    }
  };
  

  function calculateLevel(tasksInProgress, tasksCompleted) {
    // Level 0 to 1 transition based on adding a task
    if (tasksInProgress > 0 && tasksCompleted === 0) return 1;

    // Level progression based on tasks completed
    if (tasksCompleted >= 5) return 3;
    if (tasksCompleted >= 2) return 2;
    
    // If tasks are in progress but not enough to level up, stay at level 1
    return 0;
  }


  
  function calculateProgress(tasksCompleted, level) {
    switch(level) {
      case 1: 
        // No additional progress calculation needed for level 1 as per your description
        return 100;
      case 2: 
        // For level 2, progress is based on completing 2 tasks
        return Math.min(100, (tasksCompleted / 2) * 100);
      case 3: 
        // For level 3, progress is based on completing 3 additional tasks (5 in total)
        return Math.min(100, ((tasksCompleted - 2) / 3) * 100);
      default: 
        return 0;
    }
  }
  

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
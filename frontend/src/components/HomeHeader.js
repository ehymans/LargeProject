import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext'; 
import CircularProgressBar from './CircularProgressBar';
import '../styles/HomeHeader.css';

function HomeHeader() {
  const [user, setUser] = useState({});
  const [tasksInProgress, setTasksInProgress] = useState(null);
  const [tasksCompleted, setTasksCompleted] = useState(null);

  const [level, setLevel] = useState(parseInt(localStorage.getItem('user_level'), 10) || 0);
  const [progress, setProgress] = useState(parseFloat(localStorage.getItem('user_progress')) || 0);

  const { logout } = useContext(AuthContext); // Using AuthContext


  useEffect(() => {
    
    console.log('useEffect called');

    let _ud = localStorage.getItem('user_data');
    let ud = JSON.parse(_ud || '{}');
    setUser(ud);

    // Initialize level and progress from localStorage
    //const savedLevel = parseInt(localStorage.getItem('user_level'), 10) || 0;
    //const savedProgress = parseFloat(localStorage.getItem('user_progress')) || 0;
    //setLevel(savedLevel);
    //setProgress(savedProgress);
    //console.log('Level from localStorage:', savedLevel);
    //console.log('Progress from localStorage:', savedProgress);

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
        console.log('API called L53');
        console.log('api result:', data.tasksInProgress);
        console.log('api result:', data.tasksCompleted);
      if (data) {
        const newLevel = calculateLevel(data.tasksInProgress, data.tasksCompleted);
        const newProgress = calculateProgress(data.tasksInProgress, data.tasksCompleted, newLevel);
        setLevel(newLevel);
        setProgress(newProgress);
        console.log('within if(data)');
        console.log('newLevel:', newLevel);
        console.log('newProgress:', newProgress);
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
      // Save current state before logging out
    //localStorage.setItem('user_level', level);
    //localStorage.setItem('user_progress', progress);
    logout(); // Clear the token using AuthContext
    localStorage.removeItem('user_data'); // Clear user data upon logout
    localStorage.removeItem('user_level'); // Clear user level
    localStorage.removeItem('user_progress'); // Clear user progress
    window.location.href = '/'; // Redirect to login page
  };

  useEffect(() => {
    // Call this function whenever tasksInProgress or tasksCompleted changes
    console.log('updateLevelAndProgress useEffect call');
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
    console.log('New level:', newLevel);
    console.log('New progress:', newProgress);
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
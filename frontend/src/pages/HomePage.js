import React, { useState, useEffect } from "react"; 

import AddTask from "../components/AddTask";
import HomeHeader from "../components/HomeHeader";
import DisplayTasks from "../components/DisplayTasks";

import '../styles/HomePage.css'; // Import the CSS for HomePage layout

const HomePage = () => {
  const [updateTask, setUpdateTask] = useState(false);
  // Define the sortOption state here

  const [sortOption, setSortOption] = useState('oldest'); // Default sort state
  
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  const [tasksInProgress, setTasksInProgress] = useState(null);
  const [tasksCompleted, setTasksCompleted] = useState(null);


  useEffect(() => {
    async function fetchInitialTasks() {
      // Extract user data from local storage or context
      const _ud = localStorage.getItem('user_data');
      const ud = JSON.parse(_ud || '{}');

      try {
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
        establishWebSocket(ud.id); // Establish WebSocket connection after data is fetched
        console.log('userID at HomePage.js: ', ud.id);
      } catch (error) {
        console.error('Error fetching initial tasks:', error);
      }
    }

    fetchInitialTasks();
  }, []);

  const establishWebSocket = (userId) => {
    const ws = new WebSocket(`wss://dare2do.online?userId=${userId}`);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (e) => {
      if (e.data === 'ping') 
      {
        ws.send('pong');
        console.log('pong');
      } 
      else 
      {
        try 
        {
          const message = JSON.parse(e.data);
          if (message.type === 'update' && message.payload) 
          {
            setTasksInProgress(message.payload.tasksInProgress);
            setTasksCompleted(message.payload.tasksCompleted);
          } 
          else 
          {
            console.error("Invalid message format received");
          }
        } 
        catch (error) 
        {
          console.error("Error parsing WebSocket message:", error);
        }
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => ws.close();
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleToggleTasksView = () => {
    setShowCompletedTasks(prevState => !prevState);
  };

  return (
    <div>
      <HomeHeader tasksInProgress={tasksInProgress} tasksCompleted={tasksCompleted} />
      <div className="task-action-container">
        <select className="common-btn-style" value={sortOption} onChange={handleSortChange}>
          <option value="oldest">Sort by: Oldest</option>
          <option value="newest">Sort by: Newest</option>
          <option value="priority">Sort by: Priority</option>
          <option value="name">Sort by: Name</option>
          </select>
        <div>
          {/* You may need to wrap AddTask in a div if it's not already and apply the common styles */}
          <AddTask className="common-btn-style" prevState={updateTask} setUpdateTask={setUpdateTask} />
        </div>
        <button 
          type="button" 
          className="common-btn-style dynamic-text-button" 
          onClick={handleToggleTasksView}
        >
          {showCompletedTasks ? "Show Current Tasks" : "Show Completed Tasks"}
        </button>
      </div>
      <DisplayTasks 
        updateTask={updateTask} 
        sortOption={sortOption} 
        showCompletedTasks={showCompletedTasks}
        tasksInProgress={tasksInProgress}
        tasksCompleted={tasksCompleted} 
      />
    </div>
  );
};

export default HomePage;

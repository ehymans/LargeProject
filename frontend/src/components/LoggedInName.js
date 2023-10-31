import React, { useState, useEffect } from 'react';
import './HomePage.css';
import CircularProgressBar from './CircularProgressBar';

function LoggedInName() {
  const [user, setUser] = useState({});
  const [progress, setProgress] = useState(0);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskInfo, setTaskInfo] = useState({
    taskName: '',
    taskDescription: '',
    taskDate: '',
    taskTime: '',
    taskImportance: '',
  });

  useEffect(() => {
    let _ud = localStorage.getItem('user_data');
    if (_ud) {
      let ud = JSON.parse(_ud);
      console.log("ud found i guess?");
      setUser(ud);
    }
    else{
      console.log("ud not found");
    }
  }, []);

  const addExperience = () => {
    setProgress(progress + 10);
  };

  const addTask = () => {
    setShowTaskForm(true);
  };

  const handleTaskFormSubmit = (e) => {
    e.preventDefault();
    // Prepare the data to send to the API
    const data = {
      userId: user.Login, 
      taskName: taskInfo.taskName,
      taskDescription: taskInfo.taskDescription,
      taskDifficulty: taskInfo.taskImportance, 
    };

    fetch('/api/addTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('API Response:', result);
      })
      .catch((error) => {
        console.error('API Error:', error);
      });

    setShowTaskForm(false);
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setTaskInfo({
      ...taskInfo,
      [name]: value,
    });
  };

  return (
    <div className="container">
      <div id="loggedInDiv">
        <span id="userName">{user.name}</span>
        {/* Basic text */}
        <h1>Welcome</h1>
        {/* Add Task button */}
        <button type="button" id="addTask" className="buttons" onClick={addTask}>
          Add Task
        </button>
        {showTaskForm && (
          <form className="task-form" onSubmit={handleTaskFormSubmit}>
            <input
              type="text"
              id="taskName"
              placeholder="Task Name"
              value={taskInfo.taskName}
              onChange={handleTaskInputChange}
            />
            <input
              type="text"
              name="taskDescription"
              placeholder="Task Description"
              value={taskInfo.taskDescription}
              onChange={handleTaskInputChange}
            />
            <input
              type="text"
              name="taskImportance"
              placeholder="Task Importance"
              value={taskInfo.taskImportance}
              onChange={handleTaskInputChange}
            />
            <button type="submit">Add</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoggedInName;

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
      setUser(ud);
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
    console.log('Task Information:', taskInfo);
    setShowTaskForm(false);
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setTaskInfo({
      ...taskInfo,
      [name]: value
    });
  };
  return (
    <div className="content">
        <div id="loggedInDiv">
            <span id="userName">{userName}</span>
            <button>Create Event</button>
        </div>
        
        <div className="sidebar">
            <h1>Logo or Title</h1>
            {/* Other sidebar contents go here */}
        </div>
        
        <div className="central-image">
            {/* Assuming you have the image as a background, you can leave this div empty. Otherwise, you can use an <img> tag. */}
        </div>
        
        <button id="addTask">Add Task</button>
        
        <div className="task-form">
            {/* Your task form elements go here */}
        </div>
    </div>
);
  /*
  return (
    <div id='loggedInDiv'>
      <span id="userName">{user.name}</span>
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
  );*/
}

export default LoggedInName;

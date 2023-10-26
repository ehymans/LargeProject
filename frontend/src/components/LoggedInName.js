import React, { useState, useEffect } from 'react';
import './HomePage.css';
import CircularProgressBar from './CircularProgressBar';

function LoggedInName() {
  const [user, setUser] = useState({});
  const [progress, setProgress] = useState(0);
  const [showTaskForm, setShowTaskForm] = useState(false); // Add state for showing the task form
  const [taskInfo, setTaskInfo] = useState({
    taskName: '',
    taskDescription: '',
    taskDate: '',
    taskTime: ''
  });

  useEffect(() => {
    let _ud = localStorage.getItem('user_data');
    if (_ud) {
      let ud = JSON.parse(_ud);
      setUser(ud);
    }
  }, []);

  const addExperience = () => {
    // Update progress state
    setProgress(progress + 10);
  };

  const addTask = () => {
    // Show the task form when Add Task button is clicked
    setShowTaskForm(true);
  };

  const handleTaskFormSubmit = (e) => {
    e.preventDefault();
    // Process the task information here
    console.log('Task Information:', taskInfo);
    // Close the task form
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
    <div id='loggedInDiv'>
      <span id="userName">{user.name}</span>
 
      <button type="button" id="addTask" className="buttons" onClick={addTask}>
        Add Task
      </button>
      {showTaskForm && (
        <form onSubmit={handleTaskFormSubmit}>
          <input
            type="text"
            name="taskName"
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
            type="date"
            name="taskDate"
            value={taskInfo.taskDate}
            onChange={handleTaskInputChange}
          />
          <input
            type="time"
            name="taskTime"
            value={taskInfo.taskTime}
            onChange={handleTaskInputChange}
          />
          <button type="submit">Add</button>
        </form>
      )}
    </div>
  );
}

export default LoggedInName;

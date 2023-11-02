import React, { useState, useEffect } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch task data from your backend API
    fetch('/api/getTaskInfo/userId') // Replace USER_ID with the actual user ID
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTasks([data]); // Assuming data is an object representing a task
      })
      .catch((error) => {
        console.error('API Error:', error);
      });
  }, []);

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <div key={index} className="task-oval">
          <h3>Task Information</h3>
          <p>User ID: {task.UserId}</p>
          <p>Current Experience: {task.CurrentExp}</p>
          {/* Add more task info properties here as needed */}
        </div>
      ))}
    </div>
  );
      }

export default TaskList;

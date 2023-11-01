import React, { useState, useEffect } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch task data from your backend API
    fetch('/api/getTasks')
      .then((response) => response.json())
      .then((data) => {
        setTasks(data); // Assuming data is an array of tasks
      })
      .catch((error) => {
        console.error('API Error:', error);
      });
  }, []);

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <div key={index} className="task-oval">
          <h3>{task.taskName}</h3>
          <p>{task.taskDescription}</p>
          <p>Importance: {task.taskImportance}</p>
        </div>
      ))}
    </div>
  );
}

export default TaskList;

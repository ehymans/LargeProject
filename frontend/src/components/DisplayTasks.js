import React, { useState, useEffect } from 'react';
import './DisplayTasks.css'; // Ensure this path is correct

function DisplayTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const _ud = localStorage.getItem('user_data');
    if (_ud) {
      const ud = JSON.parse(_ud);
      
      fetch(`/api/getTaskInfo/${ud.id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          setTasks(data); // Assuming data is an array of tasks
        })
        .catch((error) => {
          console.error('API Error:', error);
        });
    }
  }, []);

  return (
    <div className="tasks-container">
      <h2 className="tasks-header">Your Tasks</h2>
      <div className="tasks-table-container">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Description</th>
              <th>Importance</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{task.taskName}</td>
                <td>{task.taskDescription}</td>
                <td>{task.taskImportance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DisplayTasks;

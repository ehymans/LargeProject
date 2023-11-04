import React, { useState, useEffect } from 'react';


function DisplayTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const _ud = localStorage.getItem('user_data');
    let ud = null;
    try {
      ud = JSON.parse(_ud);
    } catch (error) {
      console.error('Error parsing user data from localStorage', error);
    }
    
    if (ud && ud.id) {
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
          console.error('Failed to load tasks:', error);
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

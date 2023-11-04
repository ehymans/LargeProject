import React, { useState, useEffect } from 'react';

function DisplayTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const _ud = localStorage.getItem('user_data');
    let userId = '';
    if (_ud) {
      const ud = JSON.parse(_ud);
      userId = ud.id;
      
      fetch(`/api/getTaskInfo/${userId}`)
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
    <div>
      <h2>Your Tasks</h2>
      <table>
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
  );
}

export default DisplayTasks;

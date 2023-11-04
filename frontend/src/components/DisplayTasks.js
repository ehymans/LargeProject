import React, { useState, useEffect } from 'react';

function DisplayTasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState(''); // Add a state to hold the search string

  useEffect(() => {
    const _ud = localStorage.getItem('user_data');
    let ud = JSON.parse(_ud || '{}');
    
    const fetchData = async () => {
      if (ud && ud.id && ud.jwtToken) {
        try {
          const response = await fetch('/api/searchtasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Add any other headers your API expects, such as an authorization header
            },
            body: JSON.stringify({
              userId: ud.id,
              search: search, // Use the search state here or a different value as needed
              jwtToken: ud.jwtToken // Include the JWT token from user data
            }),
          });

          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }

          const data = await response.json();
          if (data.results) {
            setTasks(data.results); // Assuming data.results is the array of tasks
          } else {
            setTasks([]); // Handle the case where no results are returned
          }
        } catch (error) {
          console.error('Failed to load tasks:', error);
        }
      }
    };

    fetchData();
  }, [search]); // Add 'search' as a dependency if you want to fetch data when it changes

  // Optionally, create a handler to update the search state
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="tasks-container">
      <h2 className="tasks-header">Your Tasks</h2>
      {/* Add a search input to update the search state */}
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search tasks..."
      />
      <div className="tasks-table-container">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Description</th>
              <th>Difficulty</th> {/* Updated to match the expected data */}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{task.TaskName}</td>
                <td>{task.TaskDescription}</td>
                <td>{task.TaskDifficulty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DisplayTasks;

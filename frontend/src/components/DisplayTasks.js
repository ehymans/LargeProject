import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';

function TaskList() {
  const [taskInfo, setTaskInfo] = useState({ UserId: '', CurrentExp: 0 });

  useEffect(() => {
    const getToken = () => {
      // Retrieve the JWT token from where you store it (e.g., localStorage or cookies)
      return localStorage.getItem('jwtToken'); // Adjust based on your token storage approach
    };

    const token = getToken();
    if (token) {
      try {
        const decodedToken = jwt.decode(token);

        if (decodedToken && decodedToken.userId) {
          const userId = decodedToken.userId;

          fetch(`/api/getTaskInfo/${userId}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              setTaskInfo(data);
            })
            .catch((error) => {
              console.error('API Error:', error);
            });
        }
      } catch (error) {
        console.error('JWT Error:', error);
      }
    }
  }, []);

  return (
    <div className="task-list">
      <h3>Task Information</h3>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Current Experience</th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{taskInfo.UserId}</td>
            <td>{taskInfo.CurrentExp}</td>
            {/* Add more table cells for additional task information */}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;

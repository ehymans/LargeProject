import React, { useState, useEffect } from 'react';
import '/Dash.css'

function LoggedInName() {
  const [user, setUser] = useState({});

  useEffect(() => {
    let _ud = localStorage.getItem('user_data');
    if (_ud) {
      let ud = JSON.parse(_ud);
      setUser(ud);
    }
  }, []);

  const doLogout = event => {
    event.preventDefault();
    localStorage.removeItem('user_data'); // Clear the user data upon logout
    window.location.href = '/'; // Redirect to the login page
    alert('Logged out successfully');
  };

  return (
    <div id="loggedInDiv">
      <span id="userName">Logged In As {user.firstName} {user.lastName}</span><br />
      <button type="button" id="logoutButton" className="buttons" onClick={doLogout}>
        Log Out
      </button>

      {/* Add the blank table here */}
      <table
  style={{
    border: '.5px solid #000',
    margin: '0 auto', // Center the table horizontally
    marginTop: '20px', // Add some top margin for spacing
    padding: '10px', // Add padding for better visual separation
  }}
>
        <thead>
          <tr>
            <th>Task</th>
            <th>Date Created</th>
            <th>Due Date</th>
            <th>Task Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sample Task</td>
            <td>1/1/1111</td>
            <td>1/2/1111</td>
            <td>Completed</td>
          </tr>
          <tr>
          <td>Sample Task 2</td>
            <td>1/4/1111</td>
            <td>1/5/1111</td>
            <td>Completed</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default LoggedInName;

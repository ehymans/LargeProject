import React, { useState, useEffect } from 'react';

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
      <table style={{ border: '1px solid #000' }}>
        <thead>
          <tr>
            <th>Table Header 1</th>
            <th>Table Header 2</th>
            <th>Table Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Table Data 1</td>
            <td>Table Data 2</td>
            <td>Table Data 3</td>
          </tr>
          <tr>
            <td>Table Data 4</td>
            <td>Table Data 5</td>
            <td>Table Data 6</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default LoggedInName;

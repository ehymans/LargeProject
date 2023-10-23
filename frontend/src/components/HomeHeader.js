import React, { useState, useEffect } from 'react';
import './PageTitle';

function HomeHeader() {
  const [user, setUser] = useState({});

  useEffect(() => {
    let _ud = localStorage.getItem('user_data');
    if (_ud) {
      let ud = JSON.parse(_ud);
      setUser(ud);
    }
  }, []);

  const doLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('user_data'); // Clear the user data upon logout
    window.location.href = '/'; // Redirect to the login page
    alert('Logged out successfully');
  };

  const addExperience = () => {
    // For you to do Ollie.
    alert('Add this endpoint - Julian');
  };

  return (
    <div className="home-header">
      <h1 id="title">Productivity Dashboard</h1>
      <span id="userName">Logged In As {user.firstName} {user.lastName}</span><br />
      <div className="page-buttons">
        <button onClick={addExperience}>Add Exp</button>
        <button onClick={doLogout}>Logout</button>
      </div>
    </div>
  );
}

export default HomeHeader;

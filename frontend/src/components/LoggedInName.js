import React, { useState, useEffect } from 'react';
import './HomePage.css';


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
  const addExperience = () => {
    // For you to do Ollie.
    alert('Add this endpoint - Julian');
  };

  return (
    <div id="loggedInDiv">
     
      <button type="button" id="logoutButton" className="buttons" onClick={addExperience}>
        Add Exp</button>
     

      
    </div>
  );
}

export default LoggedInName;

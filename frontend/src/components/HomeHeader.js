import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext'; // Adjust the path as necessary
import '../styles/HomeHeader.css';

function HomeHeader() {
  const [user, setUser] = useState({});
  const { logout } = useContext(AuthContext); // Using AuthContext

  useEffect(() => {
    let _ud = localStorage.getItem('user_data');
    if (_ud) {
      let ud = JSON.parse(_ud);
      setUser(ud);
    }
  }, []);

  const doLogout = (event) => {
    event.preventDefault();
    logout(); // Clear the token using AuthContext
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
      <div className='title'>Dare2Do - Welcome {user.firstName}!</div>
      <div className="btn-div">
        <button className='btn' onClick={doLogout}>Logout</button>
      </div>
    </div>
  );
}

export default HomeHeader;

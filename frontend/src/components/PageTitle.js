import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './PageTitle.css';

function PageTitle() {
  return (
    <div className="page-title">
      <h1 id="title">Productivity Dashboard</h1>
      <div className="page-buttons">
        <Link to="/pages/LoginPage.js">
          <button>Login</button>
        </Link>
        <Link to="/pages/RegisterPage.js">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
}

export default PageTitle;

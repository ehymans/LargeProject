import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './PageTitle.css';

function PageTitle() {
  return (
    <div className="page-title">
      <h1 id="title">Dare2Do</h1>
      <div className="page-buttons">
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
}

export default PageTitle;

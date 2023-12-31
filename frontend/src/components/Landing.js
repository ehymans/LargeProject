// Import necessary modules and components
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

// Landing page component
function Landing() {
    return (
        <div class="landing-container">
        <div class="landing-content">
          <h1>Welcome to Dare2Do</h1>
          <p>With our gamified task manager, finding motivation to get things done has never been easier.</p>
          <div class="landing-actions">
            <a href="/login" class="landing-button">Log In</a>
            <a href="/register" class="landing-button">Register</a>
          </div>
        </div>
      </div>
      
    );
}

export default Landing;

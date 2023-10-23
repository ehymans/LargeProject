import React, { useState } from 'react';
import './Login.css';

const app_name = 'progress-tracker-4331-88c53c23c126';
var bp = require('./Path.js');
const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,})$/;


function Register() {
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [message, setMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const doRegister = async (event) => {
    event.preventDefault();
    var obj = {
      firstName: registerFirstName.value,
      lastName: registerLastName.value,
      username: registerUsername.value,
      password: registerPassword.value,
    };
    var storage = require('../tokenStorage.js');
    var js = JSON.stringify(obj);
    const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,})$/;
    if (!registerPassword.match(passwordPattern)) {
      setMessage("Password must be at least 8 characters with at least 1 number and 1 special character.");
      return;
    }

    try 
    {
      const response = await fetch(bp.buildPath('api/register'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });
  
      var data = (await response.text());
      var res = JSON.parse(data);
      if( res.error && res.error.length > 0 )
      {
        setMessage("API Error:" + res.error);
      }
      else
      {
        setMessage('User added');
        storage.storeToken(res.jwtToken);
      }
  }
  catch(e)
  {
    setMessage(e.toString());
  }
  }; 

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    setRegisterPassword(password);

    // Update password strength indicator
    if (password.length === 0) {
      setPasswordStrength('');
    } else {
      const passwordStrengthMessage = password.match(passwordPattern)
        ? 'Password is strong.'
        : 'Password requirements: at least 8 characters, 1 number, and 1 special character.';
      setPasswordStrength(passwordStrengthMessage);
    }
  };

  return (
    <div className="background-container">
      <div id="loginDiv">
        <form onSubmit={doRegister} className="login-form">
          <h2 className="form-title">REGISTER</h2>
          <div className="form-group">
            <input
              type="text"
              id="registerFirstName"
              placeholder="First Name"
              value={registerFirstName}
              onChange={(e) => setRegisterFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="registerLastName"
              placeholder="Last Name"
              value={registerLastName}
              onChange={(e) => setRegisterLastName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="registerUsername"
              placeholder="Username"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="registerPassword"
              placeholder="Password"
              value={registerPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit" id="registerButton" className="login-button" onClick={doRegister}>
            SUBMIT
          </button>
        </form>
        <p id="registerResult" className="login-message">
          {message}
        </p>
      </div>
    </div>
  );
}

export default Register;

import React, { useState } from 'react';
import './Login.css';

const app_name = 'progress-tracker-4331-88c53c23c126';
var bp = require('./Path.js');



function Register() {
  var registerFirstName;
  var registerLastName;
  var registerUsername;
  var registerPassword;
  const [message, setMessage] = useState('');

  const doRegister = async (event) => {
    event.preventDefault();
    var storage = require('../tokenStorage.js');
    var obj = {
      firstName: registerFirstName.value,
      lastName: registerLastName.value,
      username: registerUsername.value,
      password: registerPassword.value,
    };
    var js = JSON.stringify(obj);
  
    try 
    {
      const response = await fetch(bp.buildPath('api/register'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });
  
      var data = await response.text();
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
              ref={(c) => (registerFirstName = c)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="registerLastName"
              placeholder="Last Name"
              ref={(c) => (registerLastName = c)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="registerUsername"
              placeholder="Username"
              ref={(c) => (registerUsername = c)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="registerPassword"
              placeholder="Password"
              ref={(c) => (registerPassword = c)}
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

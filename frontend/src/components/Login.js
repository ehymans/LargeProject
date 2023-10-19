import React, { useState } from 'react';
import './Login.css';

// Remove unused variables
// const app_name = 'progress-tracker-4331-88c53c23c126';

// Import or define buildPath
import { buildPath } from './Path.js'; // Assuming 'buildPath' is a function you need to import


function Login() {
  var loginName;
  var loginPassword;
  const [message, setMessage] = useState('');

  const doLogin = async event => {
      event.preventDefault();

      var obj = { login: loginName.value, password: loginPassword.value };
      var js = JSON.stringify(obj);

      try {
        var bp = require('./Path.js');
        const response = await fetch(bp.buildPath('api/login/'),
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
          var res = JSON.parse(await response.text());
          if (res.id <= 0) {
              setMessage('User/Password combination incorrect');
          } else {
              var user = { firstName: res.firstName, lastName: res.lastName, id: res.id };
              localStorage.setItem('user_data', JSON.stringify(user));

              setMessage('');
              window.location.href = '/home'; /// sends the user to the home page of the website
          }
      } catch (e) {
          alert(e.toString());
          return;
      }
  };

  return (
      <div className="background-container">
          <div id="loginDiv">
              <form onSubmit={doLogin} className="login-form">
                  <h2 className="form-title">LOG IN</h2>
                  <div className="form-group">
                      <input type="text" id="loginName" placeholder="Username" ref={(c) => loginName = c} />
                  </div>
                  <div className="form-group">
                      <input type="password" id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c} />
                  </div>
                  <button type="submit" id="loginButton" className="login-button" onClick={doLogin}>SUBMIT</button>
              </form>
              <p id="loginResult" className="login-message">{message}</p>
          </div>
      </div>
  );
}

export default Login;

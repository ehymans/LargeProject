import decode from "jwt-decode";
import React, { useState } from 'react';

import './Login.css';

// Remove unused variables
// const app_name = 'progress-tracker-4331-88c53c23c126';

// Import or define buildPath
var bp = require('./Path.js');


function Login() {
  var loginName;
  var loginPassword;
  const [message, setMessage] = useState('');

  const doLogin = async event => {
      event.preventDefault();

      var obj = { login: loginName.value, password: loginPassword.value };
      var js = JSON.stringify(obj);
      console.log("test");
      try {
        const response = await fetch(bp.buildPath('api/login'),
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
          var res = JSON.parse(await response.text());
        //   console.log("test2");
          var storage = require('../tokenStorage.js');
        //   console.log("test2.1");
          storage.storeToken(res);
        //   console.log("test2.2");
          const { accessToken } = res;
        //   console.log("test2.3");
        if (!accessToken) {
            setMessage('Username/Password incorrect.');
            return;
          }
        //   console.log('Received access token:', accessToken);
          const decoded = decode(accessToken,{complete:true});
        //   console.log("test3");

          var ud = decoded;
          var userId = ud.userId;
          var firstName = ud.firstName;
          var lastName = ud.lastName;  
        //   console.log("test4");

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

//import React from 'react';
import React, { useState } from 'react';
import './Login.css';

const app_name = 'progress-tracker-4331-88c53c23c126'

function buildPath(route)
{
    if (process.env.NODE_ENV === 'production') 
    {
        return 'https://' + app_name +  '.herokuapp.com/' + route;
    }
    else
    {        
        return 'http://localhost:5000/' + route;
    }
}

function Login()
{
    var loginName;
    var loginPassword;
    const [message, setMessage] = useState('');


        const doLogin = async event => 
        {
            event.preventDefault();
    
            var obj = {login:loginName.value,password:loginPassword.value};
            var js = JSON.stringify(obj);
    
            try
            {

                const response = await fetch(buildPath('api/login'),{method:'POST',body:js,headers:{'Content-Type': 'application/json'}});


                var res = JSON.parse(await response.text());
                if( res.id <= 0 )
                {
                    setMessage('User/Password combination incorrect');
                }
                else
                {
                    var user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
                    localStorage.setItem('user_data', JSON.stringify(user));
    
                    setMessage('');
                    window.location.href = '/home';            /// sends the user to the home page of the website
                }
            }
            catch(e)
            {
                //setMessage("Error is here!!");
                alert(e.toString());
                return;
            }
        };
        
    
    return(
        <div class="background-container">
        <div id="loginDiv">
        <form onSubmit={doLogin} class="login-form">
          <h2 class="form-title">PLEASE LOG IN</h2>
          <div class="form-group">
            <input type="text" id="loginName" placeholder="Username" ref={(c) => loginName = c} />
          </div>
          <div class="form-group">
            <input type="password" id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c} />
          </div>
          <button type="submit" id="loginButton" class="login-button" onClick={doLogin}>Do It</button>
        </form>
        <p id="loginResult" class="login-message">{message}</p>
      </div>
      </div>
    );
};

export default Login;

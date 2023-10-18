import React, { useState, useEffect } from 'react';


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
        window.location.href = '/'; // Redirect to login page
        alert('Logged out successfully');
    };

    return (
        <div id="loggedInDiv">
            <span id="userName">Logged In As {user.firstName} {user.lastName} </span><br />
            <button type="button" id="logoutButton" class="buttons" onClick={doLogout}> Log Out </button>
        </div>
    );
};

export default LoggedInName;









/*
import React from 'react';

function LoggedInName()
{

    var user={}

    const doLogout = event => 
    {
	    event.preventDefault();
		
        alert('doLogout');
    };    

    return(
      <div id="loggedInDiv">
        <span id="userName">Logged In As John Doe </span><br />
        <button type="button" id="logoutButton" class="buttons" 
           onClick={doLogout}> Log Out </button>
      </div>
    );
};

export default LoggedInName;*/

import decode from "jwt-decode";
import React, { useState } from "react";
import axios from "axios";

import "../styles/Login.css";

// Remove unused variables
// const app_name = 'progress-tracker-4331-88c53c23c126';

// Import or define buildPath
var bp = require("./Path.js");
var storage = require("../tokenStorage.js");

function Login() {
  var loginName;
  var loginPassword;
  const [message, setMessage] = useState("");
  const [fogetPass, setForgetPass] = useState(false);
  const [email, setEmail] = useState("");

  //Email Validation
  function VerifyEmail(email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  }

  const doLogin = async (event) => {
    event.preventDefault();

    var obj = { login: loginName.value, password: loginPassword.value };
    var js = JSON.stringify(obj);
    console.log("test");
    try {
      const response = await fetch(bp.buildPath("api/login"), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });
      var res = JSON.parse(await response.text());
      //   console.log("test2");
      storage.storeToken(res);
      //   console.log("test2.2");
      const { accessToken } = res;
      //   console.log("test2.3");
      if (!accessToken) {
        setMessage("Username/Password incorrect.");
        return;
      }
      //   console.log('Received access token:', accessToken);
      const decoded = decode(accessToken, { complete: true });
      //   console.log("test3");

      var ud = decoded;
      console.log(ud);
      var userId = ud.userId;
      var firstName = ud.firstName;
      var lastName = ud.lastName;
      //   console.log("test4");
      if (res.id <= 0) {
        setMessage("User/Password combination incorrect");
      } else {
        var user = { firstName: firstName, lastName: lastName, id: userId };
        console.log(user.firstName);
        console.log(user.lastName);
        console.log(user.id);
        localStorage.setItem("user_data", JSON.stringify(user));

        setMessage("");
        window.location.href = "/home"; /// sends the user to the home page of the website
      }
    } catch (e) {
      alert(e.toString());
      return;
    }
  };

  const handleForgetPassword = async () => {
    console.log(email);
    setMessage("");
    if (!VerifyEmail(email)) {
      setMessage("Invalid email!");
      return;
    }
    try {
      const res = await axios.post(bp.buildPath("api/send-reset-link"), {
        Email: email,
      });
      if (res.status === 200) {
        alert("Verification code and reset link is sent to email!");
        setForgetPass(false);
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 404) {
        setMessage("User not found!");
      } else if (error.response.status === 500) {
        setMessage("Internal server error!");
      }
    }
  };
  return (
    <div className="background-container">
      <div className="intermediary-container">
        {fogetPass ? (
          <div className="forget-pass-div">
            <div>Enter your email: </div>
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <button className="submit-btn" onClick={handleForgetPassword}>Submit</button>
            <p
              style={{ color: "red" }}
              id="loginResult"
              className="login-message"
            >
              {message}
            </p>
          </div>
        ) : (
          <form onSubmit={doLogin} className="login-form" id="loginDiv">
            <h2 className="form-title">LOG IN</h2>
            <div className="form-group">
              <input
                type="text"
                id="loginName"
                placeholder="Username"
                ref={(c) => (loginName = c)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                id="loginPassword"
                placeholder="Password"
                ref={(c) => (loginPassword = c)}
              />
            </div>
            <button
              type="submit"
              id="loginButton"
              className="login-button"
              onClick={doLogin}
            >
              SUBMIT
            </button>
            <div className="forget-para-div">
              <p className="forget-para" onClick={(e) => setForgetPass(true)}>
                Forget Password?
              </p>
            </div>
            <p id="loginResult" className="login-message">
              {message}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;

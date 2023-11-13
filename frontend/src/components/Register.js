import React, { useState } from "react";
import "../styles/Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const app_name = "progress-tracker-4331-88c53c23c126";
var bp = require("./Path.js");
const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,})$/;

function Register() {
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [otpCode, setOTPCode] = useState("");
  const [serverGeneratedCode, setServerGeneratedCode] = useState("");
  const navigate = useNavigate();

  //Email Validation
  function VerifyEmail(email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  }

  const handleVerify = async (event) => {
    event.preventDefault();
    setMessage("");
    console.log(registerFirstName);
    console.log(registerLastName);
    console.log(registerUsername);
    console.log(registerEmail);
    console.log(registerPassword);

    if (!VerifyEmail(registerEmail)) {
      setMessage("Invalid email!");
      return;
    }
    const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,})$/;
    if (!registerPassword.match(passwordPattern)) {
      setMessage(
        "Password must be at least 8 characters with at least 1 number and 1 special character."
      );
      return;
    }
    try {
      const res = await axios.get(bp.buildPath(`api/getcode/${registerEmail}`));
      console.log(res);
      if (res.status === 200) {
        setServerGeneratedCode(res.data.code);
        setVerifyEmail(true);
      }
    } catch (error) {
      console.log("Error while sending email: ", error);
      setMessage("Unable to verify at this moment!");
    }
  };

  const doRegister = async () => {
    var obj = {
      firstName: registerFirstName,
      lastName: registerLastName,
      username: registerUsername,
      email: registerEmail,
      password: registerPassword,
    };

    var storage = require("../tokenStorage.js");
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(bp.buildPath("api/register"), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      var data = await response.text();
      var res = JSON.parse(data);
      if (res.error && res.error.length > 0) {
        setMessage("API Error:" + res.error);
      } else {
        setMessage("User added");
        storage.storeToken(res.jwtToken);
      }
    } catch (e) {
      setMessage(e.toString());
    }
  };

  const handleMatchOTP = async () => {
    setMessage("");
    if (serverGeneratedCode === otpCode) {
      await doRegister();
      alert("User added! Please login now.");
      navigate("/login");
    } else {
      setMessage("Invalid OTP code!");
    }
  };

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    setRegisterPassword(password);

    // Update password strength indicator
    if (password.length === 0) {
      setPasswordStrength("");
    } else {
      const passwordStrengthMessage = password.match(passwordPattern)
        ? "Password is strong."
        : "Password requirements: at least 8 characters, 1 number, and 1 special character.";
      setPasswordStrength(passwordStrengthMessage);
    }
  };

  return (
    <div className="register">
      <div className="intermediary-container">
        <div id="registerDiv">
          {verifyEmail ? (
            <div className="verify-box">
              <h2>Please verify your email address!</h2>
              <div>
                An email has been sent to your email address with a 6 digit code!
              </div>
              <p>Please enter the 6 digit code to verify</p>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOTPCode(e.target.value)}
              />
              <button onClick={handleMatchOTP} className="verify-btn">
                Verify
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="register-form">
              <h1 className="form-title">REGISTER</h1>
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
                  type="text"
                  id="registerEmail"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
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
              <button type="submit" id="registerButton" className="register-button">
                SUBMIT
              </button>
            </form>
          )}
          <p id="registerResult" className="register-message">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

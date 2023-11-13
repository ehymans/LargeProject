import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import '../styles/ResetPasswordPage.css';
import axios from 'axios';
var bp = require('../components/Path.js'); 


function ResetPasswordPage() {
    const { userID } = useParams();
    const [password, setPassword] = useState('');
    const [otp, setOTP] = useState('');
    const [serverGeneratedCode, setServerGeneratedCode] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const res = await axios.get(bp.buildPath(`api/fetchotp/${userID}`));
                if (res.status === 200) {
                    console.log(res);
                    setServerGeneratedCode(res.data);
                }
            } catch (error) {
                console.log('Error: ', error);
                if (error.response.status === 404) {
                    setMessage('Invalid link!');
                }
                else if (error.response.status === 500)
                    setMessage('Server is not currently working!');
            }
        }
        fetchdata();
    }, []);

    const handleClick = async () => {
        setMessage('');
        if (serverGeneratedCode.toString() !== otp) {
            setMessage('Invalid OTP!');
            return;
        }
        const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,})$/;
        if (!password.match(passwordPattern)) {
            setMessage("Password must be at least 8 characters with at least 1 number and 1 special character.");
            return;
        }
        try {
            const res = await axios.patch(bp.buildPath(`api/reset-password/${userID}`), { Password: password });
            if (res.status === 200) {
                alert('Password has been reset. Login now to continue!');
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
            if (error.response.status === 404) {
                setMessage('Invalid user!');
            }
            else if (error.response.status === 500) {
                setMessage('Internal server error!');
            }
        }
        console.log(password);
    }
    return (
        <div className='reset-password-container'>
            {message === 'Invalid link!' ? <div style={{ color: 'red' }}>This link will not work. Please try to generate a new one from forget password page.</div> :
                <div className='Reset-pass'>
                    <div style={{ color: 'white' }}>Enter the 6 digit code:</div>
                    <input
                        name='otp'
                        value={otp}
                        onChange={(e) => { setOTP(e.target.value) }}
                    />
                    <br />
                    <div style={{ color: 'white' }}>Reset your password:</div>
                    <input
                        name='password'
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                    <br />
                    <div className='btn-div'>
                        <button className='submit-btn' onClick={handleClick}>Submit</button>
                    </div>
                    <p style={{ color: 'red', textAlign: 'center' }} id="registerResult" className="login-message">
                        {message}
                    </p>
                </div>
            }
        </div>

    );
}

export default ResetPasswordPage;

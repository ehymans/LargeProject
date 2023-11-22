// src/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Adjust the path as necessary

const ProtectedRoute = ({ children }) => {
    const { authToken } = useContext(AuthContext);

    if (!authToken) {
        // User not authenticated
        return <Navigate to="/" />;     // changed 11/22/23 - Ethan - Send user back to landing page bc its auto directing back to /home anyways
    }

    return children;
};

export default ProtectedRoute;

// src/AuthContext.js
import React, { useState, createContext } from 'react';
import { storeToken, retrieveToken } from './tokenStorage'; // Adjust the import path

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(retrieveToken());

    const login = (token) => {
        setAuthToken(token);
        storeToken({ accessToken: token });
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('token');
        //storeToken({ accessToken: null });
    };

    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

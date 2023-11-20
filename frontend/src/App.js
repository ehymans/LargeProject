import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import { AuthProvider } from './AuthContext'; // Import AuthProvider
import ProtectedRoute from './ProtectedRoute'; // Adjust the path as necessary
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
//import CardPage from './pages/CardPage';

function App() {
  return (
      <AuthProvider> {/* wrap application with AuthProvider */}
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/reset-password/:userID" element={<ResetPasswordPage />} />
                  <Route 
                      path="/home" 
                      element={
                          <ProtectedRoute>
                              <HomePage />
                          </ProtectedRoute>
                      } 
                  />
              </Routes>
          </BrowserRouter>
      </AuthProvider>
  );
}
export default App;

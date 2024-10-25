import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import './App.css';
import DiagnosticPage from './Views/DiagnosticPage/DiagnosticPage';
import RegisterPage from './Views/RegisterPage/RegisterPage';
import LoginForm from './Views/LoginForm/LoginForm';
import AdminPage from './Views/AdminPage/AdminPage'; // Import the AdminPage component
import UsersAdmin from './Views/AdminPage/Users'
import CreateUserAdmin from './Views/AdminPage/CreateUser'
import FormPage from './Views/HardForm/SymptomsForm'
import HomePage from './Views/HomePage/HomePage'
import FooterPage from './Components/Footer/Footer'
import Diagnosis from './Views/DiagnosisResultPage/DiagnosisResultPage'
import Spinner from './Spinner'; // Import the Spinner component

// import ProtectedRoute from './ProtectedRoute'; // Protección de rutas

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // Initialize based on token in localStorage
  const [userEmail, setUserEmail] = useState(localStorage.getItem('email') || '');

  const handleLoginSuccess = (email) => {
    setIsLoggedIn(true); // Set login state to true
    setUserEmail(email); // Set user email
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setIsLoggedIn(false); // Set login state to false
    setUserEmail('');
  };

  return (
    <Router>
      <div>
        {/* Render the Navbar */}
        <Navbar isLoggedIn={isLoggedIn} userEmail={userEmail} onLogout={handleLogout} />

        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HomePage />} />

          {/* Diagnostic Page */}
          <Route path="/diagnostico" element={<DiagnosticPage />} />
          {/* Registration Page */}
          <Route path="/registro" element={<RegisterPage />} />
          {/* Login Page */}
          <Route path="/Inicio-de-sesion" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />

          {/* Admin Page */}
          <Route path="/admin" element={<AdminPage />} /> {/* New Admin Page Route */}
          <Route path="/admin/users" element={<UsersAdmin />} />
          <Route path='/admin/create' element={<CreateUserAdmin />} />
          {/* Form Page */}
          <Route path="/form" element={<FormPage />} />
          {/* Diagnosis Result Page  */}
          <Route path="/diagnosis" element={<Diagnosis />} />
           {/* Spinner Page */}
           <Route path="/spinner" element={<Spinner />} /> {/* Add Spinner route here */}
        </Routes>
        <FooterPage />
      </div>
    </Router>
  );
}

export default App;

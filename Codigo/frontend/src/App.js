import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import RegisterPage from './Views/RegisterPage/RegisterPage';
import LoginForm from './Views/LoginForm/LoginForm';
import AdminPage from './Views/AdminPage/AdminPage'; // Import the AdminPage component
import UsersAdmin from './Views/AdminPage/UserAdmin/Users'
import CreateUserAdmin from './Views/AdminPage/UserAdmin/CreateUser'
import ViewUser from './Views/AdminPage/UserAdmin/ViewUser'
import UpdateUser from './Views/AdminPage/UserAdmin/UpdateUser'
import FormPage from './Views/HardForm/SymptomsForm'
import HomePage from './Views/HomePage/HomePage'
import FooterPage from './Components/Footer/Footer'
import Diagnosis from './Views/DiagnosisResultPage/DiagnosisResultPage'
import AboutUsPage from './Views/AboutUsPage/AboutUsPage';
import DiagnosticLibraryPage from './Views/DiagnosticLibraryPage/DiagnosticLibraryPage';
import DashboardPage from './Views/AdminPage/Dashboard/DashboardView'
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
    window.location.href = '/'; // Redirect to home page after logout
  };

  return (
    <Router>
      <div>
        {/* Render the Navbar */}
        <Navbar isLoggedIn={isLoggedIn} userEmail={userEmail} onLogout={handleLogout} />

        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HomePage />} />

          {/* Registration Page */}
          <Route path="/registro" element={<RegisterPage />} />
          {/* Login Page */}
          <Route path="/Inicio-de-sesion" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />

          {/* Admin Page */}
          <Route path="/admin" element={<AdminPage />} />

          {/* User administration */}
          <Route path="/admin/users" element={<UsersAdmin />} />
          <Route path='/admin/create' element={<CreateUserAdmin />} />
          <Route path='/admin/user/:id' element={<ViewUser />} />
          <Route path='/admin/updateuser/:id' element={<UpdateUser />} />

          {/* Dashboard administration */}
          <Route path='/admin/dashboard' element={<DashboardPage />} />

          {/* Form Page */}
          <Route path="/form" element={<FormPage />} />
          {/* Diagnosis Result Page  */}
          <Route path="/diagnosis" element={<Diagnosis />} />
          {/* Spinner Page */}
          <Route path="/spinner" element={<Spinner />} /> {/* Add Spinner route here */}
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/biblioteca-de-diagnosticos" element={<DiagnosticLibraryPage />} /> {/* Make sure this path matches */}


        </Routes>
        <FooterPage />
      </div>
    </Router>
  );
}

export default App;

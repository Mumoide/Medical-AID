import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import './App.css';
import DiagnosticPage from './Views/DiagnosticPage/DiagnosticPage';
import RegisterPage from './Views/RegisterPage/RegisterPage';
import LoginForm from './LoginForm';
import AdminPage from './AdminPage'; // Import the AdminPage component
import FormPage from './Views/HardForm/SymptomsForm'
import HomePage from './Views/HomePage/HomePage'
import FooterPage from './Components/Footer/Footer'
import Diagnosis from './Views/DiagnosisResultPage/DiagnosisResultPage'

function App() {
  return (
    <Router>
      <div>
        {/* Render the Navbar */}
        <Navbar />

        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HomePage />} />

          {/* Diagnostic Page */}
          <Route path="/diagnostico" element={<DiagnosticPage />} />
          {/* Registration Page */}
          <Route path="/registro" element={<RegisterPage />} />
          {/* Login Page */}
          <Route path="/Inicio-de-sesion" element={<LoginForm />} />
          {/* Admin Page */}
          <Route path="/admin" element={<AdminPage />} /> {/* New Admin Page Route */}
          {/* Form Page */}
          <Route path="/form" element={<FormPage />} />
          {/* Diagnosis Result Page  */}
          <Route path="/diagnosis" element={<Diagnosis />} />
        </Routes>
        <FooterPage />
      </div>
    </Router>
  );
}

export default App;

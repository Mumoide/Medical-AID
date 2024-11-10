import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import RegisterPage from './Views/RegisterPage/RegisterPage';
import LoginForm from './Views/LoginForm/LoginForm';
import PasswordRecoveryPage from './Views/LoginForm/PasswordRecoveryPage/PasswordRecoveryPage';
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
import UserProfilePage from './Views/UserProfilePage/UserProfilePage'
import DiagnosticRecordsPage from './Views/UserProfilePage/DiagnosticRecordsPage/DiagnosticRecordsPage'
import DiseasePage from './Views/UserProfilePage/DiseasePage/DiseasePage'
import UserUpdatePage from './Views/UserProfilePage/UserUpdatePage/UserUpdatePage'
import Spinner from './Spinner'; // Import the Spinner component
import Swal from "sweetalert2";
import NotFoundRedirect from './Components/NotFoundRedirect/NotFoundRedirect'; // Import the NotFoundRedirect component
import { checkTokenExpiration } from "./utils/tokenUtils";
// import ProtectedRoute from './ProtectedRoute'; // Protección de rutas

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // Initialize based on token in localStorage
  const [userEmail, setUserEmail] = useState(localStorage.getItem('user_name') || '');

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

  useEffect(() => {
    const interval = setInterval(() => {
      const { expired, timeRemaining } = checkTokenExpiration();

      if (expired) {
        // Token has expired, log the user out
        Swal.fire({
          title: "Session Expired",
          text: "Your session has expired. Please log in again.",
          icon: "warning",
          confirmButtonText: "OK",
        }).then(() => {
          localStorage.removeItem("token");
          window.location.href = "/inicio-de-sesion";
        });
        clearInterval(interval); // Stop the interval once the session has expired
      } else if (timeRemaining < 5 * 60) { // Less than 5 minutes remaining
        // Show a warning if the token will expire soon
        Swal.fire({
          title: "Session Expiring Soon",
          text: "Your session will expire in less than 5 minutes. Would you like to refresh?",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Refresh",
        }).then((result) => {
          if (result.isConfirmed) {
            // Call endpoint to refresh the session
            fetch("http://localhost:3001/api/auth/refresh-token", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.newToken) {
                  localStorage.setItem("token", data.newToken);
                } else {
                  throw new Error("Token refresh failed");
                }
              })
              .catch(() => {
                Swal.fire("Error", "Unable to refresh session. Please log in again.", "error");
                localStorage.removeItem("token");
                window.location.href = "/inicio-de-sesion";
              });
          }
        });
      }
    }, 60 * 4000); // Check every 4 minutes

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

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
          {/* Recover Password Page */}
          <Route path="/recuperar-contrasena" element={<PasswordRecoveryPage/>} />


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
          <Route path="/spinner" element={<Spinner />} />
          {/* About Us Page */}
          <Route path="/about-us" element={<AboutUsPage />} />
          {/* Diagnostic Library Page */}
          <Route path="/biblioteca-de-diagnosticos" element={<DiagnosticLibraryPage />} />
          {/* Profile Page */}
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/diagnostic-records" element={<DiagnosticRecordsPage />} />
          <Route path="/update-profile" element={<UserUpdatePage />} />
          <Route path="/disease" element={<DiseasePage />} />


          {/* Catch-all route to redirect to home for undefined routes */}
          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
        <FooterPage />
      </div>
    </Router>
  );
}

export default App;

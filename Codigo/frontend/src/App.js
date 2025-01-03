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
import AlertsPage from './Views/AdminPage/Alerts/AlertsView'
import CreateAlertPage from './Views/AdminPage/Alerts/CreateAlert'
import PublicAlertsPage from './Views/PublicAlerts/PublicAlertsPage'
import UserProfilePage from './Views/UserProfilePage/UserProfilePage'
import DiagnosticRecordsPage from './Views/UserProfilePage/DiagnosticRecordsPage/DiagnosticRecordsPage'
import DiseasePage from './Views/UserProfilePage/DiseasePage/DiseasePage'
import UserUpdatePage from './Views/UserProfilePage/UserUpdatePage/UserUpdatePage'
import ChangePasswordPage from './Views/UserProfilePage/UserUpdatePage/ChangePasswordPage/ChangePasswordPage'
import Spinner from './Spinner'; // Import the Spinner component
import Swal from "sweetalert2";
import NotFoundRedirect from './Components/NotFoundRedirect/NotFoundRedirect'; // Import the NotFoundRedirect component
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import { checkTokenExpiration } from "./utils/tokenUtils";
import { jwtDecode } from "jwt-decode";
import ScrollToTop from './utils/scrollToTop'

// import ProtectedRoute from './ProtectedRoute'; // Protección de rutas

function App() {
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const nombre = decodedToken?.nombre || '';
  const roleId = decodedToken?.role_id || '';
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // Initialize based on token in localStorage
  const [userEmail, setUserEmail] = useState(nombre || '');
  const [userRoleId, setUserRoleId] = useState(roleId || '');
  const [alertsCount, setAlertsCount] = useState(0);
  const [alertsData, setAlertsData] = useState([]); // State for alerts data

  const handleLoginSuccess = (email, role_id) => {
    setIsLoggedIn(true); // Set login state to true
    setUserEmail(email); // Set user email
    setUserRoleId(role_id); // Set user role id
  };

  const refreshtoken = async () => {
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

  const logoutUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token available for logout.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/users/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.log(`Error: ${response.status} ${response.statusText}`);
        throw new Error("Failed to logout");
      }

      console.log("Logged out successfully.");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear local storage and reset app state
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      setIsLoggedIn(false);
      setUserEmail('');
      setUserRoleId('');
      window.location.href = '/inicio-de-sesion';
    }
  };


  const handleLogout = () => {
    logoutUser();
  };


  useEffect(() => {
    // Function to fetch alerts data
    const fetchAlerts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/alerts/user-alerts",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          console.log(`Error: ${response.status} ${response.statusText}`);
          throw new Error("Failed to fetch alerts");
        }

        const alertsData = await response.json();
        setAlertsData(alertsData); // Store alerts data
        const unreadCount = alertsData.filter(
          (alert) => alert.readed === false
        ).length;
        setAlertsCount(unreadCount);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    if (isLoggedIn) {
      fetchAlerts(); // Only fetch alerts if the user is logged in
    }
  }, [isLoggedIn]); // Fetch alerts whenever the logged-in state changes

  const fetchAlerts = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/alerts/user-alerts",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        console.log(`Error: ${response.status} ${response.statusText}`);
        throw new Error("Failed to fetch alerts");
      }

      const alertsData = await response.json();
      setAlertsData(alertsData); // Store alerts data
      const unreadCount = alertsData.filter(
        (alert) => alert.readed === false
      ).length;
      setAlertsCount(unreadCount);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  useEffect(() => {
    let interactionOccurred = false;

    const handleInteraction = () => {
      interactionOccurred = true;
    };

    const interval = setInterval(() => {
      const { expired, timeRemaining } = checkTokenExpiration();

      if (expired) {
        // Token has expired, log the user out
        Swal.fire({
          title: "Sesión expirada",
          text: "Por favor inicia sesión nuevamente.",
          icon: "warning",
          confirmButtonText: "OK",
        }).then(() => {
          localStorage.removeItem("token");
          window.location.href = "/inicio-de-sesion";
        });
        clearInterval(interval); // Stop the interval once the session has expired
      } else if (timeRemaining < 5 * 60) { // Warning for debugging purposes
        // Add a one-time event listener for user interactions
        document.addEventListener("click", handleInteraction, { once: true });

        Swal.fire({
          title: "¡Pronto expirará tu sesión!",
          text: "Tu sesión va a expirar en menos de 5 minutos. ¿Quieres actualizar tu sesión?",
          icon: "info",
          confirmButtonText: "Actualizar",
          willClose: () => {
            document.removeEventListener("click", handleInteraction); // Cleanup on close
          },
        }).then((result) => {
          if (result.isConfirmed || interactionOccurred) {
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
    }, 60 * 500); // Check every 4 minutes

    return () => {
      clearInterval(interval); // Cleanup on component unmount
      document.removeEventListener("click", handleInteraction); // Ensure no event listeners remain
    };
  }, []);

  return (
    <Router>
      <div>
        {/* Render the Navbar */}
        <Navbar isLoggedIn={isLoggedIn} roleId={userRoleId} userEmail={userEmail} onLogout={handleLogout} alertsData={alertsData} alertsCount={alertsCount} />
        <ScrollToTop />
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HomePage refreshToken={refreshtoken} />} />

          {/* Registration Page */}
          <Route path="/registro" element={<RegisterPage />} />
          {/* Login Page */}
          <Route path="/Inicio-de-sesion" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
          {/* Recover Password Page */}
          <Route path="/recuperar-contrasena" element={<PasswordRecoveryPage />} />


          {/* Admin Page */}
          <Route path="/admin" element={
            <ProtectedRoute roleId={userRoleId}>
              <AdminPage />
            </ProtectedRoute>} />

          {/* User administration */}
          <Route path="/admin/users" element={
            <ProtectedRoute roleId={userRoleId}>
              <UsersAdmin roleId={userRoleId} />

            </ProtectedRoute>
          } />
          <Route path='/admin/create' element={
            <ProtectedRoute roleId={userRoleId}>

              <CreateUserAdmin />
            </ProtectedRoute>
          } />
          <Route path='/admin/user/:id' element={
            <ProtectedRoute roleId={userRoleId}>

              <ViewUser />
            </ProtectedRoute>
          } />
          <Route path='/admin/updateuser/:id' element={
            <ProtectedRoute roleId={userRoleId}>

              <UpdateUser roleId={userRoleId} />
            </ProtectedRoute>
          } />
          {/* Dashboard administration */}
          <Route path='/admin/dashboard' element={
            <ProtectedRoute roleId={userRoleId}>

              <DashboardPage />
            </ProtectedRoute>
          } />
          {/* Alerts administration */}
          <Route path='/admin/alerts' element={
            <ProtectedRoute roleId={userRoleId}>

              <AlertsPage />
            </ProtectedRoute>
          } />
          <Route path='/admin/create_alert' element={
            <ProtectedRoute roleId={userRoleId}>

              <CreateAlertPage fetchAlerts={fetchAlerts} />
            </ProtectedRoute>
          } />

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
          <Route path="/update-password" element={<ChangePasswordPage onLogout={handleLogout} />} />
          <Route path="/disease" element={<DiseasePage />} />

          {/* Public Alerts Page */}
          <Route path="/notifications" element={<PublicAlertsPage fetchAlerts={fetchAlerts} />} />

          {/* Catch-all route to redirect to home for undefined routes */}
          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
        <FooterPage />
      </div>
    </Router>
  );
}

export default App;

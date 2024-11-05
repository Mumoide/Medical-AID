// UserDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewUser.css"; // Optional CSS for styling

const UserDetails = () => {
  const { id } = useParams(); // Get user_id from the URL params
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Back button click handler to navigate back to /users/admin
  const handleBackClick = () => {
    navigate("/admin/users");
  };

  useEffect(() => {
    // Fetch the user data from the backend using the user_id
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/users/${id}`
        );
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Fallback values for missing/null data
  const email = userData.email || "N/A";
  const status = userData.active ? "Active" : "Inactive";
  const role = userData.roles?.[0]?.role?.role_name || "No role assigned";
  const firstName = userData.profile?.names || "N/A";
  const lastName = userData.profile?.last_names || "N/A";
  const address = userData.profile?.address || "N/A";
  const comune = userData.profile?.comune || "N/A";
  const birthdate = userData.profile?.birthdate
    ? new Date(userData.profile.birthdate).toLocaleDateString()
    : "N/A";
  const phoneNumber = userData.profile?.phone_number || "N/A";

  return (
    <div className="user-details-container">
      <h1>User Details</h1>
      <div className="user-details">
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>Role:</strong> {role}
        </p>
        <p>
          <strong>First Name:</strong> {firstName}
        </p>
        <p>
          <strong>Last Name:</strong> {lastName}
        </p>
        <p>
          <strong>Address:</strong> {address}
        </p>
        <p>
          <strong>Comune:</strong> {comune}
        </p>
        <p>
          <strong>Date of Birth:</strong> {birthdate}
        </p>
        <p>
          <strong>Phone Number:</strong> {phoneNumber}
        </p>
        <div style={{ marginTop: "30px" }}>
          <button onClick={handleBackClick} className="back-button">
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

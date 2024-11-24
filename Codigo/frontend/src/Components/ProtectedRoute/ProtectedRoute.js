import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roleId }) => {
    // Only allow access for roleId 1 or 2
    const allowedRoles = [1, 2, "1", "2"];

    if (!allowedRoles.includes(Number(roleId))) {
        // Redirect to a "Not Authorized" page or home page
        return <Navigate to="/" replace />;
    }

    return children; // Render the protected component
};

export default ProtectedRoute;

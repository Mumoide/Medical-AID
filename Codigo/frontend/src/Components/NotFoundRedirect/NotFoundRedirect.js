import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFoundRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/"); // Redirect to home page
    }, [navigate]);

    return null; // This component does not render anything
}

export default NotFoundRedirect;

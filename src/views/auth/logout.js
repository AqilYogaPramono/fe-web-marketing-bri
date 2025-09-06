import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    await fetch("http://localhost:3001/API/logout", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });
                } catch (error) {
                    console.error("Logout error:", error);
                }
            }
            localStorage.removeItem("token");
            navigate("/");
        };

        handleLogout();
    }, [navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Logging out...</p>
            </div>
        </div>
    );
};

export default Logout;

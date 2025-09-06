import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/BRI.svg";

const NavbarManajer = ({ onToggleSidebar }) => {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState("Manajer BRI");
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded) return;
        
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }

            try {
                const response = await fetch("http://localhost:3001/API/manajer/me", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/");
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    const fullName = data.nama || "Manajer BRI";
                    setUsername(fullName);
                }
            } catch (error) {
                localStorage.removeItem("token");
                navigate("/");
            } finally {
                setIsLoaded(true);
            }
        };

        fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (open && !event.target.closest(".dropdown")) {
                setOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [open]);

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

    return (
        <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: "#00569E", zIndex: 1030 }}>
            <div className="container-fluid">
                <button className="btn btn-link text-white d-lg-none me-2" onClick={onToggleSidebar} aria-label="Toggle sidebar">
                    <i className="bi bi-list fs-4"></i>
                </button>

                <div className="d-flex align-items-center gap-2 d-lg-none position-absolute" style={{ left: "50%", transform: "translateX(-50%)" }}>
                    <img src={logo} alt="BRI" style={{ height: 32, filter: "brightness(0) invert(1)" }} />
                </div>

                <div className="d-flex align-items-center gap-2 d-none d-lg-flex" style={{ cursor: "pointer" }} onClick={() => navigate("/manajer/dashboard")}>
                    <img src={logo} alt="BRI" style={{ height: 36, filter: "brightness(0) invert(1)" }} />
                </div>

                <div className="ms-auto position-relative dropdown">
                    <button className="btn btn-outline-light rounded-pill px-3 py-2 d-flex align-items-center gap-2" onClick={() => setOpen(!open)}>
                        <span className="fw-semibold d-none d-md-inline">{username}</span>
                        <span className="fw-semibold d-md-none" style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {username.split(' ').map((name, index) => index === 0 ? name : name.charAt(0)).join(' ').toUpperCase()}
                        </span>
                    </button>
                    {open && (
                        <div className="dropdown-menu dropdown-menu-end show mt-2 shadow" style={{ right: 0, minWidth: "160px" }}>
                            <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => {}}>
                                <i className="bi bi-person"></i>
                                <span>Profil</span>
                            </button>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item d-flex align-items-center gap-2" onClick={handleLogout}>
                                <i className="bi bi-box-arrow-right"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavbarManajer;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/BRI.svg';

const NavbarAdmin = ({ onToggleSidebar, username = 'Admin BRI' }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (open && !event.target.closest('.dropdown')) {
                setOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [open]);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: '#00569E', zIndex: 1030 }}>
            <div className="container-fluid">
                <button className="btn btn-link text-white d-lg-none me-2" onClick={onToggleSidebar} aria-label="Toggle sidebar">
                    <i className="bi bi-list fs-4"></i>
                </button>

                <div className="d-flex align-items-center gap-2 d-lg-none position-absolute" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                    <img src={logo} alt="BRI" style={{ height: 32, filter: 'brightness(0) invert(1)' }} />
                </div>

                <div className="d-flex align-items-center gap-2 d-none d-lg-flex" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/dashboard')}>
                    <img src={logo} alt="BRI" style={{ height: 36, filter: 'brightness(0) invert(1)' }} />
                </div>

                <div className="ms-auto position-relative dropdown">
                    <button className="btn btn-outline-light rounded-pill px-3 py-2 d-flex align-items-center gap-2" onClick={() => setOpen(!open)}>
                        <span className="fw-semibold text-truncate" style={{ maxWidth: '120px' }}>{username}</span>
                    </button>
                    {open && (
                        <div className="dropdown-menu dropdown-menu-end show mt-2 shadow" style={{ right: 0, minWidth: '160px' }}>
                            <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => {}}>
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

export default NavbarAdmin;



import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const SidebarAdmin = ({ isOpen, onClose }) => {
    const location = useLocation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (isOpen) {
            onClose();
        }
    }, [location.pathname, onClose]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.sidebar-mobile') && !event.target.closest('.navbar')) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen, onClose]);

    return (
        <>
            {isOpen && <div className="sidebar-overlay d-lg-none" style={{ position: 'fixed', top: '56px', left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1040 }}></div>}
            <div className={`sidebar-mobile d-lg-none ${isOpen ? 'show' : ''}`} style={{ 
                position: 'fixed', 
                top: '56px', 
                left: 0, 
                width: '280px', 
                height: 'calc(100vh - 56px)', 
                backgroundColor: 'white', 
                zIndex: 1050, 
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease',
                boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
            }}>
                <div className="p-0 h-100">
                    <nav className="nav flex-column py-3">
                        <NavLink className="nav-link px-4 py-3 d-flex align-items-center" to="/admin/dashboard" style={{ color: '#00569E' }}>
                            <i className="bi bi-speedometer2 me-3 fs-5"></i> 
                            <span className="fw-medium">Dashboard</span>
                        </NavLink>
                        <NavLink className="nav-link px-4 py-3 d-flex align-items-center" to="/admin/manajer" style={{ color: '#00569E' }}>
                            <i className="bi bi-people me-3 fs-5"></i> 
                            <span className="fw-medium">Manajer</span>
                        </NavLink>
                    </nav>
                </div>
            </div>
            <div className="d-none d-lg-block" style={{ width: '280px', minHeight: 'calc(100vh - 56px)', backgroundColor: 'white', boxShadow: '2px 0 10px rgba(0,0,0,0.1)' }}>
                <div className="p-0 h-100">
                    <nav className="nav flex-column py-3">
                        <NavLink className="nav-link px-4 py-3 d-flex align-items-center" to="/admin/dashboard" style={{ color: '#00569E' }}>
                            <i className="bi bi-speedometer2 me-3 fs-5"></i> 
                            <span className="fw-medium">Dashboard</span>
                        </NavLink>
                        <NavLink className="nav-link px-4 py-3 d-flex align-items-center" to="/admin/manajer" style={{ color: '#00569E' }}>
                            <i className="bi bi-people me-3 fs-5"></i> 
                            <span className="fw-medium">Manajer</span>
                        </NavLink>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default SidebarAdmin;



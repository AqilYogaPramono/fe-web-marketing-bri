import React, { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavbarAdmin from '../navbars/navbarAdmin';
import SidebarAdmin from '../sidebars/sidebarAdmin';
import AdminDashboard from '../../views/admin/dashboard';
import ManajerPage from '../../views/admin/manajer';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const handleToggleSidebar = useCallback(() => {
        setSidebarOpen(true);
    }, []);
    
    const handleCloseSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);
    
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <NavbarAdmin onToggleSidebar={handleToggleSidebar} />
            <div className="d-flex">
                <SidebarAdmin isOpen={sidebarOpen} onClose={handleCloseSidebar} />
                <main className="flex-grow-1 p-4" style={{ marginLeft: '280px', minHeight: 'calc(100vh - 56px)', width: 'calc(100vw - 280px)' }}>
                    <Routes>
                        <Route path="/dashboard" element={<AdminDashboard />} />
                        <Route path="/manajer" element={<ManajerPage />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;



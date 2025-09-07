import React, { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavbarManajer from '../navbars/navbarManajer';
import SidebarManajer from '../sidebars/sidebarManajer';
import Dashboard from '../../views/manajer/dashboard';
import Marketer from '../../views/manajer/marketer/marketer';
import LaporanSelesai from '../../views/manajer/laporanMarketer/laporanSelesai';
import LaporanTidakValid from '../../views/manajer/laporanMarketer/laporanTidakValid';
import LaporanProses from '../../views/manajer/laporanMarketer/laporanProses';
import ProfileManajer from '../../views/manajer/profile/profileManajer';
import UpdateEmail from '../../views/manajer/profile/updateEmail';
import UpdatePassword from '../../views/manajer/profile/updatePassword';

const ManajerLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const handleToggleSidebar = useCallback(() => {
        setSidebarOpen(true);
    }, []);
    
    const handleCloseSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);
    
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <NavbarManajer onToggleSidebar={handleToggleSidebar} />
            <div className="d-flex">
                <SidebarManajer isOpen={sidebarOpen} onClose={handleCloseSidebar} />
                <main className="flex-grow-1 p-4" style={{ marginLeft: '280px', minHeight: 'calc(100vh - 56px)', width: 'calc(100vw - 280px)' }}>
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/marketer" element={<Marketer />} />
                        <Route path="/laporan-selesai" element={<LaporanSelesai />} />
                        <Route path="/laporan-ditolak" element={<LaporanTidakValid />} />
                        <Route path="/laporan-proses" element={<LaporanProses />} />
                        <Route path="/profile" element={<ProfileManajer />} />
                        <Route path="/profile/update-email" element={<UpdateEmail />} />
                        <Route path="/profile/update-password" element={<UpdatePassword />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default ManajerLayout;



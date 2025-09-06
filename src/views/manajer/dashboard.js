import React, { useState, useEffect } from 'react';
import '../../components/messages/messagesDashboard.js';
import '../../assets/css/style.css';
import '../../assets/js/script.js';

const ManajerDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalMarketerAktif: 0,
        totalMarketerProses: 0,
        totalLaporan: 0,
        totalLaporanProses: 0,
        totalLaporanTidakValid: 0,
        totalLaporanValid: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/';
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/API/manajer/dashboard', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setDashboardData(data);
            } else {
                const error = await response.json();
                if (window.messagesDashboard) {
                    await window.messagesDashboard.error(error.message || 'Gagal memuat data dashboard');
                }
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            if (window.messagesDashboard) {
                await window.messagesDashboard.error('Terjadi kesalahan pada server');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-100" style={{ margin: 0, padding: 0 }}>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Memuat...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-100" style={{ margin: 0, padding: 0 }}>
            <div className="p-4">
                <div className="row g-4">

                    <div className="col-lg-3 col-md-6">
                        <div className="card border-0 shadow-sm h-100 dashboard-card">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="dashboard-icon dashboard-icon-success">
                                            <i className="bi bi-people-fill"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="dashboard-stat-label">Marketer Aktif</h6>
                                        <h3 className="dashboard-stat-number text-success" data-stat="marketer-aktif">{dashboardData.totalMarketerAktif}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card border-0 shadow-sm h-100 dashboard-card">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="dashboard-icon dashboard-icon-warning">
                                            <i className="bi bi-clock-fill"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="dashboard-stat-label">Marketer Proses</h6>
                                        <h3 className="dashboard-stat-number text-warning" data-stat="marketer-proses">{dashboardData.totalMarketerProses}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card border-0 shadow-sm h-100 dashboard-card">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="dashboard-icon dashboard-icon-primary">
                                            <i className="bi bi-file-earmark-text-fill"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="dashboard-stat-label">Total Laporan</h6>
                                        <h3 className="dashboard-stat-number text-primary" data-stat="total-laporan">{dashboardData.totalLaporan}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card border-0 shadow-sm h-100 dashboard-card">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="dashboard-icon dashboard-icon-info">
                                            <i className="bi bi-hourglass-split"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="dashboard-stat-label">Laporan Proses</h6>
                                        <h3 className="dashboard-stat-number text-info" data-stat="laporan-proses">{dashboardData.totalLaporanProses}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card border-0 shadow-sm h-100 dashboard-card">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="dashboard-icon dashboard-icon-danger">
                                            <i className="bi bi-x-circle-fill"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="dashboard-stat-label">Laporan Tidak Valid</h6>
                                        <h3 className="dashboard-stat-number text-danger" data-stat="laporan-tidak-valid">{dashboardData.totalLaporanTidakValid}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card border-0 shadow-sm h-100 dashboard-card">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="dashboard-icon dashboard-icon-success">
                                            <i className="bi bi-check-circle-fill"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="dashboard-stat-label">Laporan Valid</h6>
                                        <h3 className="dashboard-stat-number text-success" data-stat="laporan-valid">{dashboardData.totalLaporanValid}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManajerDashboard;
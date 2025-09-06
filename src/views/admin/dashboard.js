import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [data, setData] = useState({
        totalManajerAktif: 0,
        totalManajerProses: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:3000/API/admin/dashboard', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

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
            <div className="row g-0 m-0">
                <div className="col-lg-6 col-md-6 col-sm-12 p-3">
                    <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}>
                        <div className="card-body p-4 text-white">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-white-50 small fw-medium mb-1">Manajer Aktif</div>
                                    <div className="h2 mb-0 fw-bold">{data.totalManajerAktif}</div>
                                    <div className="small text-white-50 mt-1">
                                        <i className="bi bi-check-circle me-1"></i>
                                        Status Aktif
                                    </div>
                                </div>
                                <div className="text-end">
                                    <i className="bi bi-people-fill" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 col-md-6 col-sm-12 p-3">
                    <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)' }}>
                        <div className="card-body p-4 text-white">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-white-50 small fw-medium mb-1">Manajer Proses</div>
                                    <div className="h2 mb-0 fw-bold">{data.totalManajerProses}</div>
                                    <div className="small text-white-50 mt-1">
                                        <i className="bi bi-clock me-1"></i>
                                        Dalam Proses
                                    </div>
                                </div>
                                <div className="text-end">
                                    <i className="bi bi-hourglass-split" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;


import React, { useState, useEffect } from 'react';

const Marketer = () => {
    const [marketers, setMarketers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMarketer, setSelectedMarketer] = useState(null);
    const [updateStatus, setUpdateStatus] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchMarketers();
    }, []);

    const fetchMarketers = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:3001/API/manajer/marketers', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMarketers(data.marketers);
            } else {
                if (window.messagesDashboard) {
                    window.messagesDashboard.error('Gagal memuat data marketer');
                }
            }
        } catch (error) {
            console.error('Error fetching marketers:', error);
            if (window.messagesDashboard) {
                window.messagesDashboard.error('Terjadi kesalahan pada server');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedMarketer || !updateStatus) return;

        setActionLoading(true);
        const token = localStorage.getItem('token');

        try {
            const formData = new URLSearchParams();
            formData.append('status', updateStatus);

            const response = await fetch(`http://localhost:3001/API/manajer/marketer/update-status/${selectedMarketer.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                setShowUpdateModal(false);
                setActionLoading(false);
                fetchMarketers();
                if (window.messagesDashboard) {
                    window.messagesDashboard.success(result.message || 'Status berhasil diperbarui');
                }
            } else {
                const error = await response.json();
                setActionLoading(false);
                if (window.messagesDashboard) {
                    window.messagesDashboard.error(error.message || 'Gagal memperbarui status');
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
            setActionLoading(false);
            if (window.messagesDashboard) {
                window.messagesDashboard.error('Terjadi kesalahan pada server');
            }
        }
    };

    const handleDeleteMarketer = async () => {
        if (!selectedMarketer) return;

        setActionLoading(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:3001/API/manajer/marketer/${selectedMarketer.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                setShowDeleteModal(false);
                setActionLoading(false);
                fetchMarketers();
                if (window.messagesDashboard) {
                    window.messagesDashboard.success(result.message || 'Marketer berhasil dihapus');
                }
            } else {
                const error = await response.json();
                setActionLoading(false);
                if (window.messagesDashboard) {
                    window.messagesDashboard.error(error.message || 'Gagal menghapus marketer');
                }
            }
        } catch (error) {
            console.error('Error deleting marketer:', error);
            setActionLoading(false);
            if (window.messagesDashboard) {
                window.messagesDashboard.error('Terjadi kesalahan pada server');
            }
        }
    };

    const openUpdateModal = (marketer) => {
        setSelectedMarketer(marketer);
        setUpdateStatus(marketer.status);
        setShowUpdateModal(true);
    };

    const openDeleteModal = (marketer) => {
        setSelectedMarketer(marketer);
        setShowDeleteModal(true);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Aktif':
                return <span className="badge bg-success marketer-status-badge">Aktif</span>;
            case 'Proses':
                return <span className="badge bg-warning marketer-status-badge">Proses</span>;
            case 'Non-Aktif':
                return <span className="badge bg-danger marketer-status-badge">Non-Aktif</span>;
            default:
                return <span className="badge bg-secondary marketer-status-badge">{status}</span>;
        }
    };

    if (loading) {
        return (
            <div className="marketer-loading-overlay">
                <div className="marketer-loading-content">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Memuat...</span>
                    </div>
                    <h5 className="text-muted">Memuat data marketer...</h5>
                </div>
            </div>
        );
    }

    return (
        <div className="w-100" style={{ margin: 0, padding: 0 }}>
            <div className="p-4">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e9ecef' }}>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0 marketer-table">
                                <thead style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                                    <tr>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark" style={{ fontSize: '14px' }}>No</th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark text-start" style={{ fontSize: '14px' }}>Nama</th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark text-start" style={{ fontSize: '14px' }}>Email</th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark text-start" style={{ fontSize: '14px' }}>Nomor WA</th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark text-start" style={{ fontSize: '14px' }}>Status</th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark text-center" style={{ fontSize: '14px' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {marketers.map((marketer, index) => (
                                        <tr key={marketer.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                                            <td className="py-4 px-4 text-center fw-medium text-muted" style={{ fontSize: '14px' }}>{index + 1}</td>
                                            <td className="py-4 px-4 fw-semibold text-dark text-start" style={{ fontSize: '14px' }}>{marketer.nama}</td>
                                            <td className="py-4 px-4 text-muted text-start" style={{ fontSize: '14px' }}>{marketer.email}</td>
                                            <td className="py-4 px-4 text-muted text-start" style={{ fontSize: '14px' }}>{marketer.nomor_wa}</td>
                                            <td className="py-4 px-4 text-start">{getStatusBadge(marketer.status)}</td>
                                            <td className="py-4 px-4 text-center">
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <button
                                                        className="btn btn-outline-primary btn-sm marketer-action-btn"
                                                        onClick={() => openUpdateModal(marketer)}
                                                        disabled={actionLoading}
                                                    >
                                                        <i className="bi bi-pencil me-1"></i>
                                                        Edit
                                                    </button>
                                                    {marketer.status === 'Non-Aktif' && (
                                                        <button
                                                            className="btn btn-outline-danger btn-sm marketer-action-btn"
                                                            onClick={() => openDeleteModal(marketer)}
                                                            disabled={actionLoading}
                                                        >
                                                            <i className="bi bi-trash me-1"></i>
                                                            Hapus
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`modal fade marketer-modal ${showUpdateModal ? 'show' : ''}`} style={{ display: showUpdateModal ? 'block' : 'none' }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Status Marketer</h5>
                            <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Nama Marketer</label>
                                <input type="text" className="form-control" value={selectedMarketer?.nama || ''} readOnly />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select className="form-select" value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)}>
                                    <option value="Aktif">Aktif</option>
                                    <option value="Proses">Proses</option>
                                    <option value="Non-Aktif">Non-Aktif</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>
                                Batal
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleUpdateStatus} disabled={actionLoading}>
                                {actionLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Memproses...
                                    </>
                                ) : (
                                    'Update'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`modal fade marketer-modal ${showDeleteModal ? 'show' : ''}`} style={{ display: showDeleteModal ? 'block' : 'none' }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Konfirmasi Hapus</h5>
                            <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p>Apakah Anda yakin ingin menghapus marketer <strong>{selectedMarketer?.nama}</strong>?</p>
                            <p className="text-muted small">Tindakan ini tidak dapat dibatalkan.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                                Batal
                            </button>
                            <button type="button" className="btn btn-danger" onClick={handleDeleteMarketer} disabled={actionLoading}>
                                {actionLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Menghapus...
                                    </>
                                ) : (
                                    'Hapus'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showUpdateModal && <div className="modal-backdrop fade show"></div>}
            {showDeleteModal && <div className="modal-backdrop fade show"></div>}
            {actionLoading && (
                <div className="marketer-loading-overlay">
                    <div className="marketer-loading-content">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Memproses...</span>
                        </div>
                        <h5 className="text-muted">Memproses permintaan...</h5>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Marketer;



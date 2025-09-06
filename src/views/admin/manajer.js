import React, { useState, useEffect } from 'react';
import '../../components/messages/messagesDashboard.js';

const ManajerPage = () => {
    const [manajers, setManajers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedManajer, setSelectedManajer] = useState(null);
    const [updateStatus, setUpdateStatus] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchManajers();
    }, []);

    const fetchManajers = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:3001/API/admin/manajer', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setManajers(data.result);
            }
        } catch (error) {
            console.error('Error fetching manajers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedManajer || !updateStatus) return;

        setActionLoading(true);
        const token = localStorage.getItem('token');

        try {
            const formData = new URLSearchParams();
            formData.append('status', updateStatus);

            const response = await fetch(`http://localhost:3001/API/admin/manajer/${selectedManajer.id}`, {
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
                fetchManajers();
                if (window.messagesDashboard) {
                    await window.messagesDashboard.success(result.message || 'Status berhasil diperbarui');
                }
            } else {
                const error = await response.json();
                if (window.messagesDashboard) {
                    await window.messagesDashboard.error(error.message || 'Gagal memperbarui status');
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
            if (window.messagesDashboard) {
                await window.messagesDashboard.error('Terjadi kesalahan pada server');
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteManajer = async () => {
        if (!selectedManajer) return;

        setActionLoading(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:3001/API/admin/manajer/${selectedManajer.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                setShowDeleteModal(false);
                fetchManajers();
                if (window.messagesDashboard) {
                    await window.messagesDashboard.success(result.message || 'Manajer berhasil dihapus');
                }
            } else {
                const error = await response.json();
                if (window.messagesDashboard) {
                    await window.messagesDashboard.error(error.message || 'Gagal menghapus manajer');
                }
            }
        } catch (error) {
            console.error('Error deleting manajer:', error);
            if (window.messagesDashboard) {
                await window.messagesDashboard.error('Terjadi kesalahan pada server');
            }
        } finally {
            setActionLoading(false);
        }
    };

    const openUpdateModal = (manajer) => {
        setSelectedManajer(manajer);
        setUpdateStatus(manajer.status);
        setShowUpdateModal(true);
    };

    const openDeleteModal = (manajer) => {
        setSelectedManajer(manajer);
        setShowDeleteModal(true);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Aktif':
                return <span className="badge bg-success">Aktif</span>;
            case 'Proses':
                return <span className="badge bg-warning">Proses</span>;
            case 'Non-Aktif':
                return <span className="badge bg-danger">Non-Aktif</span>;
            default:
                return <span className="badge bg-secondary">{status}</span>;
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
                <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e9ecef' }}>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                                    <tr>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark" style={{ fontSize: '14px' }}>No</th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark text-start" style={{ fontSize: '14px' }}>Nama</th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark text-start" style={{ fontSize: '14px' }}>Email</th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark text-start" style={{ fontSize: '14px' }}>Status</th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark text-center" style={{ fontSize: '14px' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {manajers.map((manajer, index) => (
                                        <tr key={manajer.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                                            <td className="py-4 px-4 text-center fw-medium text-muted" style={{ fontSize: '14px' }}>{index + 1}</td>
                                            <td className="py-4 px-4 fw-semibold text-dark text-start" style={{ fontSize: '14px' }}>{manajer.nama}</td>
                                            <td className="py-4 px-4 text-muted text-start" style={{ fontSize: '14px' }}>{manajer.email}</td>
                                            <td className="py-4 px-4 text-start">{getStatusBadge(manajer.status)}</td>
                                            <td className="py-4 px-4 text-center">
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <button
                                                        className="btn btn-outline-primary btn-sm"
                                                        onClick={() => openUpdateModal(manajer)}
                                                        disabled={actionLoading}
                                                        style={{ 
                                                            borderRadius: '8px', 
                                                            padding: '6px 12px',
                                                            fontSize: '12px',
                                                            fontWeight: '500',
                                                            transition: 'all 0.2s ease-in-out'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.transform = 'translateY(-2px)';
                                                            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.transform = 'translateY(0)';
                                                            e.target.style.boxShadow = 'none';
                                                        }}
                                                    >
                                                        <i className="bi bi-pencil me-1"></i>
                                                        Edit
                                                    </button>
                                                    {manajer.status === 'Non-Aktif' && (
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => openDeleteModal(manajer)}
                                                            disabled={actionLoading}
                                                            style={{ 
                                                                borderRadius: '8px', 
                                                                padding: '6px 12px',
                                                                fontSize: '12px',
                                                                fontWeight: '500',
                                                                transition: 'all 0.2s ease-in-out'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.transform = 'translateY(-2px)';
                                                                e.target.style.boxShadow = '0 4px 8px rgba(220,53,69,0.3)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.transform = 'translateY(0)';
                                                                e.target.style.boxShadow = 'none';
                                                            }}
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

            <div className={`modal fade ${showUpdateModal ? 'show' : ''}`} style={{ display: showUpdateModal ? 'block' : 'none' }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Status Manajer</h5>
                            <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Nama Manajer</label>
                                <input type="text" className="form-control" value={selectedManajer?.nama || ''} readOnly />
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

            <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} style={{ display: showDeleteModal ? 'block' : 'none' }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Konfirmasi Hapus</h5>
                            <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p>Apakah Anda yakin ingin menghapus manajer <strong>{selectedManajer?.nama}</strong>?</p>
                            <p className="text-muted small">Tindakan ini tidak dapat dibatalkan.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                                Batal
                            </button>
                            <button type="button" className="btn btn-danger" onClick={handleDeleteManajer} disabled={actionLoading}>
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
        </div>
    );
};

export default ManajerPage;



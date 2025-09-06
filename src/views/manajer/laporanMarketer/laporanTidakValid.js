import React, { useState, useEffect } from 'react';

const LaporanTidakValid = () => {
    const [laporan, setLaporan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        fetchLaporan();
    }, []);

    const fetchLaporan = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/';
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/API/manajer/laporan-marketers/tidak-valid', {
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
                setLaporan(data.laporan);
            } else {
                if (window.messagesDashboard) {
                    window.messagesDashboard.error('Gagal memuat data laporan');
                }
            }
        } catch (error) {
            console.error('Error fetching laporan:', error);
            if (window.messagesDashboard) {
                window.messagesDashboard.error('Terjadi kesalahan pada server');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (id) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(id)) {
            newExpandedRows.delete(id);
        } else {
            newExpandedRows.add(id);
        }
        setExpandedRows(newExpandedRows);
    };

    const openMap = (coordinates) => {
        const [longitude, latitude] = coordinates.split(', ');
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(url, '_blank');
    };

    const openImageModal = (imageName) => {
        setSelectedImage(`http://localhost:3001/images/laporanMarketers/${imageName}`);
        setShowImageModal(true);
        document.body.classList.add('modal-open');
    };

    const closeImageModal = () => {
        setShowImageModal(false);
        document.body.classList.remove('modal-open');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatText = (text) => {
        return text || '-';
    };

    if (loading) {
        return (
            <div className="laporan-loading-overlay">
                <div className="laporan-loading-content">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Memuat...</span>
                    </div>
                    <h5 className="text-muted">Memuat data laporan...</h5>
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
                            <table className="table table-hover mb-0 laporan-table">
                                <thead style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                                    <tr>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark" style={{ fontSize: '14px' }}>No</th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark text-start" style={{ fontSize: '14px' }}>Marketer</th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark text-start" style={{ fontSize: '14px' }}>Judul Laporan</th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark text-start" style={{ fontSize: '14px' }}>Koordinat</th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark text-center" style={{ fontSize: '14px' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {laporan.map((item, index) => (
                                        <React.Fragment key={item.id}>
                                            <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                                                <td className="py-4 px-4 text-center fw-medium text-muted" style={{ fontSize: '14px' }}>{index + 1}</td>
                                                <td className="py-4 px-4 fw-semibold text-dark text-start" style={{ fontSize: '14px' }}>{formatText(item.nama_marketer)}</td>
                                                <td className="py-4 px-4 text-muted text-start" style={{ fontSize: '14px' }}>{formatText(item.judul_laporan)}</td>
                                                <td className="py-4 px-4 text-start">
                                                    <button 
                                                        className="btn btn-link p-0 text-primary laporan-location-btn"
                                                        onClick={() => openMap(item.longitude_latitude)}
                                                        style={{ textDecoration: 'none', fontSize: '14px' }}
                                                    >
                                                        {formatText(item.longitude_latitude)}
                                                    </button>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <button
                                                        className="btn btn-outline-primary btn-sm laporan-action-btn"
                                                        onClick={() => toggleRow(item.id)}
                                                    >
                                                        <i className={`bi bi-chevron-${expandedRows.has(item.id) ? 'up' : 'down'} me-1`}></i>
                                                        {expandedRows.has(item.id) ? 'Tutup' : 'Detail'}
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedRows.has(item.id) && (
                                                <tr>
                                                    <td colSpan="5" className="p-0">
                                                        <div className="laporan-detail-content">
                                                            <div className="row">
                                                                <div className="col-lg-8">
                                                                    <div className="laporan-detail-section">
                                                                        <h6 className="laporan-detail-title">
                                                                            <i className="bi bi-file-text me-2"></i>Deskripsi Laporan
                                                                        </h6>
                                                                        <p className="laporan-detail-text">{formatText(item.deskripsi)}</p>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <div className="laporan-detail-section">
                                                                                <h6 className="laporan-detail-title">
                                                                                    <i className="bi bi-person-badge me-2"></i>Manajer
                                                                                </h6>
                                                                                <p className="laporan-detail-text">{formatText(item.nama_manajer)}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="laporan-detail-section">
                                                                                <h6 className="laporan-detail-title">
                                                                                    <i className="bi bi-calendar me-2"></i>Waktu Dibuat
                                                                                </h6>
                                                                                <p className="laporan-detail-text">{formatDate(item.waktu_dibuat)}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="laporan-detail-section">
                                                                        <h6 className="laporan-detail-title">
                                                                            <i className="bi bi-chat-dots me-2"></i>Catatan Manajer
                                                                        </h6>
                                                                        <p className="laporan-detail-text">{formatText(item.catatan_manajer)}</p>
                                                                    </div>
                                                                    <div className="laporan-detail-section">
                                                                        <h6 className="laporan-detail-title">
                                                                            <i className="bi bi-geo-alt me-2"></i>Detail Lokasi
                                                                        </h6>
                                                                        <p className="laporan-detail-text">{formatText(item.detail_lokasi)}</p>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <div className="laporan-detail-section">
                                                                                <h6 className="laporan-detail-title">
                                                                                    <i className="bi bi-pencil-square me-2"></i>Waktu Diedit
                                                                                </h6>
                                                                                <p className="laporan-detail-text">{formatDate(item.waktu_diedit)}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="laporan-detail-section">
                                                                        <h6 className="laporan-detail-title">
                                                                            <i className="bi bi-image me-2"></i>Foto Laporan
                                                                        </h6>
                                                                        <div className="laporan-image-container">
                                                                            {item.foto_laporan ? (
                                                                                <img 
                                                                                    src={`http://localhost:3001/images/laporanMarketers/${item.foto_laporan}`}
                                                                                    alt="Foto Laporan"
                                                                                    className="laporan-image"
                                                                                    onClick={() => openImageModal(item.foto_laporan)}
                                                                                />
                                                                            ) : (
                                                                                <div className="laporan-no-image">
                                                                                    <i className="bi bi-image text-muted" style={{ fontSize: '48px' }}></i>
                                                                                    <p className="text-muted mt-2">Tidak ada foto</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="laporan-detail-section">
                                                                        <h6 className="laporan-detail-title">
                                                                            <i className="bi bi-geo me-2"></i>Koordinat GPS
                                                                        </h6>
                                                                        <div className="laporan-coordinate-container">
                                                                            <p className="laporan-detail-text mb-2">{formatText(item.longitude_latitude)}</p>
                                                                            <button 
                                                                                className="btn btn-outline-primary btn-sm"
                                                                                onClick={() => openMap(item.longitude_latitude)}
                                                                            >
                                                                                <i className="bi bi-map me-1"></i>Buka di Maps
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {showImageModal && (
                <div className="modal fade laporan-modal show" style={{ display: 'block' }} tabIndex="-1" onClick={closeImageModal}>
                    <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Foto Laporan</h5>
                                <button type="button" className="btn-close" onClick={closeImageModal}></button>
                            </div>
                            <div className="modal-body text-center">
                                <img src={selectedImage} alt="Foto Laporan" className="img-fluid" style={{ maxHeight: '70vh' }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LaporanTidakValid;

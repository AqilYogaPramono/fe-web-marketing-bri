import React, { useState, useEffect } from 'react';

const LaporanProses = () => {
    const [laporan, setLaporan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [showValidasiModal, setShowValidasiModal] = useState(false);
    const [selectedLaporan, setSelectedLaporan] = useState(null);
    const [validasiType, setValidasiType] = useState('');
    const [catatanManajer, setCatatanManajer] = useState('');
    const [updating, setUpdating] = useState(false);

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
            const response = await fetch('http://localhost:3001/API/manajer/laporan-marketers/proses', {
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

    const openValidasiModal = (laporan, type) => {
        setSelectedLaporan(laporan);
        setValidasiType(type);
        setCatatanManajer('');
        setShowValidasiModal(true);
        document.body.classList.add('modal-open');
    };

    const closeValidasiModal = () => {
        setShowValidasiModal(false);
        setSelectedLaporan(null);
        setValidasiType('');
        setCatatanManajer('');
        document.body.classList.remove('modal-open');
    };

    const handleUpdateValidasi = async () => {
        if (!catatanManajer.trim()) {
            if (window.messagesDashboard) {
                window.messagesDashboard.error('Catatan manajer tidak boleh kosong');
            }
            return;
        }

        setUpdating(true);
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(`http://localhost:3001/API/manajer/laporan-marketers/update-validasi/${selectedLaporan.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: validasiType,
                    catatanManajer: catatanManajer.trim()
                })
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
                return;
            }

            if (response.ok) {
                if (window.messagesDashboard) {
                    window.messagesDashboard.success('Validasi laporan berhasil diperbarui');
                }
                closeValidasiModal();
                fetchLaporan();
            } else {
                const errorData = await response.json();
                if (window.messagesDashboard) {
                    window.messagesDashboard.error(errorData.message || 'Gagal memperbarui validasi');
                }
            }
        } catch (error) {
            console.error('Error updating validasi:', error);
            if (window.messagesDashboard) {
                window.messagesDashboard.error('Terjadi kesalahan pada server');
            }
        } finally {
            setUpdating(false);
        }
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
                                                                    <div className="laporan-detail-section">
                                                                        <h6 className="laporan-detail-title">
                                                                            <i className="bi bi-gear me-2"></i>Aksi Validasi
                                                                        </h6>
                                                                        <div className="d-flex flex-column gap-2">
                                                                            <button
                                                                                className="btn btn-success btn-sm"
                                                                                onClick={() => openValidasiModal(item, 'Valid')}
                                                                            >
                                                                                <i className="bi bi-check-circle me-1"></i>Valid
                                                                            </button>
                                                                            <button
                                                                                className="btn btn-danger btn-sm"
                                                                                onClick={() => openValidasiModal(item, 'Tidak valid')}
                                                                            >
                                                                                <i className="bi bi-x-circle me-1"></i>Tidak Valid
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

            {showValidasiModal && (
                <div className="modal fade laporan-modal show" style={{ display: 'block' }} tabIndex="-1" onClick={closeValidasiModal}>
                    <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                            <div className={`modal-header ${validasiType === 'Valid' ? 'validasi-success' : 'validasi-danger'}`} style={{ 
                                borderRadius: '16px 16px 0 0', 
                                padding: '25px'
                            }}>
                                <div className="d-flex align-items-start justify-content-between w-100">
                                    <div className="flex-grow-1">
                                        <h4 className="modal-title text-white mb-1 fw-bold text-start">
                                            {validasiType === 'Valid' ? 'Setujui Laporan' : 'Tolak Laporan'}
                                        </h4>
                                        <p className="text-white mb-0 opacity-75 text-start">
                                            {validasiType === 'Valid' ? 'Konfirmasi persetujuan laporan marketer' : 'Konfirmasi penolakan laporan marketer'}
                                        </p>
                                    </div>
                                    <button type="button" className="btn-close btn-close-white ms-3" onClick={closeValidasiModal}></button>
                                </div>
                            </div>
                            <div className="modal-body p-4">
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <div className="bg-light p-3 rounded-3">
                                            <label className="form-label fw-semibold text-muted mb-2">
                                                <i className="bi bi-file-text me-2"></i>Judul Laporan
                                            </label>
                                            <p className="mb-0 fw-medium">{selectedLaporan?.judul_laporan}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bg-light p-3 rounded-3">
                                            <label className="form-label fw-semibold text-muted mb-2">
                                                <i className="bi bi-person me-2"></i>Marketer
                                            </label>
                                            <p className="mb-0 fw-medium">{selectedLaporan?.nama_marketer}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="catatanManajer" className="form-label fw-semibold mb-3">
                                        <i className="bi bi-chat-dots me-2"></i>Catatan Manajer *
                                    </label>
                                    <textarea
                                        id="catatanManajer"
                                        className="form-control"
                                        rows="5"
                                        placeholder={`Masukkan catatan untuk ${validasiType === 'Valid' ? 'persetujuan' : 'penolakan'} laporan ini...`}
                                        value={catatanManajer}
                                        onChange={(e) => setCatatanManajer(e.target.value)}
                                        style={{ 
                                            resize: 'vertical', 
                                            borderRadius: '12px', 
                                            border: '2px solid #e9ecef',
                                            fontSize: '14px',
                                            padding: '15px'
                                        }}
                                    />
                                    <div className="form-text mt-2">
                                        <i className="bi bi-info-circle me-1"></i>
                                        Catatan ini akan dikirim ke marketer sebagai feedback
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer p-4" style={{ borderRadius: '0 0 16px 16px', backgroundColor: '#f8f9fa' }}>
                                <div className="d-flex justify-content-end gap-3 w-100">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary px-4 py-2" 
                                        onClick={closeValidasiModal} 
                                        disabled={updating}
                                        style={{ borderRadius: '8px', fontWeight: '500' }}
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="button" 
                                        className={`btn px-4 py-2 ${validasiType === 'Valid' ? 'btn-success' : 'btn-danger'}`}
                                        onClick={handleUpdateValidasi}
                                        disabled={updating || !catatanManajer.trim()}
                                        style={{ borderRadius: '8px', fontWeight: '500' }}
                                    >
                                        {updating ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                <i className={`bi bi-${validasiType === 'Valid' ? 'check-circle' : 'x-circle'} me-2`}></i>
                                                {validasiType === 'Valid' ? 'Setujui' : 'Tolak'} Laporan
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LaporanProses;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileManajer = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [nama, setNama] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/';
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/API/manajer', {
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
                setProfile(data.result[0]);
                setNama(data.result[0].nama);
            } else {
                if (window.messagesDashboard) {
                    window.messagesDashboard.error('Gagal memuat data profil');
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (window.messagesDashboard) {
                window.messagesDashboard.error('Terjadi kesalahan pada server');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateNama = async () => {
        if (!nama.trim()) {
            if (window.messagesDashboard) {
                window.messagesDashboard.error('Nama tidak boleh kosong');
            }
            return;
        }

        setUpdating(true);
        const token = localStorage.getItem('token');
        
        try {
            const formData = new URLSearchParams();
            formData.append('nama', nama.trim());

            const response = await fetch('http://localhost:3001/API/manajer/update-nama', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
                return;
            }

            if (response.ok) {
                if (window.messagesDashboard) {
                    window.messagesDashboard.success('Nama berhasil diupdate');
                }
                setEditing(false);
                fetchProfile();
            } else {
                const errorData = await response.json();
                if (window.messagesDashboard) {
                    window.messagesDashboard.error(errorData.message || 'Gagal mengupdate nama');
                }
            }
        } catch (error) {
            console.error('Error updating nama:', error);
            if (window.messagesDashboard) {
                window.messagesDashboard.error('Terjadi kesalahan pada server');
            }
        } finally {
            setUpdating(false);
        }
    };

    const handleCancelEdit = () => {
        if (profile) {
            setNama(profile.nama);
        }
        setEditing(false);
    };

    if (loading || !profile) {
        return (
            <div className="profile-loading-overlay">
                <div className="profile-loading-content">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Memuat...</span>
                    </div>
                    <h5 className="text-muted">Memuat data profil...</h5>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page-container">
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">

                        {/* Profile Content Cards */}
                        <div className="row g-4">
                            {/* Personal Information Card */}
                            <div className="col-12">
                                <div className="modern-card">
                                    <div className="card-header-modern">
                                        <div className="header-icon">
                                            <i className="bi bi-person-circle"></i>
                                        </div>
                                        <div className="header-content">
                                            <h3 className="header-title">Informasi Personal</h3>
                                            <p className="header-subtitle">Kelola data pribadi Anda</p>
                                        </div>
                                    </div>
                                    <div className="card-body-modern">
                                        {editing ? (
                                            <div className="edit-mode">
                                                <div className="form-group-modern">
                                                    <label className="form-label-modern">
                                                        <i className="bi bi-person me-2"></i>Nama Lengkap
                                                    </label>
                                                    <div className="input-wrapper-modern">
                                                        <input
                                                            type="text"
                                                            className="form-input-modern"
                                                            value={nama}
                                                            onChange={(e) => setNama(e.target.value)}
                                                            disabled={updating}
                                                            placeholder="Masukkan nama lengkap"
                                                        />
                                                        <div className="input-focus-border"></div>
                                                    </div>
                                                </div>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-modern btn-primary-modern"
                                                        onClick={handleUpdateNama}
                                                        disabled={updating}
                                                    >
                                                        {updating ? (
                                                            <>
                                                                <span className="spinner-modern"></span>
                                                                Menyimpan...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-check-circle me-2"></i>
                                                                Simpan Perubahan
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        className="btn-modern btn-secondary-modern"
                                                        onClick={handleCancelEdit}
                                                        disabled={updating}
                                                    >
                                                        <i className="bi bi-x-circle me-2"></i>Batal
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="display-mode">
                                                <div className="info-item-modern">
                                                    <div className="info-label">
                                                        <i className="bi bi-person me-2"></i>Nama Lengkap
                                                    </div>
                                                    <div className="info-content-modern">
                                                        <span className="info-value-modern">{profile?.nama || 'Loading...'}</span>
                                                        <button
                                                            className="btn-edit-modern"
                                                            onClick={() => setEditing(true)}
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                            <span>Edit</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Account Settings Card */}
                            <div className="col-12">
                                <div className="modern-card">
                                    <div className="card-header-modern">
                                        <div className="header-icon">
                                            <i className="bi bi-gear-fill"></i>
                                        </div>
                                        <div className="header-content">
                                            <h3 className="header-title">Pengaturan Akun</h3>
                                            <p className="header-subtitle">Kelola keamanan akun Anda</p>
                                        </div>
                                    </div>
                                    <div className="card-body-modern">
                                        <div className="row g-3">
                                            <div className="col-12 col-md-6">
                                                <div className="setting-item">
                                                    <div className="setting-icon">
                                                        <i className="bi bi-envelope"></i>
                                                    </div>
                                                    <div className="setting-content">
                                                        <h4 className="setting-title">Update Email</h4>
                                                        <p className="setting-description">Ubah alamat email Anda</p>
                                                    </div>
                                                    <button 
                                                        className="btn-setting-modern"
                                                        onClick={() => navigate('/manajer/profile/update-email')}
                                                    >
                                                        <i className="bi bi-arrow-right"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="col-12 col-md-6">
                                                <div className="setting-item">
                                                    <div className="setting-icon">
                                                        <i className="bi bi-shield-lock"></i>
                                                    </div>
                                                    <div className="setting-content">
                                                        <h4 className="setting-title">Update Password</h4>
                                                        <p className="setting-description">Ubah kata sandi Anda</p>
                                                    </div>
                                                    <button 
                                                        className="btn-setting-modern"
                                                        onClick={() => navigate('/manajer/profile/update-password')}
                                                    >
                                                        <i className="bi bi-arrow-right"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
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

export default ProfileManajer;
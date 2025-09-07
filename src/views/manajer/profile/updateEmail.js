import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateEmail = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        emailBaru: '',
        konfirmasiEmailBaru: ''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email.trim()) {
            window.messagesDashboard.error('Email lama diperlukan');
            return;
        }

        if (!formData.emailBaru.trim()) {
            window.messagesDashboard.error('Email baru diperlukan');
            return;
        }

        if (!formData.konfirmasiEmailBaru.trim()) {
            window.messagesDashboard.error('Konfirmasi email baru diperlukan');
            return;
        }

        if (formData.email === formData.emailBaru) {
            window.messagesDashboard.error('Email baru tidak boleh sama dengan email lama');
            return;
        }

        if (formData.emailBaru !== formData.konfirmasiEmailBaru) {
            window.messagesDashboard.error('Konfirmasi email baru tidak sesuai');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.emailBaru)) {
            window.messagesDashboard.error('Format email baru tidak valid');
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3001/API/manajer/update-email', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
                return;
            }

            const data = await response.json();

            if (response.ok) {
                window.messagesDashboard.success(data.message);
                navigate('/manajer/profile');
            } else {
                window.messagesDashboard.error(data.message);
            }
        } catch (error) {
            console.error('Error updating email:', error);
            window.messagesDashboard.error('Terjadi kesalahan pada server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-2">
            <div className="row">
                <div className="col-12">
                    <div className="update-card">
                            <div className="update-header">
                                <h2 className="header-title">Update Email</h2>
                            </div>

                            <div className="update-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group-modern">
                                        <label className="form-label-modern">
                                            <i className="bi bi-shield-lock me-2"></i>Email Lama (Verifikasi)
                                        </label>
                                        <div className="input-wrapper-modern">
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-input-modern"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                disabled={loading}
                                                placeholder="Masukkan email lama untuk verifikasi"
                                                required
                                            />
                                            <div className="input-focus-border"></div>
                                        </div>
                                    </div>

                                    <div className="form-group-modern">
                                        <label className="form-label-modern">
                                            <i className="bi bi-envelope-plus me-2"></i>Email Baru
                                        </label>
                                        <div className="input-wrapper-modern">
                                            <input
                                                type="email"
                                                name="emailBaru"
                                                className="form-input-modern"
                                                value={formData.emailBaru}
                                                onChange={handleInputChange}
                                                disabled={loading}
                                                placeholder="Masukkan email baru"
                                                required
                                            />
                                            <div className="input-focus-border"></div>
                                        </div>
                                    </div>

                                    <div className="form-group-modern">
                                        <label className="form-label-modern">
                                            <i className="bi bi-envelope-check me-2"></i>Konfirmasi Email Baru
                                        </label>
                                        <div className="input-wrapper-modern">
                                            <input
                                                type="email"
                                                name="konfirmasiEmailBaru"
                                                className="form-input-modern"
                                                value={formData.konfirmasiEmailBaru}
                                                onChange={handleInputChange}
                                                disabled={loading}
                                                placeholder="Konfirmasi email baru"
                                                required
                                            />
                                            <div className="input-focus-border"></div>
                                        </div>
                                    </div>

                                    <div className="action-buttons">
                                        <button
                                            type="button"
                                            className="btn-modern btn-secondary-modern"
                                            onClick={() => navigate('/manajer/profile')}
                                            disabled={loading}
                                        >
                                            <i className="bi bi-arrow-left me-2"></i>Kembali
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-modern btn-primary-modern"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-modern"></span>
                                                    Memproses...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-check-circle me-2"></i>
                                                    Update Email
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateEmail;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        kataSandiLama: '',
        kataSandiBaru: '',
        konfirmasiKataSandiBaru: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        kataSandiLama: false,
        kataSandiBaru: false,
        konfirmasiKataSandiBaru: false
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 6) {
            errors.push('Minimal 6 karakter');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Mengandung huruf kapital');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Mengandung huruf kecil');
        }
        if (!/\d/.test(password)) {
            errors.push('Mengandung angka');
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.kataSandiLama.trim()) {
            window.messagesDashboard.error('Kata sandi lama diperlukan');
            return;
        }

        if (!formData.kataSandiBaru.trim()) {
            window.messagesDashboard.error('Kata sandi baru diperlukan');
            return;
        }

        if (!formData.konfirmasiKataSandiBaru.trim()) {
            window.messagesDashboard.error('Konfirmasi kata sandi baru diperlukan');
            return;
        }

        const passwordErrors = validatePassword(formData.kataSandiBaru);
        if (passwordErrors.length > 0) {
            window.messagesDashboard.error(`Kata sandi harus: ${passwordErrors.join(', ')}`);
            return;
        }

        if (formData.kataSandiBaru !== formData.konfirmasiKataSandiBaru) {
            window.messagesDashboard.error('Kata sandi baru dan konfirmasi tidak cocok');
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3001/API/manajer/update-password', {
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
            console.error('Error updating password:', error);
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
                                <h2 className="header-title">Update Password</h2>
                            </div>

                            <div className="update-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group-modern">
                                        <label className="form-label-modern">
                                            <i className="bi bi-lock me-2"></i>Kata Sandi Lama
                                        </label>
                                        <div className="input-wrapper-modern">
                                            <input
                                                type={showPasswords.kataSandiLama ? 'text' : 'password'}
                                                name="kataSandiLama"
                                                className="form-input-modern"
                                                value={formData.kataSandiLama}
                                                onChange={handleInputChange}
                                                disabled={loading}
                                                placeholder="Masukkan kata sandi lama"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => togglePasswordVisibility('kataSandiLama')}
                                            >
                                                <i className={`bi ${showPasswords.kataSandiLama ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                            </button>
                                            <div className="input-focus-border"></div>
                                        </div>
                                    </div>

                                    <div className="form-group-modern">
                                        <label className="form-label-modern">
                                            <i className="bi bi-key me-2"></i>Kata Sandi Baru
                                        </label>
                                        <div className="input-wrapper-modern">
                                            <input
                                                type={showPasswords.kataSandiBaru ? 'text' : 'password'}
                                                name="kataSandiBaru"
                                                className="form-input-modern"
                                                value={formData.kataSandiBaru}
                                                onChange={handleInputChange}
                                                disabled={loading}
                                                placeholder="Masukkan kata sandi baru"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => togglePasswordVisibility('kataSandiBaru')}
                                            >
                                                <i className={`bi ${showPasswords.kataSandiBaru ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                            </button>
                                            <div className="input-focus-border"></div>
                                        </div>
                                        <div className="password-requirements">
                                            <small className="text-muted">
                                                Kata sandi harus minimal 6 karakter, mengandung huruf kapital, huruf kecil, dan angka
                                            </small>
                                        </div>
                                    </div>

                                    <div className="form-group-modern">
                                        <label className="form-label-modern">
                                            <i className="bi bi-check-circle me-2"></i>Konfirmasi Kata Sandi Baru
                                        </label>
                                        <div className="input-wrapper-modern">
                                            <input
                                                type={showPasswords.konfirmasiKataSandiBaru ? 'text' : 'password'}
                                                name="konfirmasiKataSandiBaru"
                                                className="form-input-modern"
                                                value={formData.konfirmasiKataSandiBaru}
                                                onChange={handleInputChange}
                                                disabled={loading}
                                                placeholder="Konfirmasi kata sandi baru"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => togglePasswordVisibility('konfirmasiKataSandiBaru')}
                                            >
                                                <i className={`bi ${showPasswords.konfirmasiKataSandiBaru ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                            </button>
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
                                                    Update Password
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

export default UpdatePassword;
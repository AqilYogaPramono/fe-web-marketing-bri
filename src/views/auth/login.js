import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import BRI from '../../assets/images/BRI.png';
import MessagesAuth from '../../components/messages/messagesAuth';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();

    const showErrorMessage = (errorMsg) => {
        setMessage(errorMsg);
        setMessageType('error');
        setShowMessage(true);
    };

    const showSuccessMessage = (successMsg) => {
        setMessage(successMsg);
        setMessageType('success');
        setShowMessage(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            showErrorMessage('Email dan password wajib diisi.');
            return;
        }
        setLoading(true);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const urlEncoded = new URLSearchParams();
            urlEncoded.append('email', email);
            urlEncoded.append('password', password);

            const response = await fetch('http://localhost:3001/API/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Accept': 'application/json' },
                body: urlEncoded.toString(),
                signal: controller.signal
            }).catch((err) => {
                throw err;
            });

            clearTimeout(timeoutId);

            const contentType = response.headers.get('content-type') || '';
            const rawText = await response.text().catch(() => '');
            let result = null;
            if (contentType.includes('application/json')) {
                try {
                    result = rawText ? JSON.parse(rawText) : null;
                } catch (_) {
                    result = null;
                }
            }

            if (!response.ok) {
                let serverMessage = 'Terjadi kesalahan. Coba lagi nanti.';
                if (result && result.message) {
                    serverMessage = result.message;
                } else if (rawText && rawText.trim()) {
                    if (rawText.startsWith('<!DOCTYPE') || rawText.startsWith('<html')) {
                        if (response.status === 404) serverMessage = 'Endpoint tidak ditemukan.';
                        else if (response.status === 405) serverMessage = 'Metode tidak diizinkan.';
                        else serverMessage = 'Terjadi kesalahan pada server.';
                    } else {
                        serverMessage = rawText;
                    }
                }
                throw { isServer: true, message: serverMessage };
            }

            const { token } = (result || {});
            if (!token) {
                throw new Error('Token tidak ditemukan. Coba lagi nanti.');
            }
            localStorage.setItem('token', token);

            const payload = JSON.parse(atob(token.split('.')[1]));
            const userType = payload.userType;

            const normalized = (userType || '').toString();
            if (normalized === 'Admin') {
                navigate('/admin/dashboard', { replace: true });
            } else if (normalized === 'Manajer' || normalized === 'Marketer') {
                navigate('/manajer/dashboard', { replace: true });
            } else {
                showSuccessMessage('Login berhasil.');
            }

        } catch (err) {
            if (err && err.isServer && err.message) {
                showErrorMessage(err.message);
            } else {
                const isAbort = err && (err.name === 'AbortError' || err.code === 'ABORT_ERR');
                const isNetwork = err && (err.name === 'TypeError' || err.message === 'Failed to fetch');
                const fallback = isAbort || isNetwork ? 'Server tidak merespons. Coba lagi nanti.' : (err && err.message ? err.message : 'Terjadi kesalahan. Coba lagi nanti.');
                showErrorMessage(fallback);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="login-container">
                <div className="login-background">
                    <div className="login-overlay"></div>
                </div>
                
                <div className="login-wrapper">
                    <div className="login-card">
                        <div className="login-header">
                            <div className="logo-container">
                                <img src={BRI} alt="BRI Logo" className="logo" />
                            </div>
                            <h1 className="login-title">Selamat Datang</h1>
                            <p className="login-subtitle">Masuk ke akun Anda untuk melanjutkan</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <FaUser className="input-icon" />
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="Masukkan email Anda"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <FaLock className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-input"
                                        placeholder="Masukkan password Anda"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`login-button ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="loading-spinner">
                                        <div className="spinner"></div>
                                        <span>Memproses...</span>
                                    </div>
                                ) : (
                                    'Masuk'
                                )}
                            </button>
                            <p className="footer-text" style={{ marginTop: '10px', textAlign: 'center' }}>
                                Belum punya akun? <Link to="/register" className="text-primary">Daftar</Link>
                            </p>
                        </form>

                        <div className="login-footer">
                            <p className="footer-text">
                                © 2024 Bank Rakyat Indonesia. Semua hak dilindungi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <MessagesAuth
                message={message}
                type={messageType}
                isVisible={showMessage}
                onClose={() => setShowMessage(false)}
            />
        </>
    );
}

export default Login;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import BRI from '../../assets/images/BRI.png';
import MessagesAuth from '../../components/messages/messagesAuth';

function Register() {
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [kataSandi, setKataSandi] = useState('');
    const [konfirmasiKataSandi, setKonfirmasiKataSandi] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const showErrorMessage = (msg) => {
        setMessage(msg);
        setMessageType('error');
        setShowMessage(true);
    };

    const showSuccessMessage = (msg) => {
        setMessage(msg);
        setMessageType('success');
        setShowMessage(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nama || !email || !kataSandi || !konfirmasiKataSandi) {
            showErrorMessage('Semua field wajib diisi.');
            return;
        }
        setLoading(true);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const form = new URLSearchParams();
            form.append('nama', nama);
            form.append('email', email);
            form.append('kataSandi', kataSandi);
            form.append('konfirmasiKataSandi', konfirmasiKataSandi);

            const response = await fetch('http://localhost:3001/API/register-manajer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Accept': 'application/json' },
                body: form.toString(),
                signal: controller.signal
            }).catch((err) => { throw err; });

            clearTimeout(timeoutId);

            const contentType = response.headers.get('content-type') || '';
            const rawText = await response.text().catch(() => '');
            let result = null;
            if (contentType.includes('application/json')) {
                try { result = rawText ? JSON.parse(rawText) : null; } catch (_) { result = null; }
            }

            if (!response.ok) {
                let serverMessage = 'Terjadi kesalahan. Coba lagi nanti.';
                if (result && result.message) serverMessage = result.message;
                else if (rawText && rawText.trim()) {
                    if (rawText.startsWith('<!DOCTYPE') || rawText.startsWith('<html')) {
                        if (response.status === 404) serverMessage = 'Endpoint tidak ditemukan.';
                        else if (response.status === 405) serverMessage = 'Metode tidak diizinkan.';
                        else serverMessage = 'Terjadi kesalahan pada server.';
                    } else serverMessage = rawText;
                }
                throw { isServer: true, message: serverMessage };
            }

            const successMsg = result && result.message ? result.message : 'Pendaftaran berhasil.';
            showSuccessMessage(successMsg);
            setNama('');
            setEmail('');
            setKataSandi('');
            setKonfirmasiKataSandi('');

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
                        <div className="login-header" style={{ marginBottom: 16 }}>
                            <div className="logo-container">
                                <img src={BRI} alt="BRI Logo" className="logo" />
                            </div>
                            <h1 className="login-title">Daftar Akun Manajer</h1>
                            <p className="login-subtitle">Lengkapi data Anda untuk mendaftar</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <FaUser className="input-icon" />
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Nama lengkap"
                                        value={nama}
                                        onChange={(e) => setNama(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <FaEnvelope className="input-icon" />
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="Email"
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
                                        placeholder="Kata sandi"
                                        value={kataSandi}
                                        onChange={(e) => setKataSandi(e.target.value)}
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

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <FaLock className="input-icon" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="form-input"
                                        placeholder="Konfirmasi kata sandi"
                                        value={konfirmasiKataSandi}
                                        onChange={(e) => setKonfirmasiKataSandi(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
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
                                    'Daftar'
                                )}
                            </button>
                            <p className="footer-text" style={{ marginTop: '10px', textAlign: 'center' }}>
                                Sudah punya akun? <Link to="/login" className="text-primary">Masuk</Link>
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

export default Register;



import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const MessagesAuth = ({ message = '', type = 'success', isVisible = false, onClose = () => {} }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
            
            const timer = setTimeout(() => {
                setIsAnimating(false);
                setTimeout(() => {
                    onClose();
                }, 300);
            }, type === 'error' ? 8000 : 5000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, type, onClose]);

    if (!isVisible && !isAnimating) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <FaCheckCircle className="message-icon success" />;
            case 'error':
                return <FaExclamationTriangle className="message-icon error" />;
            default:
                return <FaCheckCircle className="message-icon success" />;
        }
    };

    return (
        <div className={`message-toast ${isAnimating ? 'show' : 'hide'}`}>
            <div className={`toast-content ${type === 'error' ? 'error' : 'success'}`}>
                <div className="toast-icon">
                    {getIcon()}
                </div>
                <div className="toast-message">
                    <p>{message}</p>
                </div>
                <button 
                    className="toast-close" 
                    onClick={() => {
                        setIsAnimating(false);
                        setTimeout(() => onClose(), 300);
                    }}
                >
                    <FaTimes />
                </button>
                <div className="toast-progress">
                    <div 
                        className="progress-fill" 
                        style={{
                            animationDuration: `${type === 'error' ? 8 : 5}s`
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default MessagesAuth;

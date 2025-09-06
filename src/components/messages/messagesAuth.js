import React, { useEffect, useState, useRef, useCallback } from 'react';

const MessagesAuth = ({ message = '', type = 'success', isVisible = false, onClose = () => {} }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const timeoutRef = useRef(null);
    const animationTimeoutRef = useRef(null);

    const handleClose = useCallback(() => {
        setIsAnimating(false);
        animationTimeoutRef.current = setTimeout(() => {
            onClose();
        }, 300);
    }, [onClose]);

    useEffect(() => {
        if (isVisible && message) {
            setIsAnimating(true);
            
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
            
            const duration = type === 'error' ? 8000 : 5000;
            
            timeoutRef.current = setTimeout(() => {
                handleClose();
            }, duration);
        }
    }, [isVisible, message, type, handleClose]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
        };
    }, []);

    if (!isVisible || !message) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            default:
                return '✓';
        }
    };

    const getTitle = () => {
        return '';
    };

    return (
        <div className={`message-toast-auth ${isAnimating ? 'show' : 'hide'}`}>
            <div className={`toast-content-auth ${type}`}>
                <div className="toast-message-content-auth">
                    <div className={`toast-icon-auth ${type}`}>
                        {getIcon()}
                    </div>
                    <div className="toast-message-text-auth">
                        <div className="toast-message-description-auth">{message}</div>
                    </div>
                    <button 
                        className="toast-close-auth" 
                        onClick={handleClose}
                    >
                        ×
                    </button>
                </div>
                <div className="toast-progress-auth">
                    <div 
                        className="progress-fill-auth" 
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

class MessagesDashboard {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        this.createContainer();
        this.attachStyles();
    }

    // Fungsi untuk validasi token dan auto logout
    validateToken() {
        const token = localStorage.getItem('token');
        if (!token) {
            this.logout();
            return false;
        }

        try {
            // Decode JWT token untuk cek expiry
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            
            if (payload.exp < currentTime) {
                this.logout();
                return false;
            }
            return true;
        } catch (error) {
            console.error('Token validation error:', error);
            this.logout();
            return false;
        }
    }

    // Fungsi logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'messages-dashboard-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            width: 100%;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
    }

    attachStyles() {
        if (document.getElementById('messages-dashboard-styles')) return;

        const style = document.createElement('style');
        style.id = 'messages-dashboard-styles';
        style.textContent = `
            #messages-dashboard-container {
                position: fixed !important;
                top: 80px !important;
                right: 20px !important;
                z-index: 10000 !important;
                max-width: 320px !important;
                width: 320px !important;
                pointer-events: none !important;
            }

            .message-toast {
                background: white !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
                margin-bottom: 10px !important;
                overflow: hidden !important;
                transform: translateX(100%) !important;
                transition: all 0.3s ease-out !important;
                border-left: 4px solid #00569E !important;
                position: relative !important;
                margin-left: auto !important;
                opacity: 0 !important;
                pointer-events: auto !important;
                width: 100% !important;
                min-height: 60px !important;
                max-height: 120px !important;
            }

            .message-toast.show {
                transform: translateX(0) !important;
                opacity: 1 !important;
            }

            .message-toast.hide {
                transform: translateX(100%) !important;
                opacity: 0 !important;
            }

            .message-toast.success {
                border-left-color: #28a745 !important;
            }

            .message-toast.error {
                border-left-color: #dc3545 !important;
            }

            .message-toast.warning {
                border-left-color: #ffc107 !important;
            }

            .message-content {
                padding: 10px 14px !important;
                display: flex !important;
                align-items: flex-start !important;
                gap: 8px !important;
            }

            .message-icon {
                flex-shrink: 0 !important;
                width: 16px !important;
                height: 16px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                border-radius: 50% !important;
                font-size: 9px !important;
                color: white !important;
                margin-top: 1px !important;
            }

            .message-icon.success {
                background: #28a745 !important;
            }

            .message-icon.error {
                background: #dc3545 !important;
            }

            .message-icon.warning {
                background: #ffc107 !important;
            }

            .message-text {
                flex: 1 !important;
                min-width: 0 !important;
            }

            .message-title {
                font-weight: 600 !important;
                color: #172b4d !important;
                font-size: 12px !important;
                margin: 0 0 1px 0 !important;
            }

            .message-description {
                color: #6c757d !important;
                font-size: 11px !important;
                margin: 0 !important;
                line-height: 1.2 !important;
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
                white-space: normal !important;
                max-width: 100% !important;
            }

            .message-close {
                background: none !important;
                border: none !important;
                color: #6c757d !important;
                font-size: 12px !important;
                cursor: pointer !important;
                padding: 1px !important;
                border-radius: 3px !important;
                transition: all 0.2s ease !important;
                flex-shrink: 0 !important;
                width: 18px !important;
                height: 18px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }

            .message-close:hover {
                background: rgba(0, 0, 0, 0.1) !important;
                color: #172b4d !important;
            }

            .message-progress {
                position: absolute !important;
                bottom: 0 !important;
                left: 0 !important;
                right: 0 !important;
                height: 2px !important;
                background: rgba(0, 0, 0, 0.1) !important;
                overflow: hidden !important;
            }

            .progress-fill {
                height: 100% !important;
                background: linear-gradient(90deg, #00569E 0%, #003d6b 100%) !important;
                animation: progressShrink 5s linear forwards !important;
            }

            .message-toast.error .progress-fill {
                background: linear-gradient(90deg, #dc3545 0%, #c82333 100%) !important;
                animation: progressShrink 8s linear forwards !important;
            }

            .message-toast.warning .progress-fill {
                background: linear-gradient(90deg, #ffc107 0%, #e0a800 100%) !important;
                animation: progressShrink 6s linear forwards !important;
            }

            @keyframes progressShrink {
                from { width: 100% !important; }
                to { width: 0% !important; }
            }

            @media (max-width: 768px) {
                #messages-dashboard-container {
                    top: 70px !important;
                    right: 10px !important;
                    left: 10px !important;
                    max-width: none !important;
                    width: calc(100% - 20px) !important;
                }
                
                .message-toast {
                    min-height: 50px !important;
                    max-height: 100px !important;
                }
                
                .message-content {
                    padding: 8px 12px !important;
                }
                
                .message-title {
                    font-size: 11px !important;
                }
                
                .message-description {
                    font-size: 10px !important;
                }
                
                .message-icon {
                    width: 14px !important;
                    height: 14px !important;
                    font-size: 8px !important;
                }
                
                .message-close {
                    width: 16px !important;
                    height: 16px !important;
                    font-size: 10px !important;
                }
            }

            .message-toast:hover {
                transform: translateX(0) scale(1.02) !important;
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
            }

            /* Override any conflicting styles from style.css */
            #messages-dashboard-container .message-toast {
                position: relative !important;
                top: auto !important;
                left: auto !important;
                transform: translateX(100%) !important;
                max-width: none !important;
                width: 100% !important;
            }

            #messages-dashboard-container .message-toast.show {
                transform: translateX(0) !important;
            }

            #messages-dashboard-container .message-toast.hide {
                transform: translateX(100%) !important;
            }
        `;
        document.head.appendChild(style);
    }

    async show(message, type = 'success', duration = 5000) {
        const messageElement = this.createMessageElement(message, type);
        this.container.appendChild(messageElement);

        setTimeout(() => {
            messageElement.classList.add('show');
        }, 100);

        // Pesan error tidak akan hilang kecuali ditekan X
        // Pesan sukses akan hilang setelah 5 detik
        if (type !== 'error') {
            setTimeout(() => {
                this.hide(messageElement);
            }, duration);
        }
    }

    createMessageElement(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-toast ${type}`;

        const iconMap = {
            success: '✓',
            error: '✕',
            warning: '⚠'
        };

        const titleMap = {
            success: 'Berhasil',
            error: 'Error',
            warning: 'Peringatan'
        };

        // Ambil nama user dari localStorage jika ada
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userName = user.nama || user.name || 'User';

        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-icon ${type}">${iconMap[type]}</div>
                <div class="message-text">
                    <div class="message-title">${titleMap[type]}</div>
                    <div class="message-description">${message}</div>
                </div>
                <button class="message-close" onclick="messagesDashboard.hide(this.closest('.message-toast'))">×</button>
            </div>
            <div class="message-progress">
                <div class="progress-fill"></div>
            </div>
        `;

        return messageDiv;
    }

    hide(messageElement) {
        if (!messageElement) return;

        messageElement.classList.add('hide');
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }

    async success(message) {
        await this.show(message, 'success', 5000);
    }

    async error(message) {
        await this.show(message, 'error', 0);
    }

    async warning(message) {
        await this.show(message, 'warning', 6000);
    }

    clear() {
        const messages = this.container.querySelectorAll('.message-toast');
        messages.forEach(message => this.hide(message));
    }
}

const messagesDashboard = new MessagesDashboard();
window.messagesDashboard = messagesDashboard;

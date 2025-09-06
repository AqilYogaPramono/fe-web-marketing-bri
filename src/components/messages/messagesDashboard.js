class MessagesDashboard {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        this.createContainer();
    }

    validateToken() {
        const token = localStorage.getItem('token');
        if (!token) {
            this.logout();
            return false;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            
            if (payload.exp < currentTime) {
                this.logout();
                return false;
            }
            return true;
        } catch (error) {
            this.logout();
            return false;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'messages-dashboard-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'success', duration = 5000) {
        const messageElement = this.createMessageElement(message, type);
        this.container.appendChild(messageElement);

        setTimeout(() => {
            messageElement.classList.add('show');
        }, 100);

        const autoHideDuration = type === 'error' ? 8000 : duration;
        setTimeout(() => {
            this.hide(messageElement);
        }, autoHideDuration);
    }

    showLoading(message = 'Loading...', type = 'loading') {
        const messageElement = this.createMessageElement(message, type);
        this.container.appendChild(messageElement);

        setTimeout(() => {
            messageElement.classList.add('show');
        }, 100);

        return messageElement;
    }

    createMessageElement(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-toast ${type}`;

        const iconMap = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            loading: '⟳'
        };

        const titleMap = {
            success: 'Berhasil',
            error: 'Error',
            warning: 'Peringatan',
            loading: 'Loading'
        };

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
                <div class="progress-fill" style="animation-duration: ${type === 'error' ? '8s' : type === 'loading' ? '0s' : type === 'warning' ? '6s' : '5s'}"></div>
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

    success(message) {
        this.show(message, 'success', 5000);
    }

    error(message) {
        this.show(message, 'error', 8000);
    }

    warning(message) {
        this.show(message, 'warning', 6000);
    }

    loading(message = 'Loading...') {
        return this.showLoading(message, 'loading');
    }

    clear() {
        const messages = this.container.querySelectorAll('.message-toast');
        messages.forEach(message => this.hide(message));
    }
}

const messagesDashboard = new MessagesDashboard();
window.messagesDashboard = messagesDashboard;

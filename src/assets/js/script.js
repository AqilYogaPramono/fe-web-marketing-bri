const AuthUtils = {
    checkTokenExpiry: () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch (error) {
            return false;
        }
    },
    
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    },
    
    handleTokenExpiry: () => {
        if (!AuthUtils.checkTokenExpiry()) {
            AuthUtils.logout();
        }
    },
    
    getToken: () => {
        return localStorage.getItem('token');
    },
    
    setToken: (token) => {
        localStorage.setItem('token', token);
    }
};

class MessageManager {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
        this.listeners = [];
    }

    addMessage(message, type, id) {
        const messageObj = {
            id: id || Date.now() + Math.random(),
            message,
            type,
            timestamp: Date.now()
        };
        
        this.queue.push(messageObj);
        this.notifyListeners();
        return messageObj.id;
    }

    removeMessage(id) {
        this.queue = this.queue.filter(msg => msg.id !== id);
        this.notifyListeners();
    }

    getNextMessage() {
        return this.queue.length > 0 ? this.queue[0] : null;
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.queue));
    }

    clear() {
        this.queue = [];
        this.notifyListeners();
    }
}

class DashboardManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.animateCards();
        });
    }

    animateCards() {
        const cards = document.querySelectorAll('.dashboard-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            }, index * 100);
        });
    }

    startAutoRefresh() {
        setInterval(() => {
            this.refreshDashboard();
        }, 300000);
    }

    async refreshDashboard() {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:3001/API/manajer/dashboard', {
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
                this.updateDashboardData(data);
            }
        } catch (error) {
            console.error('Error refreshing dashboard:', error);
        }
    }

    updateDashboardData(data) {
        const elements = {
            'totalMarketerAktif': document.querySelector('[data-stat="marketer-aktif"]'),
            'totalMarketerProses': document.querySelector('[data-stat="marketer-proses"]'),
            'totalLaporan': document.querySelector('[data-stat="total-laporan"]'),
            'totalLaporanProses': document.querySelector('[data-stat="laporan-proses"]'),
            'totalLaporanTidakValid': document.querySelector('[data-stat="laporan-tidak-valid"]'),
            'totalLaporanValid': document.querySelector('[data-stat="laporan-valid"]')
        };

        Object.keys(data).forEach(key => {
            if (elements[key]) {
                this.animateNumber(elements[key], data[key]);
            }
        });
    }

    animateNumber(element, newValue) {
        const currentValue = parseInt(element.textContent) || 0;
        const increment = (newValue - currentValue) / 20;
        let current = currentValue;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= newValue) || (increment < 0 && current <= newValue)) {
                current = newValue;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 50);
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
            console.error('Token validation error:', error);
            this.logout();
            return false;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }
}


const messageManager = new MessageManager();
const dashboardManager = new DashboardManager();

window.AuthUtils = AuthUtils;
window.messageManager = messageManager;
window.dashboardManager = dashboardManager;

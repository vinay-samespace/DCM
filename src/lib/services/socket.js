import { browser } from '$app/environment';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.listeners = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.manualDisconnect = false;
    }

    connect(hostId, container) {
        if (!browser) return;
        
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found for WebSocket connection');
            return;
        }

        try {
            console.log(`Connecting to WebSocket for container ${container} on host ${hostId}`);
            const wsUrl = `wss://as2.ss.dev/api/dcm/docker/logs?hostId=${hostId}&container=${container}&token=${token}`;
            
            this.socket = new WebSocket(wsUrl);

            this.socket.onopen = () => {
                console.log('WebSocket Connected Successfully');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.notifyListeners('connection', { status: 'connected' });
            };

            this.socket.onmessage = (event) => {
                console.log('Received log:', event.data);
                this.notifyListeners('logs', event.data);
            };

            this.socket.onclose = (event) => {
                console.log('WebSocket Closed:', event.code, event.reason);
                this.isConnected = false;
                this.notifyListeners('connection', { status: 'disconnected' });

                if (!this.manualDisconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                    setTimeout(() => this.connect(hostId, container), 2000);
                }
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket Error:', error);
                this.notifyListeners('error', error);
            };

        } catch (error) {
            console.error('WebSocket Connection Error:', error);
            this.notifyListeners('error', error);
        }
    }

    disconnect() {
        if (this.socket) {
            console.log('Manually disconnecting WebSocket');
            this.manualDisconnect = true;
            this.socket.close(1000, 'User initiated disconnect');
            this.socket = null;
            this.isConnected = false;
        }
    }

    subscribe(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
        return () => this.unsubscribe(event, callback);
    }

    unsubscribe(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
    }

    notifyListeners(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }

    getStatus() {
        return {
            isConnected: this.isConnected,
            readyState: this.socket?.readyState,
            reconnectAttempts: this.reconnectAttempts
        };
    }
}

export const socketService = new WebSocketService();
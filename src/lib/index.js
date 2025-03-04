// src/lib/index.js

// Export components
export { default as Button } from './components/Button.svelte';
export { default as Input } from './components/Input.svelte';
export { default as Card } from './components/Card.svelte';
export { default as Form } from './components/Form.svelte';
export { default as Header } from './components/Header.svelte';
export { default as Footer } from './components/Footer.svelte';
export { default as LogViewer } from './components/LogViewer.svelte';

// Export services
export { userApi, authApi } from './services/api';
export { WebSocketService, socketService } from './services/socket';

// Export utilities
export {
    getToken,
    setToken,
    removeToken,
    isAuthenticated,
    handleLoginSuccess,
    handleLogout,
    requireAuth
} from './utils/auth';

export {
    isValidEmail,
    formatDate,
    handleError,
    getUiBasePath,
    deepClone,
    uniqueBy,
    truncate,
    debounce
} from './utils/common';

// Export constants
export {
    API_CONFIG,
    ROUTES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    STORAGE_KEYS,
    UI,
    HTTP_STATUS,
    USER_ROLES,
    ENDPOINTS
} from './utils/constants'

// Helper functions that combine multiple utilities
export const combineHelpers = {
    async validateAndLogin(email, password) {
        if (!isValidEmail(email)) {
            throw new Error(ERROR_MESSAGES.AUTH.INVALID_EMAIL);
        }
        try {
            const response = await authApi.login({ email, password });
            await handleLoginSuccess(response);
            return response;
        } catch (error) {
            handleError(error);
            throw error;
        }
    },

    async requireAuthAndLoadUser(email) {
        if (!await requireAuth()) {
            return null;
        }
        try {
            return await userApi.getOne(email);
        } catch (error) {
            handleError(error);
            return null;
        }
    }
};

// WebSocket event types
export const WS_EVENTS = {
    LOG: 'log',
    USER_UPDATE: 'user_update',
    SYSTEM_ALERT: 'system_alert'
};

// Export any default configurations
export const DEFAULT_CONFIG = {
    pageSize: 10,
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    themes: {
        light: {
            primary: '#2563eb',
            secondary: '#6b7280',
            background: '#ffffff',
            text: '#1f2937'
        },
        dark: {
            primary: '#3b82f6',
            secondary: '#9ca3af',
            background: '#1f2937',
            text: '#ffffff'
        }
    }
};
// Device detection
export const getDevice = () => {
    const userAgent = navigator.userAgent;
    if (/mobile/i.test(userAgent)) return 'mobile';
    if (/tablet/i.test(userAgent)) return 'tablet';
    return 'desktop';
};

// Email validation
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Date formatting
export const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString();
};

// Error handling
export const handleError = (error) => {
    console.error('Error:', error);
    const message = error.response?.data?.message || error.message || 'An error occurred';
    toast.error(message);
    return message;
};

// URL helpers
export const getUiBasePath = () => {
    return import.meta.env.VITE_UI_BASE_PATH || '';
};

// Data helpers
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    return JSON.parse(JSON.stringify(obj));
};

// Array helpers
export const uniqueBy = (arr, key) => {
    return [...new Map(arr.map(item => [item[key], item])).values()];
};

// String helpers
export const truncate = (str, length = 50) => {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
};

// Object helpers
export const omit = (obj, keys) => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
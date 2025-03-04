export const BASE_URL = 'https://as2.ss.dev/api/dcm';

export const API_CONFIG = {
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    ERROR_MESSAGES: {
        AUTH: 'Authentication failed',
        NETWORK: 'Network error occurred',
        SERVER: 'Server error occurred',
        VALIDATION: 'Validation failed'
    }
};
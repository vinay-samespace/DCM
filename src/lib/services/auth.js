import { api } from './api';
import { storage } from '$lib/utils/storage';

export const authService = {

    async login(email) {
        try {
            const response = await api.post('/login', { email });
            
            // If token is received immediately, store it
            if (response.token) {
                storage.setToken(response.token);
            }
            
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Login failed. Please try again.');
        }
    },

    // Verify email code
    async verify(email, code) {
        try {
            const response = await api.post('/verify', { 
                email, 
                code 
            });

            // Store token after successful verification
            if (response.token) {
                storage.setToken(response.token);
            }

            return response;
        } catch (error) {
            console.error('Verification error:', error);
            throw new Error(error.message || 'Verification failed. Please try again.');
        }
    },

    // Logout user
    async logout() {
        try {
            // Call logout endpoint if needed
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local storage
            storage.clearAuth();
        }
    },

    // Check if user is authenticated
    isAuthenticated() {
        const token = storage.getToken();
        if (!token) return false;

        try {
            const payload = this.parseJwt(token);
            // Check if token is expired
            return payload.exp > Date.now() / 1000;
        } catch {
            return false;
        }
    },

    // Parse JWT token
    parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Token parsing error:', error);
            return null;
        }
    },

    // Get user info from token
    getUserInfo() {
        try {
            const token = storage.getToken();
            if (!token) return null;

            const payload = this.parseJwt(token);
            return {
                email: payload.email,
                userId: payload.user_id,
                exp: payload.exp
            };
        } catch (error) {
            console.error('Get user info error:', error);
            return null;
        }
    },

    // Check if token is expired
    isTokenExpired() {
        try {
            const token = storage.getToken();
            if (!token) return true;

            const payload = this.parseJwt(token);
            return payload.exp <= Date.now() / 1000;
        } catch {
            return true;
        }
    },

    // Refresh token if needed
    async refreshTokenIfNeeded() {
        try {
            if (this.isTokenExpired()) {
                const response = await api.post('/refresh-token');
                if (response.token) {
                    storage.setToken(response.token);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh error:', error);
            return false;
        }
    }
};
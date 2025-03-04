export const validators = {
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isValidCode(code) {
        return /^\d{6}$/.test(code);
    }
};
import { BASE_URL } from '$lib/config';
export const hostService = {
    async createHost(hostData) {
        const response = await fetch(`${BASE_URL}/hosts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(hostData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create host');
        }

        return response.json();
    },

    async getAllHosts() {
        const response = await fetch(`${BASE_URL}/hosts/all`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch hosts');
        }

        return response.json();
    },

    async getHost(id) {
        const response = await fetch(`${BASE_URL}/hosts/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch host');
        }

        return response.json();
    },

    async updateHost(id, hostData) {
        const response = await fetch(`${BASE_URL}/hosts/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(hostData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update host');
        }

        return response.json();
    },

    async deleteHost(id) {
        const response = await fetch(`${BASE_URL}/hosts/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete host');
        }

        return response.json();
    }
};
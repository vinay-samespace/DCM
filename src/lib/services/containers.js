import { BASE_URL } from '$lib/config';
export const containerService = {
    async getContainers(hostId) {
        const response = await fetch(`${BASE_URL}/containers?hostId=${hostId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch containers');
        }

        return response.json();
    }
};
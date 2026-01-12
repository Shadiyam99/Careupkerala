import axios from './axios';

export const bookingsApi = {
    // Create a booking (User)
    create: async (data) => {
        const response = await axios.post('/bookings', data);
        return response.data;
    },

    // Get my bookings (User)
    getMyBookings: async () => {
        const response = await axios.get('/bookings/me');
        return response.data;
    },

    // Get all bookings (Admin)
    getAll: async () => {
        const response = await axios.get('/bookings');
        return response.data;
    },

    // Update booking status (Admin)
    updateStatus: async (id, status) => {
        const response = await axios.put(`/bookings/${id}/status`, { status });
        return response.data;
    },

    // Assign companion (Admin)
    assignCompanion: async (id, companionId) => {
        const response = await axios.put(`/bookings/${id}/assign-companion`, { companion_id: companionId });
        return response.data;
    }
};

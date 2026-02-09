import axios from 'axios';
import type { BookingData, CreateBookingRequest, BookingFilters } from '../../types/booking';

const getBaseURL = () => {
    if (import.meta.env.DEV) {
        return 'http://localhost:3000/api';
    }
    return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
};

export const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('❌ Error en la petición:', error);

        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
            console.error('⚠️ No se puede conectar al servidor backend');
        }

        return Promise.reject(error);
    }
);

export const bookingAPI = {
    /**
     * Crea un booking + inicia pago en Flow (todo en uno)
     */
    createBookingAndPayment: async (data: CreateBookingRequest) => {
        const response = await api.post('/payments/create-booking-and-payment', data);
        return response.data;
    },

    /**
     * Obtiene el estado de un booking por ID
     */
    getBookingById: async (id: string) => {
        const response = await api.get(`/payments/booking/${id}`);
        return response.data;
    },

    /**
     * Obtiene lista de bookings con filtros
     */
    getBookings: async (filters?: BookingFilters) => {
        const params = new URLSearchParams();

        if (filters?.estado) params.append('estado', filters.estado);
        if (filters?.email) params.append('email', filters.email);
        if (filters?.fecha_desde) params.append('fecha_desde', filters.fecha_desde);
        if (filters?.fecha_hasta) params.append('fecha_hasta', filters.fecha_hasta);
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const response = await api.get(`/payments/bookings?${params.toString()}`);
        return response.data;
    },

    /**
     * Verifica el estado de un pago con Flow
     */
    checkPaymentStatus: async (token: string) => {
        const response = await api.get(`/payments/status/${token}`);
        return response.data;
    },

    /**
     * Test de conexión con el backend
     */
    testConnection: async () => {
        try {
            const response = await api.get('/payments/test-simple');
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error };
        }
    },
};
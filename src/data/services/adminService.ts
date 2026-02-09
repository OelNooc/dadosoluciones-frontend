import axios from 'axios';

const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
        const baseUrl = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
        return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
    }
    return 'http://localhost:3000/api';
};

const API_URL = getApiUrl();

export interface AdminUser {
    id: number;
    username: string;
    email: string;
    nombre: string;
    apellidos: string;
}

export interface Booking {
    id: string;
    nombre: string;
    email: string;
    celular: string;
    fecha_agendamiento: string;
    fecha_agendada: string;
    estado: 'pendiente' | 'confirmado' | 'cancelado';
    monto: number;
    transaction_id?: string;
    created_at: string;
    realizado?: 'pendiente' | 'realizado' | 'cancelado';
    tipo_cita?: 'asesoría' | 'evaluación';
}

export const adminService = {
    login: async (email: string, password: string): Promise<AdminUser> => {
        const response = await axios.post(`${API_URL}/admin/login`, { email, password });
        return response.data.data;
    },

    getBookings: async (filters?: any): Promise<Booking[]> => {
        const response = await axios.get(`${API_URL}/admin/bookings`, { params: filters });
        return response.data.data;
    },

    updateBooking: async (id: string, data: { realizado?: string; tipo_cita?: string }): Promise<Booking> => {
        const response = await axios.put(`${API_URL}/admin/bookings/${id}`, data);
        return response.data.data;
    }
};
import axios from 'axios';
import type {
    SubscriptionPlan,
    CreateSubscriptionRequest,
    CreateSubscriptionResponse,
    SubscriptionWithDetails,
    CancelSubscriptionRequest,
} from '../../types/subscription';

const getBaseURL = () => {
    if (import.meta.env.DEV) {
        return 'http://localhost:3000/api';
    }
    return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
};

export const subscriptionAPI = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// Interceptor para agregar token de autenticación
subscriptionAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuesta
subscriptionAPI.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('❌ Error en subscriptionAPI:', error);

        if (error.response?.status === 401) {
            // Token inválido o expirado
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export const subscriptionService = {
    /**
     * Obtener planes disponibles (público)
     */
    getAvailablePlans: async (): Promise<SubscriptionPlan[]> => {
        const response = await subscriptionAPI.get('/subscriptions/plans');
        return response.data.data;
    },

    /**
     * Crear nueva subscripción y obtener URL de pago
     */
    createSubscription: async (
        data: CreateSubscriptionRequest
    ): Promise<CreateSubscriptionResponse> => {
        const response = await subscriptionAPI.post('/subscriptions/create', data);
        return response.data.data;
    },

    /**
     * Obtener subscripción de un profesional
     */
    getSubscriptionByProfessional: async (
        professionalId: string
    ): Promise<SubscriptionWithDetails | null> => {
        try {
            const response = await subscriptionAPI.get(
                `/subscriptions/professional/${professionalId}`
            );
            return response.data.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    /**
     * Cancelar subscripción
     */
    cancelSubscription: async (
        subscriptionId: string,
        data: CancelSubscriptionRequest
    ): Promise<any> => {
        const response = await subscriptionAPI.post(
            `/subscriptions/${subscriptionId}/cancel`,
            data
        );
        return response.data.data;
    },

    /**
     * Renovar subscripción
     */
    renewSubscription: async (
        subscriptionId: string,
        professionalEmail: string
    ): Promise<any> => {
        const response = await subscriptionAPI.post(
            `/subscriptions/${subscriptionId}/renew`,
            { professionalEmail }
        );
        return response.data.data;
    },

    /**
     * Redirigir a Flow para pago
     */
    redirectToFlow: (paymentUrl: string) => {
        console.log('🔗 Redirigiendo a Flow:', paymentUrl);
        window.location.href = paymentUrl;
    },
};
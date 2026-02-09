import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { bookingAPI } from '@data/services/bookingAPI';

const PaymentStatus: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [bookingInfo, setBookingInfo] = useState<any>(null);

    useEffect(() => {
        checkPaymentStatus();
    }, []);

    const checkPaymentStatus = async () => {
        try {
            const token = searchParams.get('token');
            const bookingId = localStorage.getItem('currentBookingId');

            if (!token && !bookingId) {
                setStatus('error');
                return;
            }

            // Verificar estado del pago
            if (token) {
                const paymentResponse = await bookingAPI.checkPaymentStatus(token);
                if (paymentResponse.success) {
                    setStatus('success');
                }
            }

            // Obtener info del booking
            if (bookingId) {
                const bookingResponse = await bookingAPI.getBookingById(bookingId);
                setBookingInfo(bookingResponse.data);

                if (bookingResponse.data?.estado === 'confirmado') {
                    setStatus('success');
                }
            }
        } catch (error) {
            console.error('Error verificando pago:', error);
            setStatus('error');
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Verificando tu pago...</p>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                    {/* Success Icon */}
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        ¡Pago Confirmado! 🎉
                    </h1>
                    <p className="text-lg text-gray-700 mb-6">
                        Tu reserva ha sido confirmada exitosamente
                    </p>

                    {bookingInfo && (
                        <div className="bg-blue-50 rounded-xl p-6 mb-6 text-left">
                            <h3 className="font-semibold text-blue-900 mb-3">Detalles de tu Reserva</h3>
                            <div className="space-y-2 text-sm text-blue-800">
                                <p><strong>Nombre:</strong> {bookingInfo.nombre}</p>
                                <p><strong>Email:</strong> {bookingInfo.email}</p>
                                <p><strong>Fecha:</strong> {new Date(bookingInfo.fecha_agendada).toLocaleDateString()}</p>
                                <p><strong>Hora:</strong> {new Date(bookingInfo.fecha_agendada).toLocaleTimeString()}</p>
                                <p><strong>Monto:</strong> ${bookingInfo.monto?.toLocaleString()}</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-green-800">
                            📧 Hemos enviado un correo de confirmación a tu email
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            localStorage.removeItem('currentBookingId');
                            navigate('/');
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    // Error state
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                <div className="mb-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Hubo un problema
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                    No pudimos verificar tu pago. Por favor contacta con soporte.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-gray-600 text-white py-3 rounded-xl font-bold hover:bg-gray-700 transition-all"
                    >
                        Volver al Inicio
                    </button>
                    <a
                        href={`https://wa.me/${import.meta.env.VITE_CONTACT_PHONE?.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all"
                    >
                        Contactar Soporte por WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PaymentStatus;
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SubscriptionSuccess: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);

    useEffect(() => {
        // Obtener token de Flow de la URL
        const token = searchParams.get('token');

        // Obtener info de subscripción guardada
        const pendingSubscription = localStorage.getItem('pendingSubscription');

        if (pendingSubscription) {
            const info = JSON.parse(pendingSubscription);
            setSubscriptionInfo(info);

            // Limpiar localStorage
            localStorage.removeItem('pendingSubscription');
        }

        setLoading(false);

        // Auto-redirect después de 5 segundos
        const timer = setTimeout(() => {
            navigate('/dashboard/professional');
        }, 5000);

        return () => clearTimeout(timer);
    }, [searchParams, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Verificando pago...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Success Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                    {/* Success Icon */}
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg
                                className="w-10 h-10 text-green-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        ¡Pago Exitoso! 🎉
                    </h1>

                    {/* Message */}
                    <p className="text-lg text-gray-700 mb-6">
                        Tu subscripción ha sido activada correctamente
                    </p>

                    {/* Info Box */}
                    <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
                        <h3 className="font-semibold text-blue-900 mb-3">
                            ¿Qué sigue ahora?
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">✓</span>
                                <span>Tu cuenta de profesional está activa</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">✓</span>
                                <span>Ya puedes configurar tus servicios</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">✓</span>
                                <span>Aparecerás en el marketplace</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">✓</span>
                                <span>Configura tu email de PayPal para recibir pagos</span>
                            </li>
                        </ul>
                    </div>

                    {/* Subscription Info */}
                    {subscriptionInfo && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left text-sm">
                            <p className="text-gray-600">
                                <strong>Plan:</strong>{' '}
                                <span className="capitalize">{subscriptionInfo.planType}</span>
                            </p>
                            <p className="text-gray-600 mt-1">
                                <strong>ID de Subscripción:</strong>{' '}
                                <code className="bg-gray-200 px-2 py-1 rounded text-xs">
                                    {subscriptionInfo.subscriptionId}
                                </code>
                            </p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/dashboard/professional')}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                        >
                            Ir a mi Panel de Control
                        </button>

                        <p className="text-sm text-gray-500">
                            Serás redirigido automáticamente en 5 segundos...
                        </p>
                    </div>
                </div>

                {/* Help Box */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        ¿Necesitas ayuda?{' '}
                        <a href="/support" className="text-blue-600 hover:underline">
                            Contacta con soporte
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionSuccess;
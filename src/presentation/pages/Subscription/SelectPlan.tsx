import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PlanCard from '../../components/Subscription/PlanCard';
import { subscriptionService } from '../../../data/services/subscriptionAPI';
import type { SubscriptionPlan, SubscriptionPlanType } from '../../../types/subscription';

interface LocationState {
    professionalId: string;
    professionalEmail: string;
    firstName: string;
}

const SelectPlan: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;

    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanType | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Validar que venimos de registro
        if (!state?.professionalId || !state?.professionalEmail) {
            navigate('/register/professional');
            return;
        }

        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            setLoading(true);
            const data = await subscriptionService.getAvailablePlans();
            setPlans(data);
        } catch (err: any) {
            console.error('Error cargando planes:', err);
            setError('Error al cargar los planes. Por favor recarga la página.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = (planType: SubscriptionPlanType) => {
        setSelectedPlan(planType);
        setError(null);
    };

    const handleContinue = async () => {
        if (!selectedPlan) {
            setError('Por favor selecciona un plan');
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            const response = await subscriptionService.createSubscription({
                professionalId: state.professionalId,
                planType: selectedPlan,
                professionalEmail: state.professionalEmail,
            });

            // Guardar info en localStorage por si vuelve de Flow
            localStorage.setItem('pendingSubscription', JSON.stringify({
                subscriptionId: response.subscriptionId,
                professionalId: state.professionalId,
                planType: selectedPlan,
            }));

            // Redirigir a Flow
            subscriptionService.redirectToFlow(response.paymentUrl);
        } catch (err: any) {
            console.error('Error creando subscripción:', err);
            setError(
                err.response?.data?.error ||
                'Error al procesar la subscripción. Por favor intenta nuevamente.'
            );
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Cargando planes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        ¡Bienvenido, {state?.firstName}! 👋
                    </h1>
                    <p className="text-xl text-gray-700 mb-2">
                        Selecciona tu plan de subscripción
                    </p>
                    <p className="text-gray-600">
                        Completa tu registro eligiendo el plan que mejor se adapte a tus necesidades
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan.type}
                            plan={plan}
                            selected={selectedPlan === plan.type}
                            onSelect={() => handleSelectPlan(plan.type)}
                            disabled={processing}
                        />
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="max-w-2xl mx-auto mb-6">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                            {error}
                        </div>
                    </div>
                )}

                {/* Continue Button */}
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={handleContinue}
                        disabled={!selectedPlan || processing}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {processing ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Procesando...
                            </span>
                        ) : (
                            'Continuar al Pago'
                        )}
                    </button>
                </div>

                {/* Info Box */}
                <div className="max-w-2xl mx-auto mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Información Importante</h3>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                        <li>Tu subscripción se activará automáticamente al confirmar el pago</li>
                        <li>Podrás aparecer en el marketplace inmediatamente</li>
                        <li>La renovación es automática cada mes</li>
                        <li>Puedes cancelar en cualquier momento desde tu panel</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SelectPlan;
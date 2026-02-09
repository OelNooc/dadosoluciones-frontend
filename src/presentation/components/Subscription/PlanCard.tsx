import React from 'react';
import type { SubscriptionPlan } from '../../../types/subscription';

interface PlanCardProps {
    plan: SubscriptionPlan;
    selected?: boolean;
    onSelect: () => void;
    disabled?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, selected, onSelect, disabled }) => {
    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const isPopular = plan.type === 'premium';

    return (
        <div
            className={`
                relative bg-white rounded-2xl shadow-lg border-2 transition-all cursor-pointer
                ${selected
                    ? 'border-blue-600 scale-105 shadow-xl'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-xl'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${isPopular ? 'ring-2 ring-blue-400' : ''}
            `}
            onClick={() => !disabled && onSelect()}
        >
            {/* Badge de Popular */}
            {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                        🔥 MÁS POPULAR
                    </span>
                </div>
            )}

            {/* Badge de Descuento */}
            {plan.hasDiscount && (
                <div className="absolute -top-3 -right-3">
                    <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        -{plan.discountPercentage}%
                    </div>
                </div>
            )}

            <div className="p-6 space-y-4">
                {/* Header */}
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                </div>

                {/* Precio */}
                <div className="text-center py-4">
                    {plan.hasDiscount && plan.originalAmount && (
                        <div className="text-lg text-gray-400 line-through">
                            {formatPrice(plan.originalAmount)}
                        </div>
                    )}
                    <div className="text-4xl font-bold text-gray-900">
                        {formatPrice(plan.amount)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                        por mes
                    </div>
                </div>

                {/* Features */}
                <div className="space-y-3 py-4">
                    {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                            <svg
                                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* Botón */}
                <button
                    type="button"
                    disabled={disabled}
                    className={`
                        w-full py-3 rounded-xl font-bold transition-all
                        ${selected
                            ? 'bg-blue-600 text-white shadow-lg'
                            : isPopular
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }
                        ${disabled ? 'cursor-not-allowed' : ''}
                    `}
                >
                    {selected ? '✓ Seleccionado' : 'Seleccionar Plan'}
                </button>
            </div>
        </div>
    );
};

export default PlanCard;
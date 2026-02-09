export type SubscriptionPlanType = 'basic' | 'premium';

export type SubscriptionStatus =
    | 'pending'
    | 'active'
    | 'cancelled'
    | 'expired'
    | 'failed';

export interface SubscriptionPlan {
    type: SubscriptionPlanType;
    name: string;
    description: string;
    amount: number;
    originalAmount?: number;
    currency: string;
    durationDays: number;
    features: string[];
    hasDiscount: boolean;
    discountPercentage?: number;
}

export interface Subscription {
    id: string;
    professionalId: string;
    planType: SubscriptionPlanType;
    amount: number;
    currency: string;
    status: SubscriptionStatus;
    startsAt?: string;
    expiresAt?: string;
    nextBillingDate?: string;
    cancelledAt?: string;
    flowPaymentId?: string;
    flowToken?: string;
    autoRenew: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SubscriptionWithDetails extends Subscription {
    planDetails: {
        name: string;
        description: string;
        features: string[];
        originalAmount?: number;
    };
    daysUntilExpiration?: number;
    isExpiringSoon: boolean;
}

export interface CreateSubscriptionRequest {
    professionalId: string;
    planType: SubscriptionPlanType;
    professionalEmail: string;
}

export interface CreateSubscriptionResponse {
    subscriptionId: string;
    paymentUrl: string;
    flowToken: string;
    amount: number;
    currency: string;
    planType: SubscriptionPlanType;
    expiresAt: string;
}

export interface CancelSubscriptionRequest {
    subscriptionId: string;
    professionalId: string;
    reason?: string;
}

export interface Professional {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
    businessName?: string;
    specialty?: string;
    bio?: string;
    subscriptionStatus: 'active' | 'inactive' | 'cancelled';
    subscriptionExpiresAt?: string;
    paypalEmail?: string;
    paymentProvider?: string;
    createdAt: string;
    updatedAt: string;
}

export interface RegisterProfessionalRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    businessName?: string;
    specialty?: string;
    bio?: string;
}
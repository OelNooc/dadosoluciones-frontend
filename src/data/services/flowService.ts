export const flowService = {
    /**
     * Redirige al usuario a Flow para completar el pago
     */
    redirectToFlow: (flowUrl: string, token?: string) => {
        const url = token ? `${flowUrl}?token=${token}` : flowUrl;
        console.log('🔗 Redirigiendo a Flow:', url);
        window.location.href = url;
    },

    /**
     * Datos de tarjetas de prueba para Flow Sandbox
     */
    testCards: {
        approved: {
            number: "4051 8860 0446 6623",
            cvv: "123",
            label: "Aprobada"
        },
        declined: {
            number: "4051 8860 0005 6623",
            cvv: "123",
            label: "Rechazada (sin fondos)"
        },
        instructions: [
            "✅ Usa cualquier fecha futura",
            "✅ CVV: 123",
            "✅ En el simulador: RUT 11111111-1, Clave 123"
        ]
    },

    /**
     * Valida formato de tarjeta
     */
    validateCard: (cardNumber: string): { isValid: boolean; type: string } => {
        const cleaned = cardNumber.replace(/\s/g, '');

        if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cleaned)) {
            return { isValid: true, type: 'Visa' };
        } else if (/^5[1-5][0-9]{14}$/.test(cleaned)) {
            return { isValid: true, type: 'Mastercard' };
        } else if (/^3[47][0-9]{13}$/.test(cleaned)) {
            return { isValid: true, type: 'American Express' };
        }

        return { isValid: false, type: 'Desconocida' };
    },

    /**
     * Formatea número de tarjeta con espacios
     */
    formatCardNumber: (value: string): string => {
        const cleaned = value.replace(/\s/g, '');
        const chunks = cleaned.match(/.{1,4}/g);
        return chunks ? chunks.join(' ') : cleaned;
    },
};
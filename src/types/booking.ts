export interface TimeSlot {
    start: string;
    end: string;
    available: boolean;
}

export interface BookingData {
    id?: string;
    nombre: string;
    email: string;
    celular: string;
    fecha_agendamiento: string;
    fecha_agendada: string;
    estado: 'pendiente' | 'confirmado' | 'cancelado';
    monto?: number;
    transaction_id?: string;
    created_at?: string;
}

export interface CreateBookingRequest {
    nombre: string;
    email: string;
    celular: string;
    fecha_agendamiento: string;
    fecha_agendada: string;
    monto: number;
}

export interface BookingFilters {
    estado?: 'pendiente' | 'confirmado' | 'cancelado';
    email?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
    limit?: number;
}
import React, { useState, useEffect } from 'react';
import { bookingAPI } from '@data/services/bookingAPI';
import { flowService } from '@data/services/flowService';
import CalendarGrid from '@presentation/components/Calendar/CalendarGrid';
import TimeSlot from '@presentation/components/Calendar/TimeSlot';
import type { BookingData } from '../../../types/booking';

const BookingPage: React.FC = () => {
    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        celular: '',
    });

    // Estado de selección
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Estado de datos y UI
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [existingBookings, setExistingBookings] = useState<BookingData[]>([]);

    // Cargar bookings al montar
    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const data = await bookingAPI.getBookings({
                fecha_desde: today,
                estado: 'confirmado'
            });
            const pendingData = await bookingAPI.getBookings({
                fecha_desde: today,
                estado: 'pendiente'
            });

            setExistingBookings([...(data.data || []), ...(pendingData.data || [])]);
        } catch (err) {
            console.error('Error cargando disponibilidad:', err);
        }
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
    };

    // Generar slots de tiempo
    const generateTimeSlots = () => {
        if (!selectedDate) return [];

        const slots = [];
        const startHour = 9;
        const endHour = 17;

        for (let hour = startHour; hour < endHour; hour++) {
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            const endTimeString = `${hour.toString().padStart(2, '0')}:45`;

            const isTaken = existingBookings.some(booking => {
                if (!booking.fecha_agendada) return false;
                const bookingDate = new Date(booking.fecha_agendada);

                return (
                    bookingDate.getDate() === selectedDate.getDate() &&
                    bookingDate.getMonth() === selectedDate.getMonth() &&
                    bookingDate.getFullYear() === selectedDate.getFullYear() &&
                    bookingDate.getHours() === hour
                );
            });

            slots.push({
                start: timeString,
                end: endTimeString,
                available: !isTaken
            });
        }
        return slots;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.nombre || !formData.email || !formData.celular || !selectedDate || !selectedTime) {
            setError('Por favor completa todos los campos y selecciona una fecha y hora');
            setLoading(false);
            return;
        }

        // Validaciones
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Por favor ingresa un email válido.');
            setLoading(false);
            return;
        }

        const blockedWords = ['test', 'maildeprueba', 'correo@test.cl'];
        const emailLower = formData.email.toLowerCase();
        const hasBlockedWord = blockedWords.some(word => emailLower.includes(word));

        if (hasBlockedWord) {
            setError('El email ingresado no es válido para el sistema de pagos. Por favor usa un email real.');
            setLoading(false);
            return;
        }

        if (formData.celular.length < 8) {
            setError('Por favor ingresa un número de celular válido.');
            setLoading(false);
            return;
        }

        try {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const finalDateTime = `${dateStr}T${selectedTime}`;

            const response = await bookingAPI.createBookingAndPayment({
                nombre: formData.nombre,
                email: formData.email,
                celular: formData.celular,
                fecha_agendamiento: dateStr,
                fecha_agendada: finalDateTime,
                monto: 10000,
            });

            if (response.success) {
                localStorage.setItem('currentBookingId', response.data.booking.id);
                flowService.redirectToFlow(
                    response.data.payment.flowUrl,
                    response.data.payment.token
                );
            } else {
                setError('Error al crear el agendamiento. Intenta nuevamente.');
            }
        } catch (err: any) {
            console.error('❌ Error:', err);
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('Error inesperado al procesar la reserva.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const timeSlots = generateTimeSlots();

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-800">Reserva tu Hora</h2>
                <p className="text-gray-600 mt-2">Selecciona el día y la hora que más te acomode</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Columna Izquierda: Calendario y Horas */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">1</span>
                            Selecciona el Día
                        </h3>
                        <CalendarGrid
                            onSelectDate={handleDateSelect}
                            selectedDate={selectedDate}
                        />
                    </div>

                    {selectedDate && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 animate-fade-in">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">2</span>
                                Selecciona la Hora
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {timeSlots.map((slot, index) => (
                                    <TimeSlot
                                        key={index}
                                        start={slot.start}
                                        end={slot.end}
                                        available={slot.available}
                                        selected={selectedTime === slot.start}
                                        onClick={() => handleTimeSelect(slot.start)}
                                    />
                                ))}
                            </div>
                            {timeSlots.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No hay horas disponibles para este día.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Columna Derecha: Formulario */}
                <div className="space-y-6">
                    <div className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all ${!selectedTime ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">3</span>
                            Tus Datos
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Ej: juan@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
                                <input
                                    type="tel"
                                    name="celular"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={formData.celular}
                                    onChange={handleChange}
                                    placeholder="Ej: +56 9 1234 5678"
                                />
                            </div>

                            {selectedDate && selectedTime && (
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
                                    <h4 className="font-semibold text-blue-900 mb-2">Resumen de la Reserva</h4>
                                    <div className="text-sm text-blue-800 space-y-1">
                                        <p>📅 <strong>Fecha:</strong> {selectedDate.toLocaleDateString()}</p>
                                        <p>⏰ <strong>Hora:</strong> {selectedTime}</p>
                                        <p>💰 <strong>Valor:</strong> $10.000</p>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? 'Procesando...' : 'Confirmar y Pagar'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
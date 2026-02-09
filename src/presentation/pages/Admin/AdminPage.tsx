import React, { useState, useEffect } from 'react';
import { adminService, type Booking } from '@data/services/adminService';

export const AdminPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pendiente' | 'confirmado' | 'cancelado'>('all');

    useEffect(() => {
        loadBookings();
    }, [filter]);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const filters = filter !== 'all' ? { estado: filter } : {};
            const data = await adminService.getBookings(filters);
            setBookings(data);
        } catch (error) {
            console.error('Error cargando bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBooking = async (id: string, data: any) => {
        try {
            await adminService.updateBooking(id, data);
            loadBookings();
        } catch (error) {
            console.error('Error actualizando booking:', error);
        }
    };

    const filteredBookings = bookings.filter(booking =>
        filter === 'all' ? true : booking.estado === filter
    );

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
                <p className="text-gray-600">Gestiona todas las reservas del sistema</p>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Todas ({bookings.length})
                    </button>
                    <button
                        onClick={() => setFilter('pendiente')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'pendiente'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Pendientes
                    </button>
                    <button
                        onClick={() => setFilter('confirmado')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'confirmado'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Confirmadas
                    </button>
                    <button
                        onClick={() => setFilter('cancelado')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'cancelado'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Canceladas
                    </button>
                </div>
            </div>

            {/* Tabla de Bookings */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Cargando reservas...</p>
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <p className="text-gray-500 text-lg">No hay reservas para mostrar</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha/Hora
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Monto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {booking.nombre}
                                            </div>
                                            <div className="text-sm text-gray-500">{booking.email}</div>
                                            <div className="text-sm text-gray-500">{booking.celular}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(booking.fecha_agendada).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(booking.fecha_agendada).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.estado === 'confirmado'
                                                        ? 'bg-green-100 text-green-800'
                                                        : booking.estado === 'pendiente'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {booking.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${booking.monto.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <select
                                                onChange={(e) =>
                                                    handleUpdateBooking(booking.id, {
                                                        realizado: e.target.value,
                                                    })
                                                }
                                                defaultValue={booking.realizado || 'pendiente'}
                                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                                            >
                                                <option value="pendiente">Pendiente</option>
                                                <option value="realizado">Realizado</option>
                                                <option value="cancelado">Cancelado</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
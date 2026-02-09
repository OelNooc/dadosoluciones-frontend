import React, { useState } from 'react';

interface CalendarGridProps {
    onSelectDate: (date: Date) => void;
    selectedDate?: Date;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ onSelectDate, selectedDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Domingo
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const isWeekend = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // 0=Dom, 6=Sab
    };

    const isSelected = (day: number) => {
        if (!selectedDate) return false;
        return (
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear()
        );
    };

    const isPast = (day: number) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return date < today;
    };

    const renderDays = () => {
        const daysArray = [];

        // Espacios vacíos antes del primer día
        for (let i = 0; i < firstDay; i++) {
            daysArray.push(<div key={`empty-${i}`} className="h-10"></div>);
        }

        // Días del mes
        for (let day = 1; day <= days; day++) {
            const weekend = isWeekend(day);
            const past = isPast(day);
            const selected = isSelected(day);
            const disabled = weekend || past;

            daysArray.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => !disabled && onSelectDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    disabled={disabled}
                    className={`
                        h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all
                        ${selected ? 'bg-blue-600 text-white font-bold shadow-md' : ''}
                        ${!selected && !disabled ? 'hover:bg-blue-50 text-gray-700 font-medium' : ''}
                        ${disabled ? 'text-gray-300 cursor-not-allowed' : ''}
                        ${weekend && !disabled ? 'text-red-300' : ''} 
                    `}
                >
                    {day}
                </button>
            );
        }
        return daysArray;
    };

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            {/* Header con navegación */}
            <div className="flex justify-between items-center mb-4">
                <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                >
                    ←
                </button>
                <h3 className="font-semibold text-gray-800">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                >
                    →
                </button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid de días */}
            <div className="grid grid-cols-7 gap-1 justify-items-center">
                {renderDays()}
            </div>

            {/* Leyenda */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span>Seleccionado</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full border border-gray-300"></div>
                    <span>Disponible</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center">×</div>
                    <span>No disponible</span>
                </div>
            </div>
        </div>
    );
};

export default CalendarGrid;
import React from 'react';

interface TimeSlotProps {
    start: string;
    end: string;
    available: boolean;
    selected?: boolean;
    onClick: () => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ start, end, available, selected, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!available}
            className={`
                px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${selected
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : available
                        ? 'bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-sm'
                        : 'bg-gray-100 opacity-50 cursor-not-allowed'
                }
            `}
        >
            <div className="flex flex-col items-center">
                <span className="font-semibold">{start}</span>
                <span className="text-xs opacity-75">a</span>
                <span className="font-semibold">{end}</span>
            </div>
        </button>
    );
};

export default TimeSlot;
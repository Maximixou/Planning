import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import frLocale from '@fullcalendar/core/locales/fr';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useStore } from '../store/useStore';
import { Modal } from './Modal';
import { AddShiftForm } from './AddShiftForm';
import { AssignShiftModal } from './AssignShiftModal';
import { Shift } from '../types';

interface CalendarProps {
  selectedRole: string | 'all';
}

export const Calendar: React.FC<CalendarProps> = ({ selectedRole }) => {
  const { shifts, addShift } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  const filteredShifts = selectedRole === 'all' 
    ? shifts 
    : shifts.filter(shift => shift.role === selectedRole);

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDates({
      start: selectInfo.start,
      end: selectInfo.end,
    });
    setIsAddModalOpen(true);
    selectInfo.view.calendar.unselect();
  };

  const handleEventClick = (clickInfo: any) => {
    const shift = shifts.find(s => s.id === clickInfo.event.id);
    if (shift) {
      setSelectedShift(shift);
      setIsAssignModalOpen(true);
    }
  };

  const handleAddShift = (data: { 
    title: string; 
    start: Date; 
    end: Date; 
    role: string; 
    requiredStaff: number;
    employeeIds: string[];
  }) => {
    const shift = {
      id: Math.random().toString(36).substring(2),
      ...data,
      status: data.employeeIds.length >= data.requiredStaff 
        ? 'fully_assigned' 
        : data.employeeIds.length > 0 
        ? 'partially_assigned'
        : 'unassigned' as const,
    };
    addShift(shift);
    setIsAddModalOpen(false);
  };

  return (
    <>
      <div className="h-[800px] p-4 bg-white rounded-lg shadow-md">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          locale={frLocale}
          buttonText={{
            today: "Aujourd'hui",
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
          }}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={false}
          weekends={true}
          slotMinWidth={100}
          events={filteredShifts.map(shift => ({
            ...shift,
            title: `${shift.role} (${shift.employeeIds?.length || 0}/${shift.requiredStaff})`,
            className: shift.status === 'fully_assigned' 
              ? 'bg-blue-500 border-blue-600' 
              : shift.status === 'partially_assigned'
              ? 'bg-yellow-500 border-yellow-600'
              : 'bg-red-500 border-red-600'
          }))}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="100%"
          slotEventOverlap={false}
          allDaySlot={false}
          expandRows={true}
        />
      </div>

      {selectedDates && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Ajouter un Quart de Travail"
        >
          <AddShiftForm
            startDate={selectedDates.start}
            endDate={selectedDates.end}
            onSubmit={handleAddShift}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </Modal>
      )}

      {selectedShift && (
        <AssignShiftModal
          shift={selectedShift}
          isOpen={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedShift(null);
          }}
        />
      )}
    </>
  );
};
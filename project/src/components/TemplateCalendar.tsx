import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import frLocale from '@fullcalendar/core/locales/fr';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal } from './Modal';
import { AddTemplateShiftForm } from './AddTemplateShiftForm';
import { Template, TemplateShift } from '../types';

interface TemplateCalendarProps {
  template: Template;
  onTemplateChange: (template: Template) => void;
}

export const TemplateCalendar: React.FC<TemplateCalendarProps> = ({
  template,
  onTemplateChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date } | null>(null);

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDates({
      start: selectInfo.start,
      end: selectInfo.end,
    });
    setIsModalOpen(true);
    selectInfo.view.calendar.unselect();
  };

  const handleAddShift = (shiftData: Omit<TemplateShift, 'id'>) => {
    const newShift: TemplateShift = {
      ...shiftData,
      id: Math.random().toString(36).substring(2),
    };
    
    onTemplateChange({
      ...template,
      shifts: [...template.shifts, newShift],
    });
    
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="h-[800px] p-4 bg-white rounded-lg shadow-md">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek',
          }}
          locale={frLocale}
          buttonText={{
            today: "Aujourd'hui",
            week: 'Semaine',
          }}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={template.shifts.map(shift => ({
            id: shift.id,
            title: `${shift.title} (${shift.requiredStaff} ${shift.role})`,
            daysOfWeek: [shift.dayOfWeek],
            startTime: shift.startTime,
            endTime: shift.endTime,
            backgroundColor: '#3B82F6',
            borderColor: '#2563EB',
          }))}
          select={handleDateSelect}
          height="100%"
        />
      </div>

      {selectedDates && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Ajouter un Poste au Template"
        >
          <AddTemplateShiftForm
            startDate={selectedDates.start}
            endDate={selectedDates.end}
            onSubmit={handleAddShift}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </>
  );
};
import React, { useState } from 'react';
import { Calendar } from './Calendar';
import { Dashboard } from './Dashboard';
import { TemplateForm } from './TemplateForm';
import { Plus } from 'lucide-react';
import { Modal } from './Modal';
import { useStore } from '../store/useStore';

export const ScheduleTemplates = () => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const { shifts } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Horaires</h2>
        <button
          onClick={() => setIsTemplateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Créer un Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Calendar 
            shifts={shifts}
            eventClassNames={(info: any) => ({
              'bg-red-500 border-red-600': info.event.extendedProps.status === 'unassigned',
              'bg-blue-500 border-blue-600': info.event.extendedProps.status === 'assigned'
            })}
          />
        </div>
        <div>
          <Dashboard />
        </div>
      </div>

      <Modal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        title="Créer un Template d'Horaire"
      >
        <TemplateForm onClose={() => setIsTemplateModalOpen(false)} />
      </Modal>
    </div>
  );
};
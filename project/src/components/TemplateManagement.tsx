import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Modal } from './Modal';
import { TemplateCalendar } from './TemplateCalendar';
import { TemplateForm } from './TemplateForm';
import { ApplyTemplateModal } from './ApplyTemplateModal';
import { useStore } from '../store/useStore';
import { Template } from '../types';

export const TemplateManagement = () => {
  const { templates, addTemplate } = useStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [applyingTemplate, setApplyingTemplate] = useState<Template | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<Template>({
    id: '',
    name: '',
    description: '',
    shifts: [],
  });

  const handleSaveTemplate = (templateData: { name: string; description: string }) => {
    const newTemplate = {
      ...currentTemplate,
      id: Math.random().toString(36).substring(2),
      name: templateData.name,
      description: templateData.description,
    };
    addTemplate(newTemplate);
    setIsCreateModalOpen(false);
    setCurrentTemplate({
      id: '',
      name: '',
      description: '',
      shifts: [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Templates d'Horaires</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Enregistrer le Template
        </button>
      </div>

      <TemplateCalendar
        template={currentTemplate}
        onTemplateChange={setCurrentTemplate}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Enregistrer le Template"
      >
        <TemplateForm onSubmit={handleSaveTemplate} onCancel={() => setIsCreateModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={!!applyingTemplate}
        onClose={() => setApplyingTemplate(null)}
        title={`Appliquer le template "${applyingTemplate?.name}"`}
      >
        {applyingTemplate && (
          <ApplyTemplateModal
            template={applyingTemplate}
            onClose={() => setApplyingTemplate(null)}
          />
        )}
      </Modal>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Templates Enregistrés</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
              {template.description && (
                <p className="text-gray-600 mb-4">{template.description}</p>
              )}
              
              <div className="space-y-3">
                {template.shifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="bg-gray-50 p-3 rounded-md"
                  >
                    <div className="font-medium">{shift.title}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(2024, 0, shift.dayOfWeek).toLocaleDateString('fr-FR', { weekday: 'long' })}
                      {' '}{shift.startTime} - {shift.endTime}
                    </div>
                    <div className="text-sm text-gray-500">
                      {shift.requiredStaff} {shift.role}(s) requis
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setApplyingTemplate(template)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Appliquer à l'Horaire
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
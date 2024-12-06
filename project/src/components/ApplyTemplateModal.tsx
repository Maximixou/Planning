import React, { useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useStore } from '../store/useStore';
import { Template } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface ApplyTemplateModalProps {
  template: Template;
  onClose: () => void;
}

export const ApplyTemplateModal: React.FC<ApplyTemplateModalProps> = ({ template, onClose }) => {
  const { applyTemplate } = useStore();
  const [startDate, setStartDate] = useState(() => {
    const nextMonday = startOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 });
    return format(nextMonday, 'yyyy-MM-dd');
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyTemplate(template.id, new Date(startDate));
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Template appliqué avec succès
        </h3>
        <p className="text-sm text-gray-500">
          L'horaire a été créé pour la semaine sélectionnée
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Semaine de début
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Le template sera appliqué à partir du lundi de la semaine sélectionnée
        </p>
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
        >
          Appliquer
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};
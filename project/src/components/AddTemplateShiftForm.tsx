import React, { useState } from 'react';
import { format } from 'date-fns';
import { useStore } from '../store/useStore';

interface AddTemplateShiftFormProps {
  startDate: Date;
  endDate: Date;
  onSubmit: (data: {
    title: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    requiredStaff: number;
    role: string;
  }) => void;
  onCancel: () => void;
}

export const AddTemplateShiftForm: React.FC<AddTemplateShiftFormProps> = ({
  startDate,
  endDate,
  onSubmit,
  onCancel,
}) => {
  const { roles } = useStore();
  const [formData, setFormData] = useState({
    title: '',
    requiredStaff: '1',
    role: roles[0] || '',
    startTime: format(startDate, 'HH:mm'),
    endTime: format(endDate, 'HH:mm'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      requiredStaff: parseInt(formData.requiredStaff, 10),
      dayOfWeek: startDate.getDay(),
      startTime: formData.startTime,
      endTime: formData.endTime,
    });
  };

  const handleStaffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setFormData({ ...formData, requiredStaff: value });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Titre du poste
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Type de poste
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        >
          {roles.map((role) => (
            <option key={role} value={role} className="capitalize">
              {role}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="requiredStaff" className="block text-sm font-medium text-gray-700">
          Nombre d'employés requis
        </label>
        <input
          type="text"
          id="requiredStaff"
          pattern="\d+"
          min="1"
          value={formData.requiredStaff}
          onChange={handleStaffChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            Heure de début
          </label>
          <input
            type="time"
            id="startTime"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
            Heure de fin
          </label>
          <input
            type="time"
            id="endTime"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
        >
          Ajouter
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};
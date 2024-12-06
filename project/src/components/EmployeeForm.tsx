import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Employee, Availability } from '../types';

interface EmployeeFormProps {
  onClose: () => void;
  initialData?: Employee;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ onClose, initialData }) => {
  const { addEmployee, updateEmployee, roles } = useStore();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    role: initialData?.role || roles[0] || '',
    availability: initialData?.availability || [] as Availability[],
  });

  const [availabilityForm, setAvailabilityForm] = useState({
    dayOfWeek: '1',
    startTime: '09:00',
    endTime: '17:00',
  });

  const addAvailability = () => {
    const newAvailability = {
      dayOfWeek: parseInt(availabilityForm.dayOfWeek),
      startTime: availabilityForm.startTime,
      endTime: availabilityForm.endTime,
    };
    setFormData({
      ...formData,
      availability: [...formData.availability, newAvailability],
    });
  };

  const removeAvailability = (index: number) => {
    setFormData({
      ...formData,
      availability: formData.availability.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      updateEmployee(initialData.id, formData);
    } else {
      addEmployee({
        id: Math.random().toString(36).substring(2),
        ...formData,
      });
    }
    onClose();
  };

  const days = [
    { value: '1', label: 'Lundi' },
    { value: '2', label: 'Mardi' },
    { value: '3', label: 'Mercredi' },
    { value: '4', label: 'Jeudi' },
    { value: '5', label: 'Vendredi' },
    { value: '6', label: 'Samedi' },
    { value: '0', label: 'Dimanche' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Fonction
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Sélectionner une fonction</option>
            {roles.map((role) => (
              <option key={role} value={role} className="capitalize">
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Téléphone
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Disponibilités</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Jour</label>
            <select
              value={availabilityForm.dayOfWeek}
              onChange={(e) => setAvailabilityForm({ ...availabilityForm, dayOfWeek: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              {days.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Début</label>
            <input
              type="time"
              value={availabilityForm.startTime}
              onChange={(e) => setAvailabilityForm({ ...availabilityForm, startTime: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Fin</label>
            <input
              type="time"
              value={availabilityForm.endTime}
              onChange={(e) => setAvailabilityForm({ ...availabilityForm, endTime: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={addAvailability}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Ajouter une disponibilité
        </button>

        <div className="mt-4 space-y-2">
          {formData.availability.map((av, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <span>
                {days.find(d => d.value === av.dayOfWeek.toString())?.label} : {av.startTime} - {av.endTime}
              </span>
              <button
                type="button"
                onClick={() => removeAvailability(index)}
                className="text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
        >
          {initialData ? 'Modifier' : 'Ajouter'}
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
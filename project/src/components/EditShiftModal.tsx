import React, { useState } from 'react';
import { Modal } from './Modal';
import { ConfirmationModal } from './ConfirmationModal';
import { useStore } from '../store/useStore';
import { Shift } from '../types';
import { format } from 'date-fns';

interface EditShiftModalProps {
  shift: Shift;
  isOpen: boolean;
  onClose: () => void;
}

export const EditShiftModal: React.FC<EditShiftModalProps> = ({
  shift,
  isOpen,
  onClose,
}) => {
  const { employees, updateShift, assignShift } = useStore();
  const [formData, setFormData] = useState({
    employeeId: shift.employeeId || '',
    start: format(shift.start, "yyyy-MM-dd'T'HH:mm"),
    end: format(shift.end, "yyyy-MM-dd'T'HH:mm"),
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates: Partial<Shift> = {
      start: new Date(formData.start),
      end: new Date(formData.end),
    };

    if (formData.employeeId) {
      assignShift(shift.id, formData.employeeId);
    } else {
      updateShift(shift.id, { ...updates, status: 'unassigned', employeeId: undefined });
    }

    onClose();
  };

  const handleUnassign = () => {
    setShowConfirmation(true);
  };

  const confirmUnassign = () => {
    updateShift(shift.id, { status: 'unassigned', employeeId: undefined });
    setShowConfirmation(false);
    onClose();
  };

  const filteredEmployees = employees.filter(employee => employee.role === shift.role);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Modifier le Quart de Travail"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
              Employé Assigné
            </label>
            <select
              id="employeeId"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Non assigné</option>
              {filteredEmployees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start" className="block text-sm font-medium text-gray-700">
                Début
              </label>
              <input
                type="datetime-local"
                id="start"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="end" className="block text-sm font-medium text-gray-700">
                Fin
              </label>
              <input
                type="datetime-local"
                id="end"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
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
              Enregistrer
            </button>
            {shift.status === 'assigned' && (
              <button
                type="button"
                onClick={handleUnassign}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Désassigner
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmUnassign}
        title="Désassigner l'employé"
        message="Êtes-vous sûr de vouloir retirer l'employé de ce quart de travail ?"
      />
    </>
  );
};
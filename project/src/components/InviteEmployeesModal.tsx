import React, { useState } from 'react';
import { Modal } from './Modal';
import { useStore } from '../store/useStore';
import { Employee, Shift } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Mail, UserCheck } from 'lucide-react';

interface InviteEmployeesModalProps {
  shift: Shift;
  isOpen: boolean;
  onClose: () => void;
}

export const InviteEmployeesModal: React.FC<InviteEmployeesModalProps> = ({
  shift,
  isOpen,
  onClose,
}) => {
  const { employees, getAvailableEmployees, sendShiftInvitation } = useStore();
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [invitationSent, setInvitationSent] = useState(false);

  const availableEmployees = getAvailableEmployees(shift);
  const unavailableEmployees = employees.filter(
    emp => emp.role === shift.role && !availableEmployees.find(e => e.id === emp.id)
  );

  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSendInvitations = async () => {
    for (const employeeId of selectedEmployees) {
      await sendShiftInvitation(shift.id, employeeId);
    }
    setInvitationSent(true);
    setTimeout(() => {
      onClose();
      setInvitationSent(false);
      setSelectedEmployees([]);
    }, 2000);
  };

  if (invitationSent) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Invitations Envoyées">
        <div className="text-center py-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Invitations envoyées avec succès
          </h3>
          <p className="text-sm text-gray-500">
            Les employés sélectionnés recevront une notification
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Inviter des Employés">
      <div className="space-y-4">
        {/* Shift Info */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium">{shift.role}</h4>
          <p className="text-sm text-gray-600">
            {format(new Date(shift.start), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
            {' - '}
            {format(new Date(shift.end), 'HH:mm')}
          </p>
        </div>

        {/* Available Employees */}
        <div>
          <h5 className="font-medium text-green-700 mb-2">Employés Disponibles</h5>
          <div className="space-y-2">
            {availableEmployees.map((employee) => (
              <label
                key={employee.id}
                className={`flex items-center justify-between p-3 rounded-md border cursor-pointer ${
                  selectedEmployees.includes(employee.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-green-200 hover:bg-green-50'
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-sm text-gray-500">
                    {employee.email}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedEmployees.includes(employee.id)}
                  onChange={() => handleSelectEmployee(employee.id)}
                  className="ml-4"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Unavailable Employees */}
        <div>
          <h5 className="font-medium text-yellow-700 mb-2">Employés Non Disponibles</h5>
          <div className="space-y-2">
            {unavailableEmployees.map((employee) => (
              <label
                key={employee.id}
                className={`flex items-center justify-between p-3 rounded-md border cursor-pointer ${
                  selectedEmployees.includes(employee.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-yellow-200 hover:bg-yellow-50'
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-sm text-gray-500">
                    {employee.email}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedEmployees.includes(employee.id)}
                  onChange={() => handleSelectEmployee(employee.id)}
                  className="ml-4"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            onClick={handleSendInvitations}
            disabled={selectedEmployees.length === 0}
            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-gray-400 sm:ml-3 sm:w-auto"
          >
            Envoyer les invitations
          </button>
          <button
            onClick={onClose}
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            Annuler
          </button>
        </div>
      </div>
    </Modal>
  );
};
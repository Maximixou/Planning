import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { ConfirmationModal } from './ConfirmationModal';
import { useStore } from '../store/useStore';
import { Employee, Shift } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { UserCheck, Users, Trash2 } from 'lucide-react';

interface AssignShiftModalProps {
  shift: Shift;
  isOpen: boolean;
  onClose: () => void;
}

export const AssignShiftModal: React.FC<AssignShiftModalProps> = ({
  shift,
  isOpen,
  onClose,
}) => {
  const { employees, getAvailableEmployees, assignEmployee, unassignEmployee, deleteShift } = useStore();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [employeeToConfirm, setEmployeeToConfirm] = useState<Employee | null>(null);
  const [currentShift, setCurrentShift] = useState(shift);

  useEffect(() => {
    setCurrentShift(shift);
  }, [shift]);

  const assignedEmployees = employees.filter(emp => currentShift.employeeIds?.includes(emp.id));
  const availableEmployees = getAvailableEmployees(currentShift).filter(
    emp => !currentShift.employeeIds?.includes(emp.id)
  );
  const unavailableEmployees = employees.filter(
    emp => emp.role === currentShift.role && 
    !availableEmployees.find(e => e.id === emp.id) &&
    !currentShift.employeeIds?.includes(emp.id)
  );

  const handleSelectEmployee = async (employee: Employee) => {
    const isAvailable = availableEmployees.some(emp => emp.id === employee.id);
    if (isAvailable) {
      await assignEmployee(currentShift.id, employee.id);
      setCurrentShift(prev => ({
        ...prev,
        employeeIds: [...(prev.employeeIds || []), employee.id],
        status: prev.employeeIds.length + 1 >= prev.requiredStaff ? 'fully_assigned' : 'partially_assigned'
      }));
    } else {
      setEmployeeToConfirm(employee);
      setShowConfirmation(true);
    }
  };

  const handleConfirmAssignment = async () => {
    if (employeeToConfirm) {
      await assignEmployee(currentShift.id, employeeToConfirm.id);
      setCurrentShift(prev => ({
        ...prev,
        employeeIds: [...(prev.employeeIds || []), employeeToConfirm.id],
        status: prev.employeeIds.length + 1 >= prev.requiredStaff ? 'fully_assigned' : 'partially_assigned'
      }));
      setShowConfirmation(false);
      setEmployeeToConfirm(null);
    }
  };

  const handleRemoveEmployee = async (employeeId: string) => {
    await unassignEmployee(currentShift.id, employeeId);
    setCurrentShift(prev => ({
      ...prev,
      employeeIds: prev.employeeIds.filter(id => id !== employeeId),
      status: prev.employeeIds.length - 1 >= prev.requiredStaff ? 'fully_assigned' : 
             prev.employeeIds.length - 1 > 0 ? 'partially_assigned' : 'unassigned'
    }));
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    deleteShift(currentShift.id);
    setShowDeleteConfirmation(false);
    onClose();
  };

  const remainingStaff = currentShift.requiredStaff - (currentShift.employeeIds?.length || 0);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Assigner des Employés"
      >
        <div className="space-y-4">
          {/* Shift Info */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{currentShift.role}</h4>
                <p className="text-sm text-gray-600">
                  {format(new Date(currentShift.start), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
                  {' - '}
                  {format(new Date(currentShift.end), 'HH:mm')}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <Users className="w-4 h-4 inline-block mr-1" />
                  {remainingStaff > 0
                    ? `${remainingStaff} employé${remainingStaff > 1 ? 's' : ''} encore requis`
                    : 'Nombre requis atteint'}
                </p>
              </div>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800"
                title="Supprimer ce quart"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Assigned Employees */}
          {assignedEmployees.length > 0 && (
            <div>
              <h5 className="font-medium text-blue-700 mb-2">
                Employés Assignés ({assignedEmployees.length}/{currentShift.requiredStaff})
              </h5>
              <div className="space-y-2">
                {assignedEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 rounded-md border border-blue-200 bg-blue-50">
                    <div>
                      <div className="font-medium flex items-center">
                        <UserCheck className="w-4 h-4 mr-2 text-blue-600" />
                        {employee.name}
                      </div>
                      <div className="text-sm text-gray-500">{employee.role}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveEmployee(employee.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Retirer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Employees */}
          {availableEmployees.length > 0 && remainingStaff > 0 && (
            <>
              <h5 className="font-medium text-green-700">Employés Disponibles</h5>
              <div className="space-y-2">
                {availableEmployees.map((employee) => (
                  <button
                    key={employee.id}
                    onClick={() => handleSelectEmployee(employee)}
                    className="w-full text-left p-3 rounded-md border border-green-200 hover:bg-green-50"
                  >
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-gray-500">{employee.role}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Unavailable Employees */}
          {unavailableEmployees.length > 0 && remainingStaff > 0 && (
            <>
              <h5 className="font-medium text-yellow-700">Employés Non Disponibles</h5>
              <div className="space-y-2">
                {unavailableEmployees.map((employee) => (
                  <button
                    key={employee.id}
                    onClick={() => handleSelectEmployee(employee)}
                    className="w-full text-left p-3 rounded-md border border-yellow-200 hover:bg-yellow-50"
                  >
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-gray-500">{employee.role}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setEmployeeToConfirm(null);
        }}
        onConfirm={handleConfirmAssignment}
        title="Employé Non Disponible"
        message="Cet employé n'est pas disponible pour ce créneau horaire. Voulez-vous quand même l'assigner à ce poste ?"
      />

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Supprimer le quart"
        message="Êtes-vous sûr de vouloir supprimer ce quart de travail ? Cette action est irréversible."
      />
    </>
  );
};
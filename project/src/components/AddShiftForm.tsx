import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useStore } from '../store/useStore';
import { Employee } from '../types';
import { UserCheck } from 'lucide-react';

interface AddShiftFormProps {
  startDate: Date;
  endDate: Date;
  onSubmit: (data: { title: string; start: Date; end: Date; role: string; requiredStaff: number; employeeIds: string[] }) => void;
  onCancel: () => void;
}

export const AddShiftForm: React.FC<AddShiftFormProps> = ({
  startDate,
  endDate,
  onSubmit,
  onCancel,
}) => {
  const { roles, employees, getAvailableEmployees } = useStore();
  const [formData, setFormData] = useState({
    role: roles[0] || '',
    startTime: format(startDate, 'HH:mm'),
    endTime: format(endDate, 'HH:mm'),
    requiredStaff: 1,
  });
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);

  const getShiftWithTime = (time: string, baseDate: Date) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const shift = {
    id: 'temp',
    title: '',
    role: formData.role,
    start: getShiftWithTime(formData.startTime, startDate),
    end: getShiftWithTime(formData.endTime, startDate),
    employeeIds: selectedEmployees.map(emp => emp.id),
    status: 'unassigned' as const,
    requiredStaff: formData.requiredStaff,
  };

  const availableEmployees = getAvailableEmployees(shift);
  const unavailableEmployees = employees.filter(
    emp => emp.role === formData.role && 
    !availableEmployees.find(e => e.id === emp.id) &&
    !selectedEmployees.find(e => e.id === emp.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: `${formData.role} - ${formData.requiredStaff} requis`,
      role: formData.role,
      start: getShiftWithTime(formData.startTime, startDate),
      end: getShiftWithTime(formData.endTime, startDate),
      requiredStaff: formData.requiredStaff,
      employeeIds: selectedEmployees.map(emp => emp.id),
    });
  };

  const handleSelectEmployee = (employee: Employee) => {
    if (selectedEmployees.find(emp => emp.id === employee.id)) {
      setSelectedEmployees(selectedEmployees.filter(emp => emp.id !== employee.id));
    } else if (selectedEmployees.length < formData.requiredStaff) {
      setSelectedEmployees([...selectedEmployees, employee]);
    }
  };

  const handleRemoveEmployee = (employeeId: string) => {
    setSelectedEmployees(selectedEmployees.filter(emp => emp.id !== employeeId));
  };

  // Reset selected employees when role, times, or required staff changes
  useEffect(() => {
    setSelectedEmployees([]);
  }, [formData.role, formData.startTime, formData.endTime, formData.requiredStaff]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          type="number"
          id="requiredStaff"
          min="1"
          value={formData.requiredStaff}
          onChange={(e) => setFormData({ ...formData, requiredStaff: Math.max(1, parseInt(e.target.value)) })}
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

      {/* Selected Employees */}
      {selectedEmployees.length > 0 && (
        <div>
          <h5 className="font-medium text-blue-700 mb-2">
            Employés Sélectionnés ({selectedEmployees.length}/{formData.requiredStaff})
          </h5>
          <div className="space-y-2">
            {selectedEmployees.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-3 rounded-md border border-blue-200 bg-blue-50">
                <div>
                  <div className="font-medium flex items-center">
                    <UserCheck className="w-4 h-4 mr-2 text-blue-600" />
                    {employee.name}
                  </div>
                  <div className="text-sm text-gray-500">{employee.role}</div>
                </div>
                <button
                  type="button"
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
      {availableEmployees.length > 0 && selectedEmployees.length < formData.requiredStaff && (
        <>
          <h5 className="font-medium text-green-700">Employés Disponibles</h5>
          <div className="space-y-2">
            {availableEmployees.map((employee) => (
              <button
                key={employee.id}
                type="button"
                onClick={() => handleSelectEmployee(employee)}
                className={`w-full text-left p-3 rounded-md border ${
                  selectedEmployees.find(e => e.id === employee.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-green-200 hover:bg-green-50'
                }`}
              >
                <div className="font-medium">{employee.name}</div>
                <div className="text-sm text-gray-500">{employee.role}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Unavailable Employees */}
      {unavailableEmployees.length > 0 && selectedEmployees.length < formData.requiredStaff && (
        <>
          <h5 className="font-medium text-yellow-700">Employés Non Disponibles</h5>
          <div className="space-y-2">
            {unavailableEmployees.map((employee) => (
              <button
                key={employee.id}
                type="button"
                onClick={() => handleSelectEmployee(employee)}
                className={`w-full text-left p-3 rounded-md border ${
                  selectedEmployees.find(e => e.id === employee.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-yellow-200 hover:bg-yellow-50'
                }`}
              >
                <div className="font-medium">{employee.name}</div>
                <div className="text-sm text-gray-500">{employee.role}</div>
              </button>
            ))}
          </div>
        </>
      )}

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
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Edit2, Trash2 } from 'lucide-react';
import { Modal } from './Modal';
import { EmployeeForm } from './EmployeeForm';
import { ConfirmationModal } from './ConfirmationModal';
import { Employee } from '../types';

export const EmployeeTable = () => {
  const { employees, updateEmployee } = useStore();
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const handleDelete = () => {
    if (deletingEmployee) {
      // Implement delete logic in store
      const { employees: currentEmployees, ...rest } = useStore.getState();
      useStore.setState({
        ...rest,
        employees: currentEmployees.filter(emp => emp.id !== deletingEmployee.id)
      });
      setDeletingEmployee(null);
    }
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fonction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{employee.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{employee.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{employee.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => setEditingEmployee(employee)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setDeletingEmployee(employee)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        title="Modifier l'Employé"
      >
        {editingEmployee && (
          <EmployeeForm
            initialData={editingEmployee}
            onSubmit={(data) => {
              updateEmployee(editingEmployee.id, data);
              setEditingEmployee(null);
            }}
            onClose={() => setEditingEmployee(null)}
          />
        )}
      </Modal>

      <ConfirmationModal
        isOpen={!!deletingEmployee}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={handleDelete}
        title="Supprimer l'employé"
        message={`Êtes-vous sûr de vouloir supprimer ${deletingEmployee?.name} ? Cette action est irréversible.`}
      />
    </>
  );
};
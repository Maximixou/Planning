import React, { useState } from 'react';
import { Plus, Settings } from 'lucide-react';
import { Modal } from './Modal';
import { EmployeeForm } from './EmployeeForm';
import { EmployeeTable } from './EmployeeTable';
import { RoleManagement } from './RoleManagement';

export const EmployeeManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Employés</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setIsRoleModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <Settings className="w-5 h-5 mr-2" />
            Gestion des Postes
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un Employé
          </button>
        </div>
      </div>

      <EmployeeTable />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Ajouter un Employé"
      >
        <EmployeeForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Gestion des Postes"
      >
        <RoleManagement onClose={() => setIsRoleModalOpen(false)} />
      </Modal>
    </div>
  );
};
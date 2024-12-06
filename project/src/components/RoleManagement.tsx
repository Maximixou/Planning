import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useStore } from '../store/useStore';

interface RoleManagementProps {
  onClose: () => void;
}

export const RoleManagement: React.FC<RoleManagementProps> = ({ onClose }) => {
  const { roles, addRole, removeRole } = useStore();
  const [newRole, setNewRole] = useState('');

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRole.trim()) {
      addRole(newRole.trim());
      setNewRole('');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddRole} className="flex gap-2">
        <input
          type="text"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="Nouveau type de poste"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2"
        />
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </button>
      </form>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {roles.map((role) => (
          <div
            key={role}
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <span className="capitalize">{role}</span>
            <button
              onClick={() => removeRole(role)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          onClick={onClose}
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};
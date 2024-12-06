import React, { useState } from 'react';
import { Calendar } from './Calendar';
import { Dashboard } from './Dashboard';
import { useStore } from '../store/useStore';

export const ScheduleView = () => {
  const { roles } = useStore();
  const [selectedRole, setSelectedRole] = useState<string | 'all'>('all');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Horaires</h2>
        <div className="flex items-center gap-4">
          <label htmlFor="roleFilter" className="text-sm font-medium text-gray-700">
            Filtrer par poste:
          </label>
          <select
            id="roleFilter"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les postes</option>
            {roles.map((role) => (
              <option key={role} value={role} className="capitalize">
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Calendar selectedRole={selectedRole} />
        </div>
        <div>
          <Dashboard selectedRole={selectedRole} />
        </div>
      </div>
    </div>
  );
};
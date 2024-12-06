import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Users, LayoutTemplate, Bell } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

export const Navigation = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 text-sm font-medium ${
      isActive
        ? 'text-blue-600 border-b-2 border-blue-600'
        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;

  return (
    <div className="mt-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex space-x-8">
          <NavLink to="/" className={getLinkClass} end>
            <Calendar className="w-5 h-5 mr-2" />
            Horaires
          </NavLink>
          <NavLink to="/templates" className={getLinkClass}>
            <LayoutTemplate className="w-5 h-5 mr-2" />
            Templates
          </NavLink>
          <NavLink to="/employes" className={getLinkClass}>
            <Users className="w-5 h-5 mr-2" />
            Employés
          </NavLink>
          <NavLink to="/notifications" className={getLinkClass}>
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </NavLink>
        </div>
        <div className="pr-4">
          <NotificationCenter />
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { useStore } from '../store/useStore';
import { Phone, Mail, Clock } from 'lucide-react';

export const EmployeeList = () => {
  const { employees } = useStore();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Employés</h2>
      <div className="space-y-4">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{employee.name}</h3>
                <p className="text-sm text-gray-500">{employee.role}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {employee.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {employee.email}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>Disponibilité:</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {employee.availability.map((av, index) => (
                  <div key={index}>
                    {`${new Date(2024, 0, av.dayOfWeek).toLocaleDateString('fr-FR', { weekday: 'long' })}: 
                    ${av.startTime} - ${av.endTime}`}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { AlertCircle, CheckCircle, Users } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AssignShiftModal } from './AssignShiftModal';
import { Shift } from '../types';

interface DashboardProps {
  selectedRole: string | 'all';
}

export const Dashboard: React.FC<DashboardProps> = ({ selectedRole }) => {
  const { shifts } = useStore();
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const incompleteShifts = shifts
    .filter((shift) => 
      (shift.status === 'unassigned' || shift.status === 'partially_assigned') &&
      (selectedRole === 'all' || shift.role === selectedRole)
    )
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const handleAssignClick = (shift: Shift) => {
    setSelectedShift(shift);
    setIsAssignModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Tableau de Bord</h2>
        
        <div className="grid gap-6 mb-8">
          {incompleteShifts.length === 0 ? (
            <div className="border rounded-lg p-4 bg-green-50">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-green-700">Tous les quarts sont complets</h3>
              </div>
              <p className="text-green-600">
                Il n'y a aucun quart de travail en attente d'assignation.
              </p>
            </div>
          ) : (
            <div className="border rounded-lg p-4 bg-red-50">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold">Quarts Incomplets</h3>
              </div>
              <div className="space-y-3">
                {incompleteShifts.map((shift) => {
                  const remainingStaff = shift.requiredStaff - (shift.employeeIds?.length || 0);
                  const bgColor = shift.status === 'partially_assigned' ? 'bg-yellow-50' : 'bg-white';
                  const borderColor = shift.status === 'partially_assigned' ? 'border-yellow-200' : 'border-red-200';
                  
                  return (
                    <div
                      key={shift.id}
                      className={`p-4 rounded-lg border ${bgColor} ${borderColor} hover:border-opacity-75 transition-colors`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{shift.role}</h4>
                          <p className="text-sm text-gray-500">
                            {format(new Date(shift.start), "EEEE d MMMM 'à' HH:mm", { locale: fr })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(shift.start), 'HH:mm')} - {format(new Date(shift.end), 'HH:mm')}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {remainingStaff} employé{remainingStaff > 1 ? 's' : ''} encore requis
                          </p>
                        </div>
                        <button
                          onClick={() => handleAssignClick(shift)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Assigner
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedShift && (
        <AssignShiftModal
          shift={selectedShift}
          isOpen={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedShift(null);
          }}
        />
      )}
    </>
  );
};
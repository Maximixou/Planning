import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Employee, Shift, Template, TemplateShift, Notification } from '../types';

interface StoreState {
  employees: Employee[];
  shifts: Shift[];
  templates: Template[];
  roles: string[];
  notifications: Notification[];
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addShift: (shift: Shift) => void;
  updateShift: (shiftId: string, updates: Partial<Shift>) => void;
  deleteShift: (shiftId: string) => void;
  assignEmployee: (shiftId: string, employeeId: string) => void;
  unassignEmployee: (shiftId: string, employeeId: string) => void;
  updateShiftStatus: (shiftId: string, status: Shift['status']) => void;
  addTemplate: (template: Template) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  deleteTemplateShift: (templateId: string, shiftId: string) => void;
  applyTemplate: (templateId: string, startDate: Date) => void;
  addRole: (role: string) => void;
  removeRole: (role: string) => void;
  getAvailableEmployees: (shift: Shift) => Employee[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      employees: [],
      shifts: [],
      templates: [],
      roles: ['menage', 'cuisine', 'service'],
      notifications: [],

      addEmployee: (employee) =>
        set((state) => ({ employees: [...state.employees, employee] })),

      updateEmployee: (id, updates) =>
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id ? { ...emp, ...updates } : emp
          ),
        })),

      deleteEmployee: (id) =>
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
        })),

      addShift: (shift) => 
        set((state) => ({ shifts: [...state.shifts, shift] })),

      updateShift: (shiftId, updates) =>
        set((state) => ({
          shifts: state.shifts.map((shift) =>
            shift.id === shiftId ? { ...shift, ...updates } : shift
          ),
        })),

      deleteShift: (shiftId) =>
        set((state) => ({
          shifts: state.shifts.filter((shift) => shift.id !== shiftId),
        })),

      assignEmployee: (shiftId, employeeId) =>
        set((state) => {
          const shift = state.shifts.find((s) => s.id === shiftId);
          if (!shift) return state;

          const updatedEmployeeIds = [...(shift.employeeIds || [])];
          if (!updatedEmployeeIds.includes(employeeId)) {
            updatedEmployeeIds.push(employeeId);
          }

          const status = updatedEmployeeIds.length >= shift.requiredStaff
            ? 'fully_assigned'
            : updatedEmployeeIds.length > 0
            ? 'partially_assigned'
            : 'unassigned';

          return {
            shifts: state.shifts.map((s) =>
              s.id === shiftId
                ? { ...s, employeeIds: updatedEmployeeIds, status }
                : s
            ),
          };
        }),

      unassignEmployee: (shiftId, employeeId) =>
        set((state) => {
          const shift = state.shifts.find((s) => s.id === shiftId);
          if (!shift) return state;

          const updatedEmployeeIds = (shift.employeeIds || []).filter(
            (id) => id !== employeeId
          );

          const status = updatedEmployeeIds.length >= shift.requiredStaff
            ? 'fully_assigned'
            : updatedEmployeeIds.length > 0
            ? 'partially_assigned'
            : 'unassigned';

          return {
            shifts: state.shifts.map((s) =>
              s.id === shiftId
                ? { ...s, employeeIds: updatedEmployeeIds, status }
                : s
            ),
          };
        }),

      updateShiftStatus: (shiftId, status) =>
        set((state) => ({
          shifts: state.shifts.map((shift) =>
            shift.id === shiftId ? { ...shift, status } : shift
          ),
        })),

      addTemplate: (template) =>
        set((state) => ({ templates: [...state.templates, template] })),

      updateTemplate: (id, updates) =>
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id ? { ...template, ...updates } : template
          ),
        })),

      deleteTemplateShift: (templateId, shiftId) =>
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === templateId
              ? {
                  ...template,
                  shifts: template.shifts.filter((shift) => shift.id !== shiftId),
                }
              : template
          ),
        })),

      applyTemplate: (templateId, startDate) =>
        set((state) => {
          const template = state.templates.find((t) => t.id === templateId);
          if (!template) return state;

          const newShifts = template.shifts.map((templateShift) => {
            const shiftDate = new Date(startDate);
            shiftDate.setDate(shiftDate.getDate() + (templateShift.dayOfWeek - startDate.getDay()));
            
            const [startHour, startMinute] = templateShift.startTime.split(':');
            const [endHour, endMinute] = templateShift.endTime.split(':');
            
            const start = new Date(shiftDate);
            start.setHours(parseInt(startHour), parseInt(startMinute));
            
            const end = new Date(shiftDate);
            end.setHours(parseInt(endHour), parseInt(endMinute));

            return {
              id: Math.random().toString(36).substring(2),
              title: templateShift.title,
              start,
              end,
              employeeIds: [],
              status: 'unassigned' as const,
              requiredStaff: templateShift.requiredStaff,
              role: templateShift.role,
            } as Shift;
          });

          return { shifts: [...state.shifts, ...newShifts] };
        }),

      addRole: (role) =>
        set((state) => ({
          roles: [...state.roles, role],
        })),

      removeRole: (role) =>
        set((state) => ({
          roles: state.roles.filter((r) => r !== role),
        })),

      getAvailableEmployees: (shift) => {
        const state = get();
        const shiftDay = new Date(shift.start).getDay();
        const shiftStart = new Date(shift.start).getHours() * 60 + new Date(shift.start).getMinutes();
        const shiftEnd = new Date(shift.end).getHours() * 60 + new Date(shift.end).getMinutes();

        return state.employees.filter((employee) => {
          if (employee.role !== shift.role) return false;

          return employee.availability.some((av) => {
            if (av.dayOfWeek !== shiftDay) return false;

            const [avStartHour, avStartMinute] = av.startTime.split(':').map(Number);
            const [avEndHour, avEndMinute] = av.endTime.split(':').map(Number);
            const availableStart = avStartHour * 60 + avStartMinute;
            const availableEnd = avEndHour * 60 + avEndMinute;

            return shiftStart >= availableStart && shiftEnd <= availableEnd;
          });
        });
      },

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              id: Math.random().toString(36).substring(2),
              createdAt: new Date().toISOString(),
              read: false,
              ...notification,
            },
            ...state.notifications,
          ],
        })),

      markNotificationAsRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          ),
        })),
    }),
    {
      name: 'schedule-master-storage',
      partialize: (state) => ({
        employees: state.employees,
        shifts: state.shifts.map(shift => ({
          ...shift,
          start: shift.start.toISOString(),
          end: shift.end.toISOString()
        })),
        templates: state.templates,
        roles: state.roles,
        notifications: state.notifications,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.shifts = state.shifts.map(shift => ({
            ...shift,
            start: new Date(shift.start),
            end: new Date(shift.end)
          }));
        }
      },
    }
  )
);
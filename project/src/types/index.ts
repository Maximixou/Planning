export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  availability: Availability[];
}

export interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Shift {
  id: string;
  title: string;
  start: Date;
  end: Date;
  employeeIds: string[];
  status: 'unassigned' | 'partially_assigned' | 'fully_assigned';
  requiredStaff: number;
  role: string;
  notes?: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  shifts: TemplateShift[];
}

export interface TemplateShift {
  id: string;
  title: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  requiredStaff: number;
  role: string;
}

export interface Notification {
  id: string;
  type: 'shift_invitation' | 'shift_accepted' | 'shift_declined' | 'shift_reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  shiftId: string;
  employeeId: string;
}

export type WeekType = 'normal' | 'holiday' | 'special';
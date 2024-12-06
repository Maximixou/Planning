import { Employee, Shift } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const sendNotifications = async (employee: Employee, shift: Shift) => {
  const shiftDate = format(new Date(shift.start), "EEEE d MMMM yyyy", { locale: fr });
  const shiftTime = `${format(new Date(shift.start), 'HH:mm')} - ${format(new Date(shift.end), 'HH:mm')}`;

  const emailData = {
    to: employee.email,
    subject: `Nouveau quart de travail - ${shiftDate}`,
    text: `
      Bonjour ${employee.name},

      Un nouveau quart de travail vous a été assigné :

      Date : ${shiftDate}
      Horaire : ${shiftTime}
      Poste : ${shift.role}

      Merci de confirmer votre disponibilité.

      Cordialement,
      L'équipe de gestion des horaires
    `,
  };

  // Simulate email sending
  return new Promise((resolve) => {
    console.log('Email envoyé:', emailData);
    setTimeout(resolve, 500);
  });
};
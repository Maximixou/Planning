import React from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export const NotificationPage = () => {
  const { notifications, markNotificationAsRead } = useStore();
  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'shift_accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shift_declined':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Centre de Notifications</h2>
      </div>

      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900">
              Nouvelles Notifications ({unreadNotifications.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {unreadNotifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(notification.createdAt), "d MMMM 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Read Notifications */}
      {readNotifications.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications Précédentes
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {readNotifications.map((notification) => (
              <div key={notification.id} className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(notification.createdAt), "d MMMM 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {notifications.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune notification</h3>
          <p className="mt-1 text-sm text-gray-500">
            Les nouvelles notifications apparaîtront ici
          </p>
        </div>
      )}
    </div>
  );
};
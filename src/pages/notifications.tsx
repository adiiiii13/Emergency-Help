import { useState } from 'react';
import { ArrowLeft, Bell, AlertTriangle, Clock, MapPin, Check, X, UserPlus } from 'lucide-react';

interface Notification {
  id: number;
  type: 'emergency' | 'alert' | 'request' | 'friend_request';
  title: string;
  message: string;
  location?: string;
  timestamp: string;
  user?: {
    name: string;
    role?: string;
    image?: string;
  };
}

export function NotificationsPage() {
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'friend_request',
      title: 'New Friend Request',
      message: 'wants to connect with you as an emergency contact',
      timestamp: '1 min ago',
      user: {
        name: 'Dr. Sarah Smith',
        role: 'Emergency Medical Officer',
      }
    },
    {
      id: 2,
      type: 'friend_request',
      title: 'New Friend Request',
      message: 'wants to add you as emergency contact',
      timestamp: '2 mins ago',
      user: {
        name: 'John Paramedic',
        role: 'First Responder',
      }
    },
    {
      id: 3,
      type: 'emergency',
      title: 'Fire Emergency',
      message: 'Fire reported in your area. Stay alert and follow safety protocols.',
      location: 'Kothrud Main Road',
      timestamp: '5 mins ago'
    },
    {
      id: 4,
      type: 'request',
      title: 'Help Request',
      message: 'Medical assistance needed at Law College Road',
      location: 'Law College Road',
      timestamp: '10 mins ago'
    },
    {
      id: 5,
      type: 'alert',
      title: 'Weather Alert',
      message: 'Heavy rainfall warning for next 24 hours',
      location: 'Pune District',
      timestamp: '15 mins ago'
    }
  ]);

  const handleAccept = (_id: number) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = 'Request accepted!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleReject = (_id: number) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = 'Request rejected';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const event = new CustomEvent('page-change', { 
                detail: { page: 'home' } 
              });
              window.dispatchEvent(event);
            }}
            className="text-gray-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">{notifications.length} notifications</p>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-4 mb-20">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${
              notification.type === 'emergency' 
                ? 'border-red-500' 
                : notification.type === 'friend_request'
                ? 'border-purple-500'
                : notification.type === 'request'
                ? 'border-blue-500'
                : 'border-yellow-500'
            }`}
          >
            <div className="flex gap-3">
              {notification.type === 'emergency' ? (
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
              ) : notification.type === 'friend_request' ? (
                <UserPlus className="w-6 h-6 text-purple-500 flex-shrink-0" />
              ) : notification.type === 'request' ? (
                <Bell className="w-6 h-6 text-blue-500 flex-shrink-0" />
              ) : (
                <Bell className="w-6 h-6 text-yellow-500 flex-shrink-0" />
              )}
              
              <div className="flex-1">
                {notification.user ? (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm text-purple-600 font-medium">
                        {notification.user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{notification.user.name}</h3>
                      <p className="text-sm text-gray-500">{notification.user.role}</p>
                    </div>
                  </div>
                ) : (
                  <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                )}
                
                <p className="text-gray-600 mt-1">
                  {notification.user ? notification.user.name + ' ' + notification.message : notification.message}
                </p>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {notification.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{notification.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{notification.timestamp}</span>
                    </div>
                  </div>

                  {(notification.type === 'request' || notification.type === 'friend_request') && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(notification.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                      >
                        <Check className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(notification.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
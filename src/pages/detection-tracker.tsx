import React, { useState, useEffect } from 'react';
import { X, Navigation2, MapPin, AlertTriangle, Clock, Users } from 'lucide-react';

export function DetectionTrackerPage() {
  const [showAlert, setShowAlert] = useState(true);
  const [compass, setCompass] = useState(0);
  
  // Simulate compass rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCompass((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const nearbyEmergencies = [
    {
      id: 1,
      type: 'Medical Emergency',
      distance: '0.3 km',
      direction: 45, // degrees
      location: 'Kothrud Main Road',
      severity: 'High',
      timeReported: '2 minutes ago'
    },
    {
      id: 2,
      type: 'Fire Incident',
      distance: '0.8 km',
      direction: 180,
      location: 'Law College Road',
      severity: 'Medium',
      timeReported: '5 minutes ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Emergency Alert Popup */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="bg-red-500 p-4 flex justify-between items-center">
              <h2 className="text-white font-semibold text-lg">Emergency Alert</h2>
              <button 
                onClick={() => setShowAlert(false)}
                className="text-white hover:text-red-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <div>
                  <h3 className="font-semibold text-lg">Emergencies Found Nearby</h3>
                  <p className="text-gray-600">2 incidents within 1km radius</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {nearbyEmergencies.map((emergency) => (
                  <div key={emergency.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{emergency.type}</h4>
                      <span className="text-sm text-red-500">{emergency.distance}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{emergency.location}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{emergency.timeReported}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        emergency.severity === 'High' ? 'bg-red-100 text-red-500' :
                        'bg-orange-100 text-orange-500'
                      }`}>
                        {emergency.severity} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compass UI */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Emergency Tracker</h1>
        <p className="text-gray-600 mb-8">Track nearby emergencies in real-time</p>

        <div className="relative aspect-square max-w-md mx-auto mb-8">
          {/* Compass Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-200">
            {/* Compass markers */}
            {['N', 'E', 'S', 'W'].map((direction, index) => (
              <div
                key={direction}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-start justify-center"
                style={{ transform: `translate(-50%, -50%) rotate(${index * 90}deg)` }}
              >
                <span className="text-gray-400 font-medium mt-2">{direction}</span>
              </div>
            ))}
          </div>

          {/* Rotating compass needle */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `rotate(${compass}deg)` }}
          >
            <Navigation2 className="w-16 h-16 text-red-500" />
          </div>

          {/* Emergency indicators */}
          {nearbyEmergencies.map((emergency) => (
            <div
              key={emergency.id}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ 
                transform: `translate(-50%, -50%) rotate(${emergency.direction}deg) translateY(-45%)` 
              }}
            >
              <div className="bg-red-500 w-3 h-3 rounded-full pulse-animation" />
            </div>
          ))}
        </div>

        {/* Emergency List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Nearby Emergencies</h2>
          {nearbyEmergencies.map((emergency) => (
            <div key={emergency.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-5 h-5 ${
                    emergency.severity === 'High' ? 'text-red-500' : 'text-orange-500'
                  }`} />
                  <h3 className="font-semibold">{emergency.type}</h3>
                </div>
                <span className="text-sm font-medium text-red-500">{emergency.distance}</span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{emergency.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{emergency.timeReported}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(3);
              opacity: 0;
            }
          }
          .pulse-animation::after {
            content: '';
            position: absolute;
            inset: 0;
            background-color: rgb(239, 68, 68);
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
        `}
      </style>
    </div>
  );
}
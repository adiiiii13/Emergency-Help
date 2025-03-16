import React, { useState } from 'react';
import { AlertTriangle, Clock, Users, MapPin, ArrowRight } from 'lucide-react';

export function PredictionPage() {
  const [selectedArea, setSelectedArea] = useState('Kothrud');
  const [timeRange, setTimeRange] = useState('24h');

  const emergencyPredictions = [
    {
      type: 'Road Accident',
      risk: 'High',
      location: 'Kothrud Main Road',
      time: '14:00 - 18:00',
      factors: ['Heavy Traffic', 'School Hours', 'Construction Work']
    },
    {
      type: 'Medical Emergency',
      risk: 'Medium',
      location: 'Senior Living Complex',
      time: '20:00 - 23:00',
      factors: ['Elderly Population', 'Previous Incidents']
    },
    {
      type: 'Fire Hazard',
      risk: 'Low',
      location: 'Industrial Area',
      time: 'All Day',
      factors: ['Regular Inspections', 'Safety Measures']
    }
  ];

  const recentEmergencies = [
    {
      type: 'Road Accident',
      location: 'Kothrud, Pune, 411038',
      description: 'Vehicle MH 41 AK 6543 collision with motorcycle',
      time: '2 hours ago',
      status: 'Resolved'
    },
    {
      type: 'Medical Emergency',
      location: 'Nal Stop, Pune, 411038',
      description: 'Cardiac emergency reported',
      time: '4 hours ago',
      status: 'Active'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Emergency Predictions</h1>
        <p className="text-gray-600 mt-1">AI-powered risk assessment and analysis</p>
      </div>

      {/* Area Selection */}
      <div className="p-6">
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold">Selected Area</h2>
              <p className="text-red-500">{selectedArea}, Pune</p>
            </div>
            <MapPin className="text-red-500 w-6 h-6" />
          </div>
          
          <div className="flex gap-2">
            {['24h', '48h', '7d'].map((time) => (
              <button
                key={time}
                onClick={() => setTimeRange(time)}
                className={`px-4 py-2 rounded-full text-sm ${
                  timeRange === time
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Predictions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Risk Assessment</h2>
          {emergencyPredictions.map((prediction, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-5 h-5 ${
                    prediction.risk === 'High' ? 'text-red-500' :
                    prediction.risk === 'Medium' ? 'text-orange-500' : 'text-green-500'
                  }`} />
                  <h3 className="font-semibold">{prediction.type}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  prediction.risk === 'High' ? 'bg-red-100 text-red-500' :
                  prediction.risk === 'Medium' ? 'bg-orange-100 text-orange-500' : 'bg-green-100 text-green-500'
                }`}>
                  {prediction.risk} Risk
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{prediction.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{prediction.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <div className="flex gap-2 flex-wrap">
                    {prediction.factors.map((factor, fidx) => (
                      <span key={fidx} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Emergencies */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Emergencies</h2>
            <button className="text-red-500 text-sm font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentEmergencies.map((emergency, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{emergency.type}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    emergency.status === 'Active' 
                      ? 'bg-red-100 text-red-500' 
                      : 'bg-green-100 text-green-500'
                  }`}>
                    {emergency.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{emergency.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{emergency.location}</span>
                  <span>{emergency.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
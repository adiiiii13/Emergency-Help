import { useState } from 'react';
import { Phone, ArrowLeft, Users, MapPin } from 'lucide-react';

export function EmergencyCallPage() {
  const [selectedRegion] = useState('India');
  
  const emergencyNumbers = [
    { country: 'India', number: '112', services: 'All Emergency Services' },
    { country: 'India', number: '108', services: 'Ambulance Services' },
    { country: 'India', number: '101', services: 'Fire Department' },
    { country: 'India', number: '100', services: 'Police' },
    { country: 'United States', number: '911', services: 'Police, Fire, Medical' },
    { country: 'United Kingdom', number: '999', services: 'Police, Fire, Ambulance' }
  ];

  const emergencySteps = [
    'Stay calm and speak clearly',
    'State your location first',
    'Describe the emergency situation',
    'Answer all dispatcher questions',
    'Follow dispatcher instructions',
    'Don\'t hang up until instructed'
  ];

  const handleBack = () => {
    const event = new CustomEvent('page-change', { 
      detail: { page: 'firstaid' } 
    });
    window.dispatchEvent(event);
  };

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-red-500 text-white p-6">
        <button
          onClick={handleBack}
          className="flex items-center mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </button>
        <div className="flex items-center">
          <Phone className="w-8 h-8 mr-3" />
          <div>
            <h1 className="text-2xl font-bold">Emergency Numbers</h1>
            <p className="text-red-100">Quick access to emergency services</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Region Selection */}
        <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm">
          <MapPin className="w-5 h-5 text-red-500" />
          <span className="font-medium">{selectedRegion}</span>
        </div>

        {/* Emergency Numbers */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Emergency Numbers</h2>
          <div className="space-y-3">
            {emergencyNumbers
              .filter(item => item.country === selectedRegion)
              .map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleCall(item.number)}
                  className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-left">{item.services}</h3>
                    <p className="text-sm text-gray-600">{item.country}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-red-500">{item.number}</span>
                    <Phone className="w-5 h-5 text-red-500" />
                  </div>
                </button>
            ))}
          </div>
        </div>

        {/* Other Country Numbers */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">International Emergency Numbers</h2>
          <div className="space-y-3">
            {emergencyNumbers
              .filter(item => item.country !== selectedRegion)
              .map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleCall(item.number)}
                  className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium">{item.country}</h3>
                    <p className="text-sm text-gray-600">{item.services}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-red-500">{item.number}</span>
                    <Phone className="w-5 h-5 text-red-500" />
                  </div>
                </button>
            ))}
          </div>
        </div>

        {/* Emergency Call Guidelines */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">When Calling Emergency Services</h2>
          <div className="space-y-3">
            {emergencySteps.map((step, index) => (
              <div key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <p className="ml-3 text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
          <div className="flex items-center gap-2 text-yellow-800 mb-2">
            <Users className="w-5 h-5" />
            <h3 className="font-medium">Important Note</h3>
          </div>
          <p className="text-sm text-yellow-700">
            Making false emergency calls is a serious offense that can result in fines or imprisonment. 
            Only call emergency services for genuine emergencies.
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { ArrowLeft, Search, AlertTriangle, Droplets, Flame, Wind } from 'lucide-react';

const calamityTips = [
  {
    type: 'Earthquake',
    icon: AlertTriangle,
    color: 'amber',
    tips: [
      'Drop, Cover, and Hold On',
      'Stay away from windows and exterior walls',
      'If indoors, stay there until shaking stops',
      'If outdoors, move to a clear area away from buildings',
      'Keep an emergency kit ready',
      'Know the safe spots in each room',
      'Have a family communication plan',
      'Keep a flashlight and sturdy shoes by your bed'
    ],
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&q=80&w=1920',
    description: 'Earthquakes strike without warning. Being prepared and knowing how to react can save lives.'
  },
  {
    type: 'Flood',
    icon: Droplets,
    color: 'blue',
    tips: [
      'Move to higher ground immediately',
      'Never drive through flooded roads',
      'Keep important documents waterproof',
      'Listen to emergency broadcasts',
      'Prepare an evacuation plan',
      'Store drinking water in clean containers',
      'Have battery-powered emergency lighting',
      'Keep emergency contact numbers handy'
    ],
    image: 'https://images.unsplash.com/photo-1604275689235-fdc521556c16?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Floods can develop slowly or suddenly. Stay informed and be ready to evacuate if necessary.'
  },
  {
    type: 'Fire',
    icon: Flame,
    color: 'red',
    tips: [
      'Install smoke detectors and check regularly',
      'Create and practice an escape plan',
      'Stay low to avoid smoke inhalation',
      'Never use elevators during a fire',
      'Keep fire extinguishers accessible',
      'Know multiple escape routes',
      'Have a designated meeting place outside',
      'Test smoke alarms monthly'
    ],
    image: 'https://images.unsplash.com/photo-1486551937199-baf066858de7?auto=format&fit=crop&q=80&w=1920',
    description: 'In case of fire, every second counts. Having a plan and practicing it can make all the difference.'
  },
  {
    type: 'Hurricane',
    icon: Wind,
    color: 'cyan',
    tips: [
      'Board up windows and secure outdoor items',
      'Stock up on emergency supplies',
      'Follow evacuation orders',
      'Stay informed about storm progress',
      'Have a battery-powered radio',
      'Fill vehicles with fuel',
      'Prepare a hurricane emergency kit',
      'Know your evacuation zone'
    ],
    image: 'https://images.unsplash.com/photo-1559060017-445fb9722f2a?auto=format&fit=crop&q=80&w=1920',
    description: 'Hurricanes can cause catastrophic damage. Early preparation is key to survival.'
  }
];

export function LifeTipsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleBack = () => {
    const event = new CustomEvent('page-change', { 
      detail: { page: 'firstaid' } 
    });
    window.dispatchEvent(event);
  };

  const filteredCalamities = calamityTips.filter(calamity =>
    calamity.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calamity.tips.some(tip => tip.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-28">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-purple-600 hover:text-purple-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search safety tips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64 transition-shadow duration-200"
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Emergency Safety Guidelines</h1>
        <p className="text-gray-600 mb-8 text-lg">Essential safety tips and procedures for various emergency situations.</p>

        <div className="grid gap-8 md:grid-cols-2">
          {filteredCalamities.map((calamity) => {
            const IconComponent = calamity.icon;
            return (
              <div key={calamity.type} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={calamity.image}
                    alt={calamity.type}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className={`w-6 h-6 text-${calamity.color}-500`} />
                        <h2 className="text-2xl font-bold">{calamity.type}</h2>
                      </div>
                      <p className="text-sm text-gray-200">{calamity.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {calamity.tips.map((tip, index) => (
                      <li key={index} className="flex items-start animate-fadeIn">
                        <span className={`inline-block w-2 h-2 bg-${calamity.color}-500 rounded-full mt-2 mr-3`}></span>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
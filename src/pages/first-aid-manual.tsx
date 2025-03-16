import { useState } from 'react';
import { BookOpen, ArrowLeft, Search } from 'lucide-react';

export function FirstAidManualPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const manualSections = [
    {
      title: 'Basic Life Support',
      content: [
        { heading: 'Check Response', text: 'Gently shake and ask loudly if they\'re okay' },
        { heading: 'Open Airway', text: 'Tilt head back slightly to open the airway' },
        { heading: 'Check Breathing', text: 'Look, listen and feel for normal breathing' },
        { heading: 'Start CPR', text: 'If not breathing normally, begin chest compressions' }
      ]
    },
    {
      title: 'Bleeding Control',
      content: [
        { heading: 'Apply Pressure', text: 'Use clean cloth or sterile bandage' },
        { heading: 'Elevate', text: 'Raise injured area above heart if possible' },
        { heading: 'Clean Wound', text: 'Clean with antiseptic when bleeding slows' },
        { heading: 'Bandage', text: 'Apply appropriate dressing and bandage' }
      ]
    },
    {
      title: 'Fractures & Sprains',
      content: [
        { heading: 'Immobilize', text: 'Prevent movement of injured area' },
        { heading: 'Apply Ice', text: 'Reduce swelling with cold compress' },
        { heading: 'Compress', text: 'Use elastic bandage for support' },
        { heading: 'Elevate', text: 'Raise injured limb when possible' }
      ]
    }
  ];

  const filteredSections = manualSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.some(item => 
      item.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleBack = () => {
    const event = new CustomEvent('page-change', { 
      detail: { page: 'firstaid' } 
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="bg-green-500 text-white p-6">
        <button
          onClick={handleBack}
          className="flex items-center mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </button>
        <div className="flex items-center">
          <BookOpen className="w-8 h-8 mr-3" />
          <div>
            <h1 className="text-2xl font-bold">First Aid Manual</h1>
            <p className="text-green-100">Comprehensive emergency care guide</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search manual..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="space-y-6">
          {filteredSections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-green-700">{section.title}</h2>
              <div className="space-y-4">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex} className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-medium text-gray-800 mb-1">{item.heading}</h3>
                    <p className="text-gray-600 text-sm">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-green-50 p-4 rounded-xl border border-green-100">
          <h3 className="font-medium text-green-800 mb-2">Important Note</h3>
          <p className="text-sm text-green-700">
            This manual is for reference only. Always seek professional medical help in emergencies.
            Keep your first aid knowledge updated through certified training courses.
          </p>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Heart, Search, Phone, PlayCircle, BookOpen, Star, ArrowRight, AlertTriangle } from 'lucide-react';

export function QuickFirstAidPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const emergencyGuides = [
    {
      id: 1,
      title: 'CPR Guide',
      description: 'Learn proper CPR techniques for adults and children',
      duration: '5 min',
      level: 'Critical',
      views: '12k'
    },
    {
      id: 2,
      title: 'Bleeding Control',
      description: 'Steps to control severe bleeding and prevent shock',
      duration: '3 min',
      level: 'Critical',
      views: '8k'
    },
    {
      id: 3,
      title: 'Burn Treatment',
      description: 'First aid for different types of burns',
      duration: '4 min',
      level: 'Important',
      views: '6k'
    }
  ];

  const quickActions = [
    { 
      id: 1, 
      title: 'Call Emergency', 
      icon: Phone, 
      color: 'bg-red-500',
      action: () => {
        const event = new CustomEvent('page-change', { 
          detail: { page: 'emergency-call' } 
        });
        window.dispatchEvent(event);
      }
    },
    { 
      id: 2, 
      title: 'Video Guide', 
      icon: PlayCircle, 
      color: 'bg-blue-500',
      action: () => {
        const event = new CustomEvent('page-change', { 
          detail: { page: 'video-guide' } 
        });
        window.dispatchEvent(event);
      }
    },
    { 
      id: 3, 
      title: 'First Aid Manual', 
      icon: BookOpen, 
      color: 'bg-green-500',
      action: () => {
        const event = new CustomEvent('page-change', { 
          detail: { page: 'manual' } 
        });
        window.dispatchEvent(event);
      }
    },
    { 
      id: 4, 
      title: 'Save Life Tips', 
      icon: Heart, 
      color: 'bg-purple-500',
      action: () => {
        const event = new CustomEvent('page-change', { 
          detail: { page: 'life-tips' } 
        });
        window.dispatchEvent(event);
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white p-6">
        <h1 className="text-2xl font-bold mb-2">Quick First Aid</h1>
        <p className="text-gray-600">Emergency medical guidance at your fingertips</p>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search first aid guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className="flex items-center p-4 rounded-xl bg-white shadow-sm"
            >
              <div className={`${action.color} p-3 rounded-lg`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-sm font-medium">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Guides */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Emergency Guides</h2>
          <button className="text-red-500 text-sm font-medium flex items-center">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="space-y-4">
          {emergencyGuides.map((guide) => (
            <div key={guide.id} className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{guide.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  guide.level === 'Critical' ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {guide.level}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{guide.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <PlayCircle className="w-4 h-4 mr-1" />
                <span>{guide.duration}</span>
                <span className="mx-2">•</span>
                <Star className="w-4 h-4 mr-1" />
                <span>{guide.views} views</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Tips */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Important Tips</h2>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="font-medium text-red-800">Remember</h3>
              <ul className="mt-2 text-sm text-red-700 space-y-1">
                <li>• Always ensure your safety first</li>
                <li>• Call emergency services immediately</li>
                <li>• Keep the victim calm and still</li>
                <li>• Monitor breathing and consciousness</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
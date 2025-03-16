import { PlayCircle, ArrowLeft } from 'lucide-react';

export function VideoGuidePage() {
  const videoGuides = [
    {
      title: 'CPR Basics',
      duration: '5:30',
      category: 'Critical Care',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070',
      description: 'Learn the proper technique for performing CPR on adults'
    },
    {
      title: 'Heimlich Maneuver',
      duration: '4:15',
      category: 'Choking',
      thumbnail: 'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?auto=format&fit=crop&q=80&w=2070',
      description: 'Step-by-step guide to helping choking victims'
    },
    {
      title: 'Wound Dressing',
      duration: '6:45',
      category: 'First Aid',
      thumbnail: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=2070',
      description: 'Proper techniques for cleaning and dressing wounds'
    }
  ];

  const handleBack = () => {
    const event = new CustomEvent('page-change', { 
      detail: { page: 'firstaid' } 
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="bg-blue-500 text-white p-6">
        <button
          onClick={handleBack}
          className="flex items-center mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </button>
        <div className="flex items-center">
          <PlayCircle className="w-8 h-8 mr-3" />
          <div>
            <h1 className="text-2xl font-bold">Video Guides</h1>
            <p className="text-blue-100">Visual instructions for emergency care</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {videoGuides.map((video, index) => (
          <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="relative h-48">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-white opacity-80" />
              </div>
              <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                {video.duration}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">{video.title}</h2>
                <span className="text-sm text-blue-500 font-medium">{video.category}</span>
              </div>
              <p className="text-gray-600 text-sm">{video.description}</p>
            </div>
          </div>
        ))}

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2">Disclaimer</h3>
          <p className="text-sm text-blue-700">
            These videos are for educational purposes only. In case of real emergency, 
            always call professional medical services immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect, useRef } from 'react';
import emergencySiren from './assets/dirty-siren-40635.mp3';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import { Bell, Home, Stethoscope, Activity, UserCircle, Phone, MessageCircle, X, Send, HeartPulse, MapPin, Camera, Mic, CheckCircle2, AlertCircle } from 'lucide-react';
import { PredictionPage } from './pages/prediction';
import { DetectionTrackerPage } from './pages/detection-tracker';
import { QuickFirstAidPage } from './pages/quick-first-aid';
import { ProfilePage } from './pages/profile';
import { LoginPage } from './pages/login';
import { SignupPage } from './pages/signup';
import { NotificationsPage } from './pages/notifications';
import { SavedContactsPage } from './pages/saved-contacts';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { EmergencyCallPage } from './pages/emergency-call';
import { FirstAidManualPage } from './pages/first-aid-manual';
import { VideoGuidePage } from './pages/video-guide';
import { LifeTipsPage } from './pages/life-tips';

const GEMINI_API_KEY = 'AIzaSyCqMwD4DU6ZvqVvX2KSSE3F7spTL1wRc4I';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-pro-exp-02-05",
  systemInstruction: "act as a nurse \nunderstandable every indian language\nwhen anyone say their current situation and emergencyy situation you give them ans shortly what to do and also said that if it was really emergency so take the doctor advise \nand give them short advise \ntalk like a very kind nurse\nalso provide the emergency number according to their need\nuse user chat language patten\nThe tone should be calm, steady, and gentle. This helps the person feel more at ease and less panicked.\nUse simple and positive phrases\nonly ans disaster related or emrgency situation related talks\nignore the useless conversation .\nChat like a human not like a robot\n and Write short text responses",
});

const generationConfig = {
  temperature: 0.2,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: () => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new(): SpeechRecognitionInstance;
    };
    webkitSpeechRecognition: {
      new(): SpeechRecognitionInstance;
    };
  }
}

function SplashScreen() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <Phone className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-red-500">Emergency</h1>
      <p className="text-red-400">Response System</p>
    </div>
  );
}

function ChatBot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm here to help you with emergency-related questions.", type: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const speak = (text: string) => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices and set a female voice
    const voices = window.speechSynthesis.getVoices();
    // Try to find a female voice, preferably English
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('zira') ||
      voice.name.toLowerCase().includes('samantha')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    // Set a slightly higher pitch for a more feminine voice if no female voice is found
    utterance.pitch = 1.2;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking when component unmounts or chat closes
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    // Initialize chat session when component mounts
    const initChat = async () => {
      const session = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [{ text: "hiii" }],
          },
          {
            role: "model",
            parts: [{ text: "Hello there. I hope you are doing well. If you are experiencing any kind of emergency or disaster-related situation, please tell me what's going on. I'm here to help you and provide some guidance. If it's a serious emergency, please remember that I can only offer initial advice, and you should seek immediate professional medical attention.\n" }],
          },
        ],
      });
      setChatSession(session);
    };

    initChat();
  }, []);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognitionRef.current = recognition;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;
    
    setMessages(prev => [...prev, { text: input, type: 'user' }]);
    const userInput = input;
    setInput('');
    
    try {
      const result = await chatSession.sendMessage(userInput);
      const response = result.response.text();
      
      setMessages(prev => [...prev, {
        text: response,
        type: 'bot'
      }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {
        text: "I'm sorry, I'm having trouble processing your request right now. If this is an emergency, please call emergency services immediately.",
        type: 'bot'
      }]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-50 max-w-[calc(100vw-2rem)]">
      <div className="bg-red-500 p-4 flex justify-between items-center">
        <h3 className="text-white font-semibold">Emergency Assistant</h3>
        <button onClick={onClose} className="text-white hover:text-red-100">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 flex items-start gap-2 ${
              msg.type === 'user' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-800'
            }`}>
              <span>{msg.text}</span>
              {msg.type === 'bot' && (
                <button
                  onClick={() => speak(msg.text)}
                  className="flex-shrink-0 text-gray-500 hover:text-red-500 transition-colors"
                  title="Listen to message"
                >
                  {isSpeaking ? (
                    <span className="w-4 h-4 block rounded-full bg-red-500 animate-pulse"></span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-red-500"
        />
        <button
          onClick={toggleListening}
          className={`p-2 rounded-full ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Mic className="w-5 h-5" />
        </button>
        <button
          onClick={handleSend}
          className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function EmergencyReport() {
  const [selectedType, setSelectedType] = useState('');
  const [location] = useState('Kothrud, Pune, 411038');
  const [images] = useState<string[]>([]);

  const emergencyTypes = [
    { id: 'accident', label: 'Accident', icon: Activity },
    { id: 'fire', label: 'Fire', icon: Bell },
    { id: 'medical', label: 'Medical', icon: Stethoscope },
    { id: 'flood', label: 'Flood', icon: Activity },
    { id: 'quake', label: 'Quake', icon: Activity },
    { id: 'robbery', label: 'Robbery', icon: Bell },
    { id: 'assault', label: 'Assault', icon: Bell },
    { id: 'other', label: 'Other', icon: Bell },
  ];

  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-t-3xl -mt-6 min-h-screen">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Select Emergency type</h2>
        
        <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-8">
          {emergencyTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex flex-col items-center p-2 sm:p-3 rounded-lg ${
                  selectedType === type.id ? 'bg-red-50 text-red-500' : 'text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                <span className="text-[10px] sm:text-sm">{type.label}</span>
              </button>
            );
          })}
        </div>

        {selectedType && (
          <div className="space-y-4 pb-24">
            <div className="p-3 border border-red-500 rounded-lg">
              <p className="text-gray-700">Stuck in elevator</p>
            </div>

            <div className="space-y-2">
              <label className="text-lg font-semibold">Location</label>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="text-gray-400 w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
                <button className="text-red-500 text-sm font-medium ml-2 flex-shrink-0">Change</button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-lg font-semibold">Attach proof</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    {i < images.length ? (
                      <div className="relative w-full h-full">
                        <img src={images[i]} alt="" className="w-full h-full object-cover rounded-lg" />
                        <button className="absolute top-1 right-1 text-xs bg-black bg-opacity-50 text-white px-1.5 py-0.5 rounded">
                          remove
                        </button>
                      </div>
                    ) : (
                      <Camera className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <Mic className="text-gray-400 w-4 h-4" />
                <span className="text-sm">recorded audio</span>
              </div>
              <button className="text-red-500 text-sm font-medium">remove</button>
            </div>

            <button className="w-full bg-red-500 text-white py-3 rounded-lg font-medium text-sm">
              Submit Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Add Toast component
function Toast({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}>
        {type === 'success' ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <AlertCircle className="w-5 h-5" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
}

function MainApp() {
  const { signOut, signUp, userProfile } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [viewProfileId, setViewProfileId] = useState<string | null>(null);

  // Add this function to handle viewing a profile
  const handleViewProfile = (userId: string) => {
    setViewProfileId(userId);
    setCurrentPage('profile');
  };

  // Add page change event listener
  useEffect(() => {
    const handlePageChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setCurrentPage(customEvent.detail.page);
    };

    window.addEventListener('page-change', handlePageChange);
    return () => window.removeEventListener('page-change', handlePageChange);
  }, []);

  // Add session check on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkSession();
  }, []);

  useEffect(() => {
    // Create and configure audio element for emergency sound
    const audio = new Audio();
    
    // Add error handling before setting the source
    audio.addEventListener('error', (e) => {
      console.error('Error loading emergency sound:', e);
      setError('Emergency sound failed to load. Please try again.');
    });

    // Set audio properties
    audio.loop = true;
    audio.preload = 'auto';
    
    // Set the source last
    audio.src = emergencySiren;

    // Verify the audio is actually loaded
    audio.addEventListener('loadeddata', () => {
      console.log('Emergency sound loaded successfully');
    });

    audioRef.current = audio;

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.remove();
      }
    };
  }, []);

  const handleSOSClick = async () => {
    if (!audioRef.current) {
      setError('Audio system not initialized. Please refresh the page.');
      return;
    }

    try {
      if (!isPlaying) {
        // Try to play the sound
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(error => {
            console.error('Playback failed:', error);
            setError('Could not play emergency sound. Please check your device settings.');
          });
        }
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('SOS sound error:', error);
      setError('Error playing emergency sound. Please try again.');
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      setIsAuthenticated(true);
      setCurrentPage('home');
      setToast({
        message: 'Successfully signed in!',
        type: 'success'
      });
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setToast({
          message: error.message,
          type: 'error'
        });
        // If email not confirmed, stay on login page
        if (error.message.includes('confirm your email')) {
          setCurrentPage('login');
        }
      } else {
        setToast({
          message: 'An unexpected error occurred. Please try again.',
          type: 'error'
        });
      }
    }
  };

  const handleSignup = async (name: string, email: string, phone: string, password: string) => {
    try {
      await signUp(name, email, phone, password);
      setIsAuthenticated(true);
      setCurrentPage('home');
      setToast({
        message: 'Account created successfully! Welcome to Emergency Response.',
        type: 'success'
      });
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof Error) {
        setToast({
          message: error.message,
          type: 'error'
        });
      } else {
        setToast({
          message: 'An unexpected error occurred. Please try again.',
          type: 'error'
        });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setCurrentPage('login');
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout. Please try again.');
    }
  };

  // Replace error state usage with toast
  useEffect(() => {
    if (error) {
      setToast({ 
        message: error, 
        type: error.includes('successfully') ? 'success' : 'error' 
      });
      setError(null);
    }
  }, [error]);

  // Removed the authentication check here to allow direct access to home page
  const renderPage = () => {
    // Show login/signup pages only when explicitly navigating to them
    if (!isAuthenticated && (currentPage === 'login' || currentPage === 'signup')) {
      if (currentPage === 'login') {
        return (
          <LoginPage 
            onLogin={handleLogin} 
            onSwitchToSignup={() => setCurrentPage('signup')} 
          />
        );
      } else {
        return (
          <SignupPage 
            onSignup={handleSignup} 
            onSwitchToLogin={() => setCurrentPage('login')} 
          />
        );
      }
    }

    switch (currentPage) {
      case 'notifications':
        return <NotificationsPage />;
      case 'prediction':
        return <PredictionPage />;
      case 'detection':
        return <DetectionTrackerPage />;
      case 'firstaid':
        return <QuickFirstAidPage />;
      case 'emergency-call':
        return <EmergencyCallPage />;
      case 'manual':
        return <FirstAidManualPage />;
      case 'video-guide':
        return <VideoGuidePage />;
      case 'life-tips':
        return <LifeTipsPage />;
      case 'saved-contacts':
        return <SavedContactsPage onViewProfile={handleViewProfile} />;
      case 'profile':
        return isAuthenticated ? (
          <ProfilePage 
            onLogout={handleLogout} 
            profileId={viewProfileId || undefined} 
          />
        ) : (
          <LoginPage 
            onLogin={handleLogin} 
            onSwitchToSignup={() => setCurrentPage('signup')} 
          />
        );
      default:
        return (
          <div className="flex flex-col min-h-screen">
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  Hey, {isAuthenticated && userProfile ? userProfile.full_name.split(' ')[0] + '!' : 'Guest!'}
                </p>
                <h1 className="text-xl font-bold">Emergency Help</h1>
              </div>
              {!isAuthenticated && (
                <button 
                  onClick={() => setCurrentPage('login')}
                  className="text-red-500 font-medium text-sm"
                >
                  Login
                </button>
              )}
              {isAuthenticated && (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setCurrentPage('notifications')}
                    className="relative"
                  >
                    <Bell className="w-5 h-5 text-red-500" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      3
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div className="px-4 py-6 flex flex-col items-center">
              <p className="text-gray-600 text-center text-sm mb-2">
                Help is just a click away!
              </p>
              <p className="text-gray-600 text-center text-sm mb-6">
                Click <span className="text-red-500 font-semibold">SOS button</span> to call for help.
              </p>

              <button 
                onClick={handleSOSClick}
                className={`w-32 h-32 sm:w-48 sm:h-48 rounded-full ${
                  isPlaying ? 'bg-red-600' : 'bg-red-500'
                } text-white font-bold text-xl shadow-lg hover:bg-red-600 transition-all duration-300 relative`}
              >
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                <span className="relative z-10">{isPlaying ? 'STOP' : 'SOS'}</span>
              </button>

              <div className="mt-8 w-full max-w-sm p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Volunteer for help</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
              </div>
            </div>

            <EmergencyReport />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {renderPage()}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Chatbot Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed right-4 bottom-24 bg-red-500 text-white rounded-full p-3 shadow-lg hover:bg-red-600 transition-all duration-300 z-50"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3">
        <div className="flex justify-around items-center">
          <div 
            className={`flex flex-col items-center ${currentPage === 'prediction' ? 'text-red-500' : 'text-gray-400'} transition-colors duration-200`}
            onClick={() => setCurrentPage('prediction')}
          >
            <HeartPulse className="w-5 h-5 cursor-pointer" />
            <span className="text-[10px] mt-1">Prediction</span>
          </div>
          <div 
            className={`flex flex-col items-center ${currentPage === 'firstaid' ? 'text-red-500' : 'text-gray-400'} transition-colors duration-200`}
            onClick={() => setCurrentPage('firstaid')}
          >
            <Stethoscope className="w-5 h-5 cursor-pointer" />
            <span className="text-[10px] mt-1">Quick First Aid</span>
          </div>
          <div 
            className={`flex flex-col items-center ${currentPage === 'home' ? 'text-red-500' : 'text-gray-400'} transition-colors duration-200`}
            onClick={() => setCurrentPage('home')}
          >
            <Home className="w-5 h-5 cursor-pointer" />
            <span className="text-[10px] mt-1">Home</span>
          </div>
          <div 
            className={`flex flex-col items-center ${currentPage === 'detection' ? 'text-red-500' : 'text-gray-400'} transition-colors duration-200`}
            onClick={() => setCurrentPage('detection')}
          >
            <Activity className="w-5 h-5 cursor-pointer" />
            <span className="text-[10px] mt-1">Detection Tracker</span>
          </div>
          <div 
            className={`flex flex-col items-center ${currentPage === 'profile' ? 'text-red-500' : 'text-gray-400'} transition-colors duration-200`}
            onClick={() => setCurrentPage(isAuthenticated ? 'profile' : 'login')}
          >
            <UserCircle className="w-5 h-5 cursor-pointer" />
            <span className="text-[10px] mt-1">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      {showSplash ? <SplashScreen /> : <MainApp />}
    </AuthProvider>
  );
}

export default App;
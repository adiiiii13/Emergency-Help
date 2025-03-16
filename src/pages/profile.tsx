import { Settings, Bell, Heart, Clock, MapPin, Phone, Mail, ChevronRight, Award, UserCircle2, UserPlus, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ProfilePageProps {
  onLogout: () => void;
  profileId?: string; // Add this to support viewing other profiles
}

export function ProfilePage({ onLogout, profileId }: ProfilePageProps) {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [viewedProfile, setViewedProfile] = useState<any>(null);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // If profileId is provided, fetch and show that user's profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId || profileId === user?.id) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();

        if (error) throw error;
        setViewedProfile(profile);

        // Check if there's an existing request
        const { data: existingRequest } = await supabase
          .from('contact_requests')
          .select('status')
          .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${user?.id})`)
          .single();

        if (existingRequest) {
          setRequestStatus(existingRequest.status);
        }

      } catch (err) {
        console.error('Error fetching profile:', err);
        setToast({
          message: 'Failed to load profile',
          type: 'error'
        });
      }
    };

    fetchProfile();
  }, [profileId, user?.id]);

  const sendFriendRequest = async () => {
    if (!user || !viewedProfile) return;
    
    setLoading(true);
    try {
      // Send friend request
      const { error: insertError } = await supabase
        .from('contact_requests')
        .insert({
          sender_id: user.id,
          receiver_id: viewedProfile.id,
          status: 'pending'
        });

      if (insertError) throw insertError;

      setRequestStatus('pending');
      setToast({
        message: 'Friend request sent successfully!',
        type: 'success'
      });

    } catch (err) {
      console.error('Error sending friend request:', err);
      setToast({
        message: 'Failed to send request. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRequestButton = () => {
    if (loading) {
      return (
        <button disabled className="p-2 rounded-full bg-gray-100 text-gray-400">
          <UserPlus className="w-6 h-6" />
        </button>
      );
    }

    switch (requestStatus) {
      case 'pending':
        return (
          <button disabled className="p-2 rounded-full bg-yellow-100 text-yellow-500">
            <Clock className="w-6 h-6" />
          </button>
        );
      case 'accepted':
        return (
          <button disabled className="p-2 rounded-full bg-green-100 text-green-500">
            <Check className="w-6 h-6" />
          </button>
        );
      default:
        return (
          <button
            onClick={sendFriendRequest}
            className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200"
          >
            <UserPlus className="w-6 h-6" />
          </button>
        );
    }
  };

  const displayedProfile = viewedProfile || userProfile;
  const isOwnProfile = !profileId || profileId === user?.id;

  const userStats = [
    { icon: Heart, label: 'Lives Saved', value: '5' },
    { icon: Clock, label: 'Response Time', value: '3m' },
    { icon: Award, label: 'Rank', value: 'Gold' }
  ];

  const menuItems = [
    { icon: Bell, label: 'Notifications', badge: '3', link: 'notifications' },
    { icon: UserCircle2, label: 'Emergency Contacts', badge: '4', link: 'saved-contacts' },
    { icon: MapPin, label: 'Saved Locations', badge: '2', link: 'locations' },
    { icon: Settings, label: 'Settings', link: 'settings' }
  ];

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Profile Header */}
      <div className="bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                const event = new CustomEvent('page-change', { 
                  detail: { page: 'saved-contacts' } 
                });
                window.dispatchEvent(event);
              }}
              className="text-gray-600"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Profile</h1>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-500">
                {displayedProfile ? getInitials(displayedProfile.full_name) : ''}
              </span>
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold">{displayedProfile?.full_name}</h1>
              <p className="text-gray-600">Emergency Responder</p>
              <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                Active Volunteer
              </span>
            </div>
          </div>
          
          {!isOwnProfile && getRequestButton()}
        </div>

        {/* Contact Info */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span>{displayedProfile?.phone}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            <span>{displayedProfile?.email}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-4">
        {userStats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-xl text-center">
            <stat.icon className="w-6 h-6 mx-auto mb-2 text-red-500" />
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-xs text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Show menu items and logout only for own profile */}
      {isOwnProfile && (
        <>
          {/* Menu Items */}
          <div className="p-4">
            <div className="bg-white rounded-xl overflow-hidden">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const event = new CustomEvent('page-change', { 
                      detail: { page: item.link } 
                    });
                    window.dispatchEvent(event);
                  }}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b last:border-b-0"
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 text-gray-500" />
                    <span className="ml-3">{item.label}</span>
                  </div>
                  <div className="flex items-center">
                    {item.badge && (
                      <span className="mr-2 bg-red-100 text-red-500 px-2 py-1 rounded-full text-xs">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-4">
            <button 
              onClick={onLogout}
              className="w-full bg-red-500 text-white py-3 rounded-xl font-medium"
            >
              Logout
            </button>
          </div>
        </>
      )}

      {/* Toast Message */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white px-6 py-3 rounded-lg shadow-lg`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
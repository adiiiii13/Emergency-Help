import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Phone, User2, UserCircle2, Pencil, Trash2, HeartHandshake, Mail, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ChatPage } from './chat';

// Toast component
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

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  is_primary: boolean;
  is_app_user?: boolean;
  app_user_id?: string;
  email?: string;
}

interface UserSearchResult {
  id: string;
  email: string;
  full_name: string;
}

interface SavedContactsPageProps {
  onViewProfile?: (userId: string) => void;
}

export function SavedContactsPage({ onViewProfile }: SavedContactsPageProps) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [selectedChat, setSelectedChat] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
    is_primary: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchContacts();
  }, [user]);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select(`
          *,
          app_user:app_user_id (
            email
          )
        `)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      
      const contactsWithEmail = data?.map(contact => ({
        ...contact,
        email: contact.app_user?.email
      })) || [];
      
      setContacts(contactsWithEmail);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const addAppUserContact = async (searchResult: UserSearchResult) => {
    try {
      // Check if contact already exists
      const { data: existingContact } = await supabase
        .from('emergency_contacts')
        .select('id')
        .eq('user_id', user?.id)
        .eq('app_user_id', searchResult.id)
        .single();

      if (existingContact) {
        setError('This contact is already in your list');
        return;
      }

      const { error } = await supabase
        .from('emergency_contacts')
        .insert([{
          user_id: user?.id,
          name: searchResult.full_name,
          phone: '', // Optional for app users
          relationship: 'App User',
          is_app_user: true,
          app_user_id: searchResult.id
        }]);

      if (error) throw error;
      
      // Clear search and show success message
      setSearchQuery('');
      setSearchResults([]);
      setError(null);
      setToast({ message: 'Contact added successfully!', type: 'success' });
      await fetchContacts();
    } catch (err) {
      console.error('Error adding app user contact:', err);
      setError('Failed to add contact. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingContact) {
        const { error } = await supabase
          .from('emergency_contacts')
          .update({
            name: formData.name,
            phone: formData.phone,
            relationship: formData.relationship,
            is_primary: formData.is_primary
          })
          .eq('id', editingContact.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('emergency_contacts')
          .insert([{
            user_id: user?.id,
            name: formData.name,
            phone: formData.phone,
            relationship: formData.relationship,
            is_primary: formData.is_primary
          }]);

        if (error) throw error;
      }

      // Reset form and fetch updated contacts
      setFormData({ name: '', phone: '', relationship: '', is_primary: false });
      setIsAddingContact(false);
      setEditingContact(null);
      await fetchContacts();
    } catch (err) {
      console.error('Error saving contact:', err);
      setError('Failed to save contact');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchContacts();
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError('Failed to delete contact');
    }
  };

  const handleEdit = (contact: EmergencyContact) => {
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      is_primary: contact.is_primary
    });
    setEditingContact(contact);
    setIsAddingContact(true);
  };

  const handleBack = () => {
    if (selectedChat) {
      setSelectedChat(null);
    } else {
      const event = new CustomEvent('page-change', { 
        detail: { page: 'profile' } 
      });
      window.dispatchEvent(event);
    }
  };

  const handleUserClick = (searchResult: UserSearchResult) => {
    if (onViewProfile) {
      onViewProfile(searchResult.id);
    }
  };

  // Show chat page if a chat is selected
  if (selectedChat) {
    return (
      <ChatPage
        contactId={selectedChat.app_user_id!}
        contactName={selectedChat.name}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-6">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={handleBack}
            className="text-gray-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Emergency Contacts</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        )}

        {!isAddingContact && (
          <button
            onClick={() => {
              setIsAddingContact(true);
              setEditingContact(null);
              setFormData({ name: '', phone: '', relationship: '', is_primary: false });
            }}
            className="w-full bg-red-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Emergency Contact
          </button>
        )}

        {isAddingContact && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <h2 className="font-semibold text-lg mb-4">
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="Contact Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  required={!editingContact?.is_app_user}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="+1 (123) 456-7890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship
              </label>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <HeartHandshake className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g. Parent, Spouse, Sibling"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_primary"
                checked={formData.is_primary}
                onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="is_primary" className="ml-2 text-sm text-gray-700">
                Set as primary emergency contact
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
              >
                {editingContact ? 'Update Contact' : 'Save Contact'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingContact(false);
                  setEditingContact(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Contacts List */}
        {isLoading ? (
          <div className="text-center py-4">Loading contacts...</div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <UserCircle2 className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.relationship}</p>
                      {contact.is_app_user && contact.email && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Mail className="w-4 h-4" />
                          <span>{contact.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {contact.is_primary && (
                    <span className="bg-red-100 text-red-500 px-2 py-1 rounded-full text-xs">
                      Primary
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {contact.phone && (
                      <>
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{contact.phone}</span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {contact.is_app_user && (
                      <button
                        onClick={() => setSelectedChat(contact)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(contact)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Show Toast */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
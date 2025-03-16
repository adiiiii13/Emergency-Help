import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
}

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching profile:', error)
      return
    }

    if (data) {
      setUserProfile(data)
    }
  }

  useEffect(() => {
    // Check active sessions
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setUserProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Please enter both email and password');
    }

    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please confirm your email address before signing in');
        } else if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please try again.');
        } else {
          throw error;
        }
      }

      if (!user) {
        throw new Error('No user data returned');
      }

      // Set the user state
      setUser(user);
      
      // Fetch the user's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw new Error('Failed to load user profile');
      }

      if (!profile) {
        throw new Error('User profile not found');
      }

      setUserProfile(profile);

      return user;
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Failed to sign in. Please try again.');
    }
  };

  const signUp = async (name: string, email: string, phone: string, password: string) => {
    if (!name || !email || !phone || !password) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Phone validation (basic)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error('Please enter a valid phone number');
    }

    try {
      // Sign up the user with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone
          }
        }
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw new Error(signUpError.message);
      }

      if (!authData.user) {
        throw new Error('Failed to create account. Please try again.');
      }

      // The profile will be created automatically by the database trigger
      // Set the user state immediately
      setUser(authData.user);
      
      // Fetch the newly created profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (!profileError && profile) {
        setUserProfile(profile);
      }

      return authData.user;
    } catch (err) {
      console.error('Signup error:', err);
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Failed to complete registration. Please try again.');
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

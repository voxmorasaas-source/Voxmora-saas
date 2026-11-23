'use client';

import { useEffect, useState, useMemo } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { getGoogleOAuthUrl, signOutAction } from '@/lib/auth/actions';
import type { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  studioName: string;
  initials: string;
  avatarUrl?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createBrowserClient(), []);

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (isMounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.error('[useAuth] Error fetching session:', err);
        if (isMounted) setLoading(false);
      }
    }

    fetchUser();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Derived user profile info with fallbacks for smooth UX
  const profile: UserProfile = useMemo(() => {
    if (!user) {
      return {
        id: '',
        email: '',
        fullName: 'Sophie Carter',
        studioName: 'Studio owner',
        initials: 'SC',
      };
    }

    const meta = user.user_metadata || {};
    const fullName =
      meta.full_name ||
      meta.name ||
      user.email?.split('@')[0] ||
      'Studio Owner';
    const studioName = meta.studio_name || 'Studio owner';

    // Compute initials from full name
    const parts = fullName.trim().split(/\s+/);
    let initials = 'SC';
    if (parts.length >= 2) {
      initials = `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    } else if (parts.length === 1 && parts[0].length > 0) {
      initials = parts[0].slice(0, 2).toUpperCase();
    }

    return {
      id: user.id,
      email: user.email || '',
      fullName,
      studioName,
      initials,
      avatarUrl: meta.avatar_url || meta.picture,
    };
  }, [user]);

  const handleGoogleSignIn = async (next: string = '/') => {
    const res = await getGoogleOAuthUrl(next);
    if (res.url) {
      window.location.href = res.url;
    } else if (res.error) {
      alert(res.error);
    }
  };

  const handleSignOut = async () => {
    await signOutAction();
  };

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    signInWithGoogle: handleGoogleSignIn,
    signOut: handleSignOut,
  };
}


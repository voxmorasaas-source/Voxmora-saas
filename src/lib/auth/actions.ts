'use server';

import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export interface AuthResponse {
  success?: boolean;
  error?: string;
  message?: string;
  needsEmailConfirmation?: boolean;
  url?: string;
}

/**
 * Get current request origin URL dynamically (works locally and in production on Vercel)
 */
async function getOrigin(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get('x-forwarded-host') || headerList.get('host') || 'localhost:3000';
  const proto = headerList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

/**
 * Sign in using Email and Password
 */
export async function signInWithEmail(formData: FormData): Promise<AuthResponse> {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please provide both email and password.' };
  }

  try {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Auth Action] signInWithEmail error:', err);
    return { error: err?.message || 'An unexpected error occurred during sign in.' };
  }
}

/**
 * Register a new user with Email, Password, Full Name, and Studio Name
 */
export async function signUpWithEmail(formData: FormData): Promise<AuthResponse> {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const fullName = (formData.get('fullName') as string)?.trim();
  const studioName = (formData.get('studioName') as string)?.trim();

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  try {
    const origin = await getOrigin();
    const supabase = await createServerClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/`,
        data: {
          full_name: fullName || 'Studio Owner',
          studio_name: studioName || 'My Studio',
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    // If email confirmation is required and session is null
    const needsEmailConfirmation = !data.session;

    return {
      success: true,
      needsEmailConfirmation,
      message: needsEmailConfirmation
        ? 'Account created! Please check your email inbox to confirm your account.'
        : 'Account created successfully!',
    };
  } catch (err: any) {
    console.error('[Auth Action] signUpWithEmail error:', err);
    return { error: err?.message || 'An unexpected error occurred during sign up.' };
  }
}

/**
 * Initiate Google OAuth Sign-In flow
 * Generates the secure Supabase OAuth redirect URL
 */
export async function getGoogleOAuthUrl(nextUrl: string = '/'): Promise<AuthResponse> {
  try {
    const origin = await getOrigin();
    const supabase = await createServerClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (!data?.url) {
      return { error: 'Could not generate Google authentication URL.' };
    }

    return { success: true, url: data.url };
  } catch (err: any) {
    console.error('[Auth Action] getGoogleOAuthUrl error:', err);
    return { error: err?.message || 'Failed to initiate Google sign in.' };
  }
}

/**
 * Sign Out Action: clears Supabase session cookies and redirects to /login
 */
export async function signOutAction() {
  try {
    const supabase = await createServerClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error('[Auth Action] signOut error:', err);
  }

  redirect('/login');
}

/**
 * Send password recovery email
 */
export async function requestPasswordReset(formData: FormData): Promise<AuthResponse> {
  const email = (formData.get('email') as string)?.trim();

  if (!email) {
    return { error: 'Please enter your account email address.' };
  }

  try {
    const origin = await getOrigin();
    const supabase = await createServerClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`,
    });

    if (error) {
      return { error: error.message };
    }

    return {
      success: true,
      message: 'Password reset link sent! Please check your inbox.',
    };
  } catch (err: any) {
    console.error('[Auth Action] requestPasswordReset error:', err);
    return { error: err?.message || 'Could not send reset link.' };
  }
}

/**
 * Update password (used on /reset-password)
 */
export async function updatePasswordAction(formData: FormData): Promise<AuthResponse> {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  try {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { error: error.message };
    }

    return {
      success: true,
      message: 'Your password has been successfully updated.',
    };
  } catch (err: any) {
    console.error('[Auth Action] updatePasswordAction error:', err);
    return { error: err?.message || 'Could not update password.' };
  }
}


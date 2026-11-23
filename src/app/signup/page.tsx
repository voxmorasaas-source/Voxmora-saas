'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import { signUpWithEmail, getGoogleOAuthUrl } from '@/lib/auth/actions';
import { toast } from 'sonner';

export default function SignUpPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [studioName, setStudioName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('studioName', studioName);
    formData.append('email', email);
    formData.append('password', password);

    startTransition(async () => {
      const res = await signUpWithEmail(formData);
      if (res.error) {
        toast.error('Could not create account', {
          description: res.error,
        });
      } else if (res.needsEmailConfirmation) {
        toast.success('Account created!', {
          description: res.message || 'Please check your email inbox to verify your account.',
        });
      } else {
        toast.success('Welcome to Sereva!', {
          description: 'Account created successfully. Redirecting...',
        });
        router.push('/');
        router.refresh();
      }
    });
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const res = await getGoogleOAuthUrl('/');
      if (res.url) {
        window.location.href = res.url;
      } else if (res.error) {
        toast.error('Google registration failed', {
          description: res.error,
        });
        setIsGoogleLoading(false);
      }
    } catch {
      toast.error('Google registration failed', {
        description: 'Could not connect with Google. Please try again.',
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex flex-col justify-center items-center px-4 py-12 antialiased text-[#17213B]">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-8 h-8 rounded-[8px] bg-[#7652D6] flex items-center justify-center shadow-xs">
          <Sparkles className="w-4.5 h-4.5 text-white fill-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-[#17213B]">
          sereva
        </span>
      </div>

      {/* Main Registration Card */}
      <div className="w-full max-w-[440px] bg-white border border-[#E9E5F0] rounded-[16px] p-7 sm:p-9 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-[22px] font-bold text-[#17213B] tracking-tight">
            Create your studio account
          </h1>
          <p className="text-xs sm:text-[13px] text-[#858197] mt-1.5">
            Start managing your bookings, clients, and Mira AI receptionist.
          </p>
        </div>

        {/* 1. Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading || isPending}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white hover:bg-[#FAF8FF] border border-[#EAE8F2] hover:border-[#D8CFEE] text-[#17213B] text-xs sm:text-[13px] font-semibold rounded-xl shadow-2xs transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#7652D6]" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>{isGoogleLoading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#EAE8F2]" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-white px-3 text-[#9995AA] font-semibold">
              or register with email
            </span>
          </div>
        </div>

        {/* 2. Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold text-[#17213B] mb-1.5"
              >
                Your name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sophie Carter"
                className="w-full bg-[#FAF9FD] focus:bg-white border border-[#EAE8F2] focus:border-[#7652D6] focus:ring-2 focus:ring-[#EDE5FF] rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] text-[#17213B] placeholder-[#A59FB3] outline-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="studioName"
                className="block text-xs font-semibold text-[#17213B] mb-1.5"
              >
                Studio name
              </label>
              <input
                id="studioName"
                type="text"
                required
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                placeholder="Sereva Wellness"
                className="w-full bg-[#FAF9FD] focus:bg-white border border-[#EAE8F2] focus:border-[#7652D6] focus:ring-2 focus:ring-[#EDE5FF] rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] text-[#17213B] placeholder-[#A59FB3] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-[#17213B] mb-1.5"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sophie@sereva.com"
              className="w-full bg-[#FAF9FD] focus:bg-white border border-[#EAE8F2] focus:border-[#7652D6] focus:ring-2 focus:ring-[#EDE5FF] rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] text-[#17213B] placeholder-[#A59FB3] outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-[#17213B] mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-[#FAF9FD] focus:bg-white border border-[#EAE8F2] focus:border-[#7652D6] focus:ring-2 focus:ring-[#EDE5FF] rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] text-[#17213B] placeholder-[#A59FB3] outline-none transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858197] hover:text-[#17213B] transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || isGoogleLoading}
            className="w-full py-2.5 px-4 bg-[#7652D6] hover:bg-[#6442C2] text-white text-xs sm:text-[13px] font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed mt-3"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create account</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-[#858197]">
          <span>Already have an account? </span>
          <Link
            href="/login"
            className="font-semibold text-[#7652D6] hover:text-[#5d3dbf] hover:underline transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

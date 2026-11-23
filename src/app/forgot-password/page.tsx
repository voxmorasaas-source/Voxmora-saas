'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { requestPasswordReset } from '@/lib/auth/actions';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);

    startTransition(async () => {
      const res = await requestPasswordReset(formData);
      if (res.error) {
        toast.error('Reset request failed', {
          description: res.error,
        });
      } else {
        toast.success('Reset link sent!', {
          description: res.message || 'Please check your email inbox for instructions.',
        });
      }
    });
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

      <div className="w-full max-w-[420px] bg-white border border-[#E9E5F0] rounded-[16px] p-7 sm:p-9 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-[22px] font-bold text-[#17213B] tracking-tight">
            Reset your password
          </h1>
          <p className="text-xs sm:text-[13px] text-[#858197] mt-1.5">
            Enter your account email and we will send you a recovery link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sophie@sereva.com"
              className="w-full bg-[#FAF9FD] focus:bg-white border border-[#EAE8F2] focus:border-[#7652D6] focus:ring-2 focus:ring-[#EDE5FF] rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] text-[#17213B] placeholder-[#A59FB3] outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 px-4 bg-[#7652D6] hover:bg-[#6442C2] text-white text-xs sm:text-[13px] font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending reset link...</span>
              </>
            ) : (
              <span>Send reset link</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7652D6] hover:text-[#5d3dbf] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

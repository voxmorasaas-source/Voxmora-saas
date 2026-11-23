'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import { updatePasswordAction } from '@/lib/auth/actions';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);

    startTransition(async () => {
      const res = await updatePasswordAction(formData);
      if (res.error) {
        toast.error('Password update failed', {
          description: res.error,
        });
      } else {
        toast.success('Password updated successfully!', {
          description: 'Redirecting to your dashboard...',
        });
        setTimeout(() => {
          router.push('/');
        }, 1200);
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
            Set new password
          </h1>
          <p className="text-xs sm:text-[13px] text-[#858197] mt-1.5">
            Choose a strong password for your Sereva account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-xs font-semibold text-[#17213B] mb-1.5"
            >
              New password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold text-[#17213B] mb-1.5"
            >
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
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
                <span>Updating password...</span>
              </>
            ) : (
              <span>Update password</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-xs font-semibold text-[#7652D6] hover:text-[#5d3dbf] transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

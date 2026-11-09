'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

export function ReceptionistConfigCard() {
  const [name, setName] = useState('Mira');
  const [voice, setVoice] = useState('Warm & professional · Female');
  const [language, setLanguage] = useState('English (US)');
  const [greeting, setGreeting] = useState(
    'Thank you for calling Sereva Spa. This is Mira, your virtual receptionist. How can I help you today?'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white border border-[#E9E7F0] rounded-[10px] p-4 sm:p-6 mb-4 shadow-2xs">
      <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-4">
        Receptionist configuration
      </h2>

      <form onSubmit={handleSave} className="space-y-4">
        {/* 1. AI assistant name */}
        <div>
          <label
            htmlFor="assistant-name"
            className="block text-xs font-medium text-[#17213B] mb-1.5"
          >
            AI assistant name
          </label>
          <input
            id="assistant-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-[#E9E7F0] rounded-lg px-3.5 py-2 text-xs text-[#17213B] focus:border-[#7652D6] focus:outline-none transition-colors"
          />
        </div>

        {/* 2. Voice personality */}
        <div>
          <label
            htmlFor="voice-personality"
            className="block text-xs font-medium text-[#17213B] mb-1.5"
          >
            Voice personality
          </label>
          <input
            id="voice-personality"
            type="text"
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="w-full bg-white border border-[#E9E7F0] rounded-lg px-3.5 py-2 text-xs text-[#17213B] focus:border-[#7652D6] focus:outline-none transition-colors"
          />
        </div>

        {/* 3. Primary language */}
        <div>
          <label
            htmlFor="primary-language"
            className="block text-xs font-medium text-[#17213B] mb-1.5"
          >
            Primary language
          </label>
          <input
            id="primary-language"
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-white border border-[#E9E7F0] rounded-lg px-3.5 py-2 text-xs text-[#17213B] focus:border-[#7652D6] focus:outline-none transition-colors"
          />
        </div>

        {/* 4. Business greeting */}
        <div>
          <label
            htmlFor="business-greeting"
            className="block text-xs font-medium text-[#17213B] mb-1.5"
          >
            Business greeting
          </label>
          <textarea
            id="business-greeting"
            rows={3}
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            className="w-full bg-white border border-[#E9E7F0] rounded-lg px-3.5 py-2.5 text-xs text-[#17213B] leading-relaxed focus:border-[#7652D6] focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* 5. Save Button */}
        <div className="pt-1">
          <button
            type="submit"
            className="px-4 py-2 bg-[#6946C7] hover:bg-[#5b3cb2] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Configuration saved</span>
              </>
            ) : (
              <span>Save configuration</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


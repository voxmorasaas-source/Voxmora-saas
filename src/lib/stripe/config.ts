export interface PlanTierConfig {
  id: string;
  name: string;
  priceMonthlyCents: number;
  stripePriceId: string;
  includedMinutes: number;
  overageRateCentsPerMinute: number;
  maxVoiceAgents: number;
  maxPhoneNumbers: number;
  features: string[];
}

export const PLAN_TIERS: Record<string, PlanTierConfig> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    priceMonthlyCents: 9900,
    stripePriceId: process.env.STRIPE_PRICE_STARTER || '',
    includedMinutes: 100,
    overageRateCentsPerMinute: 25,
    maxVoiceAgents: 1,
    maxPhoneNumbers: 1,
    features: ['1 AI Voice Agent', '100 Receptionist Minutes', 'Standard Appointments', 'Email Support'],
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    priceMonthlyCents: 24900,
    stripePriceId: process.env.STRIPE_PRICE_GROWTH || '',
    includedMinutes: 350,
    overageRateCentsPerMinute: 20,
    maxVoiceAgents: 3,
    maxPhoneNumbers: 2,
    features: ['3 AI Voice Agents', '350 Receptionist Minutes', 'External Calendar Sync (Cal.com/Acuity)', 'Priority Support'],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceMonthlyCents: 49900,
    stripePriceId: process.env.STRIPE_PRICE_PRO || '',
    includedMinutes: 800,
    overageRateCentsPerMinute: 15,
    maxVoiceAgents: 10,
    maxPhoneNumbers: 5,
    features: ['Unlimited Voice Agents', '800 Receptionist Minutes', 'Advanced Analytics', 'Custom Voice Clones', 'Dedicated Support'],
  },
};


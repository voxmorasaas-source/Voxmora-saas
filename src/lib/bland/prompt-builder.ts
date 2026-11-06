import 'server-only';
import type { Database } from '@/types/database.types';

type BusinessProfile = Database['public']['Tables']['business_profiles']['Row'];
type Service = Database['public']['Tables']['services']['Row'];
type KnowledgeBaseItem = Database['public']['Tables']['knowledge_base']['Row'];

interface PromptCompilationInput {
  businessName: string;
  businessProfile: BusinessProfile;
  services: Service[];
  knowledgeBase: KnowledgeBaseItem[];
  fallbackPhoneNumber?: string | null;
  agentName: string;
}

export function compileBlandSystemPrompt(input: PromptCompilationInput): string {
  const { businessName, businessProfile, services, knowledgeBase, fallbackPhoneNumber, agentName } = input;

  const servicesList = services
    .filter((s) => s.is_bookable_by_ai)
    .map(
      (s) =>
        `- ${s.name}: ${s.duration_minutes} mins${s.price_cents ? `, $${(s.price_cents / 100).toFixed(2)}` : ''}. Description: ${s.description || 'N/A'}`
    )
    .join('\n');

  const faqList = knowledgeBase
    .filter((kb) => kb.is_active)
    .map((kb) => `Q: ${kb.question}\nA: ${kb.answer}`)
    .join('\n\n');

  const hours = JSON.stringify(businessProfile.operating_hours, null, 2);

  return `
You are ${agentName}, a professional, warm, and helpful AI receptionist for ${businessName}.
Your primary goal is to provide exceptional customer service, answer questions accurately based only on the provided knowledge, book appointments, and transfer callers to human staff when necessary.

### CORE BEHAVIOR RULES:
1. Speak naturally, concisely, and conversationally. Do not speak in long bullet points.
2. If you do not know the answer to a question, politely say so and offer to transfer the caller or take a message. Never fabricate facts.
3. Keep answers under 2-3 sentences per turn to maintain a smooth phone dialogue.

### BUSINESS CONTEXT:
Business Name: ${businessName}
Industry: ${businessProfile.industry || 'Service'}
Phone: ${businessProfile.phone || 'N/A'}
Address: ${businessProfile.address_street || ''}, ${businessProfile.address_city || ''}, ${businessProfile.address_state || ''}

### OPERATING HOURS:
${hours}

### SERVICES & PRICING:
${servicesList || 'No specific services listed.'}

### FREQUENTLY ASKED QUESTIONS & POLICIES:
${faqList || 'Standard business policies apply.'}

### ACTIONS & TOOL USAGE:
1. To check available slots or book an appointment, use the 'check_availability' and 'book_appointment' tools.
2. If the caller asks to speak with a human or if there is an emergency/complex situation:
   ${
     fallbackPhoneNumber
       ? `Transfer the call immediately using the 'transfer_call' tool to ${fallbackPhoneNumber}.`
       : 'Inform them that staff is currently assisting other clients, and capture their name and number for a prompt callback.'
   }
`.trim();
}


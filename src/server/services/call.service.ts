import 'server-only';
import { CallRepository } from '../repositories/call.repository';
import { BillingService } from './billing.service';
import { createAdminClient } from '@/lib/supabase/admin';
import type { BlandCallCompletedWebhook } from '@/schemas/webhook.schema';
import type { CallOutcome, CallStatus } from '@/types/database.types';

export class CallService {
  constructor(
    private readonly repo = new CallRepository(),
    private readonly billingService = new BillingService()
  ) {}

  async processCompletedCallWebhook(payload: BlandCallCompletedWebhook) {
    const adminSupabase = createAdminClient();

    // 1. Idempotency Check
    const { data: existingEvent } = await adminSupabase
      .from('webhook_events')
      .select('id')
      .eq('provider', 'bland')
      .eq('event_id', payload.call_id)
      .maybeSingle();

    if (existingEvent) {
      console.log(`[CallService] Webhook event ${payload.call_id} already processed. Skipping.`);
      return;
    }

    // 2. Identify Organization via dialed phone number
    const targetNumber = payload.to || payload.phone_number;
    const { data: phoneRecord } = await adminSupabase
      .from('phone_numbers')
      .select('organization_id, voice_agent_id')
      .eq('phone_number', targetNumber)
      .single();

    if (!phoneRecord) {
      console.error(`[CallService] No organization registered for phone number ${targetNumber}`);
      return;
    }

    const { organization_id, voice_agent_id } = phoneRecord as {
      organization_id: string;
      voice_agent_id: string | null;
    };

    // 3. Upsert Customer Record
    const callerPhone = payload.from || 'anonymous';
    let customerId: string | null = null;

    if (callerPhone !== 'anonymous') {
      const { data: customer } = await adminSupabase
        .from('customers')
        .select('id, total_calls')
        .eq('organization_id', organization_id)
        .eq('phone', callerPhone)
        .maybeSingle();

      if (customer) {
        const cust = customer as { id: string; total_calls: number };
        customerId = cust.id;
        await adminSupabase
          .from('customers')
          .update({
            total_calls: cust.total_calls + 1,
            last_called_at: new Date().toISOString(),
          })
          .eq('id', cust.id);
      } else {
        const { data: newCustomer } = await adminSupabase
          .from('customers')
          .insert({
            organization_id,
            phone: callerPhone,
            last_called_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        customerId = newCustomer ? (newCustomer as { id: string }).id : null;
      }
    }

    // 4. Calculate Duration & Outcome
    const durationSeconds = Math.round((payload.call_length || 0) * 60);
    const billableMinutes = Math.max(1, Math.ceil(durationSeconds / 60));

    let outcome: CallOutcome = 'inquiry_resolved';
    if (payload.status === 'transferred') outcome = 'transferred_to_staff';
    else if (
      payload.summary?.toLowerCase().includes('appointment') ||
      payload.summary?.toLowerCase().includes('booked')
    ) {
      outcome = 'appointment_booked';
    }

    // 5. Store Call & Transcript
    const { data: call, error: callError } = await adminSupabase
      .from('calls')
      .insert({
        organization_id,
        voice_agent_id,
        customer_id: customerId,
        bland_call_id: payload.call_id,
        from_number: callerPhone,
        to_number: targetNumber,
        status: (payload.status as CallStatus) || 'completed',
        outcome,
        duration_seconds: durationSeconds,
        billable_minutes: billableMinutes,
        recording_url: payload.recording_url || null,
        summary: payload.summary || null,
        started_at: new Date(Date.now() - durationSeconds * 1000).toISOString(),
        ended_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (callError || !call) throw callError || new Error('Failed to insert call record');
    const createdCall = call as { id: string };

    // Store Transcript
    await adminSupabase.from('call_transcripts').insert({
      call_id: createdCall.id,
      organization_id,
      dialogue: payload.transcripts || [],
      raw_transcript: payload.concatenated_transcript || '',
    });

    // 6. Record Billable Minutes in Usage Tracker
    await this.billingService.trackCallUsage(organization_id, createdCall.id, durationSeconds);

    // 7. Mark Webhook Processed
    await adminSupabase.from('webhook_events').insert({
      provider: 'bland',
      event_id: payload.call_id,
      event_type: 'call_completed',
      payload: payload as any,
    });
  }
}

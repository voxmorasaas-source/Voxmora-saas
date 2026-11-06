import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { stripe } from '@/lib/stripe/client';
import { PLAN_TIERS } from '@/lib/stripe/config';

export class BillingService {
  async trackCallUsage(organizationId: string, callId: string, durationSeconds: number) {
    const supabase = createAdminClient();
    const billableMinutes = Math.max(1, Math.ceil(durationSeconds / 60));

    // 1. Fetch active subscription
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('organization_id', organizationId)
      .single();

    if (!sub || !sub.current_period_start || !sub.current_period_end) {
      return;
    }

    // 2. Sum current billing cycle usage
    const { data: usageAgg } = await supabase
      .from('usage_records')
      .select('minutes_used')
      .eq('organization_id', organizationId)
      .gte('created_at', sub.current_period_start)
      .lte('created_at', sub.current_period_end);

    const totalMinutesSoFar = (usageAgg || []).reduce(
      (acc: number, row: { minutes_used: number }) => acc + row.minutes_used,
      0
    );
    const plan = PLAN_TIERS[sub.plan_tier] || PLAN_TIERS.starter;
    const isOverage = totalMinutesSoFar + billableMinutes > plan.includedMinutes;

    // 3. Record usage
    await supabase.from('usage_records').insert({
      organization_id: organizationId,
      call_id: callId,
      minutes_used: billableMinutes,
      billing_period_start: sub.current_period_start,
      billing_period_end: sub.current_period_end,
      is_overage: isOverage,
    });

    // 4. Report overage to Stripe Metered Billing if applicable
    if (isOverage && sub.stripe_customer_id) {
      try {
        const overageMinutes = Math.min(billableMinutes, totalMinutesSoFar + billableMinutes - plan.includedMinutes);
        if (overageMinutes > 0) {
          await stripe.billing.meterEvents.create({
            event_name: 'receptionist_minutes_overage',
            payload: {
              stripe_customer_id: sub.stripe_customer_id,
              value: overageMinutes.toString(),
            },
          });
        }
      } catch (stripeErr) {
        console.error('[BillingService] Failed to report Stripe meter event', stripeErr);
      }
    }
  }
}

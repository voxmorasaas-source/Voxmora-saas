import { NextRequest, NextResponse } from 'next/server';
import { verifyBlandSignature } from '@/lib/bland/webhooks';
import { CallService } from '@/server/services/call.service';
import { blandCallCompletedWebhookSchema } from '@/schemas/webhook.schema';
import * as Sentry from '@sentry/nextjs';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-bland-signature') || '';

  // 1. Verify HMAC Signature
  const isValid = verifyBlandSignature(rawBody, signature, process.env.BLAND_WEBHOOK_SECRET || '');
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
  }

  try {
    const json = JSON.parse(rawBody);
    const payload = blandCallCompletedWebhookSchema.parse(json);

    // 2. Delegate to CallService (idempotency, transcripts, usage deductions, notifications)
    const callService = new CallService();
    await callService.processCompletedCallWebhook(payload);

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[BLAND_WEBHOOK_ERROR]', error);
    // Return 200 to prevent Bland from infinite retry storms on malformed payloads
    return NextResponse.json({ error: 'Processing error logged' }, { status: 200 });
  }
}


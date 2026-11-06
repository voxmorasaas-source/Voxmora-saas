import 'server-only';
import crypto from 'crypto';

export function verifyBlandSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !secret) {
    // When developing locally without secret, log warning
    if (process.env.NODE_ENV === 'development') {
      console.warn('[BlandWebhook] Signature check bypassed in development');
      return true;
    }
    return false;
  }

  try {
    const computed = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computed));
  } catch (err) {
    console.error('[BlandWebhook] Error verifying webhook signature', err);
    return false;
  }
}


import type { APIRoute } from 'astro';
import { kv } from '@vercel/kv';

const SESSION_PASS_PRODUCT_ID = 'kQcItDBcIQlop-ccKgEESg==';

const PRODUCTS = [
  { permalink: SESSION_PASS_PRODUCT_ID, tier: 'session-pass', label: '$9 Session Pass' },
  { permalink: 'fsupd', tier: 'dispute-kit', label: '$29 Dispute Kit' },
  { permalink: 'M8UBj0ZwYYv4ybnjN4McpQ==', tier: 'complete-access', label: '$49 Complete Access' },
];

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const licenseKey = (body.license_key || '').trim();

    if (!licenseKey) {
      return new Response(JSON.stringify({ success: false, error: 'License key required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Normalize key: uppercase, O→0, I→1, strip whitespace
    const normalizedKey = licenseKey
      .toUpperCase()
      .replace(/O/g, '0')
      .replace(/I/g, '1')
      .replace(/\s/g, '');

    const isRenewal = body.renew === true;

    for (const product of PRODUCTS) {
      const params = new URLSearchParams();
      params.append('product_id', product.permalink);
      params.append('license_key', normalizedKey);
      params.append('increment_uses_count', isRenewal ? 'false' : 'true');

      const res = await fetch('https://api.gumroad.com/v2/licenses/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      const data = await res.json();
      if (data.success) {
        const responseHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        // For session-pass: set license_key cookie + write to KV for server-side expiry validation
        if (product.tier === 'session-pass') {
          // Store license key in HttpOnly cookie so server can look it up later
          responseHeaders['Set-Cookie'] = `license_key=${normalizedKey}; path=/; max-age=604800; SameSite=Strict; HttpOnly`;

          // Write to KV with 7-day TTL for server-side expiry
          try {
            const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
            await kv.set(
              `session:${normalizedKey}`,
              { tier: 'session-pass', expiresAt, activatedAt: Date.now() },
              { px: 7 * 24 * 60 * 60 * 1000 }
            );
          } catch (e) {
            console.warn('[session-pass] KV write failed, cookie-based expiry still active');
          }
        }

        return new Response(JSON.stringify({ success: true, tier: product.tier }), {
          status: 200,
          headers: responseHeaders,
        });
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid license key. Please check and try again.' }),
      { status: 200 }
    );

  } catch (err) {
    console.error('activate error:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Server error. Please try again.' }),
      { status: 500 }
    );
  }
};

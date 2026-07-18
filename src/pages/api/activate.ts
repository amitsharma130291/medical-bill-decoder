import type { APIRoute } from 'astro';

// ---------------------------------------------------------------------------
// SESSION_PASS_PRODUCT_ID: replace with the base64 product ID from Gumroad
// once the operator creates the $9 7-Day Session Pass product.
// Example: 'REPLACE_WITH_GUMROAD_BASE64_PRODUCT_ID'
// ---------------------------------------------------------------------------
const SESSION_PASS_PRODUCT_ID = 'REPLACE_WITH_GUMROAD_BASE64_PRODUCT_ID';

const PRODUCTS = [
  { permalink: 'fsupd', tier: 'dispute-kit', label: '$29 Dispute Kit' },
  { permalink: 'M8UBj0ZwYYv4ybnjN4McpQ==', tier: 'complete-access', label: '$49 Complete Access' },
  { permalink: SESSION_PASS_PRODUCT_ID, tier: 'session-pass', label: '$9 7-Day Session Pass' },
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
        const responsePayload: Record<string, unknown> = { success: true, tier: product.tier };
        // For session-pass: include a 7-day expiry timestamp the client will store as a cookie
        if (product.tier === 'session-pass') {
          responsePayload.sessionExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days in ms
        }
        return new Response(JSON.stringify(responsePayload), { status: 200 });
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

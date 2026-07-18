import type { APIRoute } from 'astro';

const GUMROAD_PRODUCT_ID = process.env.GUMROAD_PRODUCT_PERMALINK || 'fsupd';
const GUMROAD_VERIFY_URL = 'https://api.gumroad.com/v2/licenses/verify';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const licenseKey = (body.license_key || '').trim();

    if (!licenseKey) {
      return new Response(JSON.stringify({ success: false, error: 'License key is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // On silent auto-renewal (renew: true), do NOT increment uses count.
    // On first activation, increment so Gumroad tracks the activation.
    const isRenewal = body.renew === true;

    // Verify with Gumroad (public endpoint, no auth needed)
    const gumroadRes = await fetch(GUMROAD_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        product_id: GUMROAD_PRODUCT_ID,
        license_key: licenseKey,
        increment_uses_count: isRenewal ? 'false' : 'true',
      }),
    });

    const data = await gumroadRes.json();

    if (!data.success) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid license key. Please check and try again.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check for refund or chargeback
    const purchase = data.purchase || {};
    if (purchase.refunded || purchase.chargebacked) {
      return new Response(JSON.stringify({ success: false, error: 'This license key is no longer valid (refunded or charged back).' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // All good — return success
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('activate error:', err);
    return new Response(JSON.stringify({ success: false, error: 'Server error. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

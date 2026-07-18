import type { APIRoute } from 'astro';

const GUMROAD_VERIFY_URL = 'https://api.gumroad.com/v2/licenses/verify';

interface Product {
  permalink: string;
  tier: string;
  label: string;
}

const PRODUCTS: Product[] = [
  {
    permalink: process.env.GUMROAD_PRODUCT_PERMALINK_29 || 'fsupd',
    tier: 'dispute-kit',
    label: '$29 Dispute Kit',
  },
  ...(process.env.GUMROAD_PRODUCT_PERMALINK_49
    ? [{ permalink: process.env.GUMROAD_PRODUCT_PERMALINK_49, tier: 'complete-access', label: '$49 Complete Access' }]
    : []),
];

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

    // Try each configured product until one verifies successfully
    for (const product of PRODUCTS) {
      const gumroadRes = await fetch(GUMROAD_VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          product_id: product.permalink,
          license_key: licenseKey,
          increment_uses_count: isRenewal ? 'false' : 'true',
        }),
      });

      const data = await gumroadRes.json();

      if (!data.success) {
        // This product didn't match — try the next one
        continue;
      }

      // Check for refund or chargeback
      const purchase = data.purchase || {};
      if (purchase.refunded || purchase.chargebacked) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'This license key is no longer valid (refunded or charged back).',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Verified successfully — return tier info
      return new Response(
        JSON.stringify({ success: true, tier: product.tier }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // All products failed
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid license key. Please check and try again.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('activate error:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Server error. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

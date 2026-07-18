import type { APIRoute } from 'astro';

const PRODUCTS = [
  { permalink: 'fsupd', tier: 'dispute-kit', label: '$29 Dispute Kit' },
  { permalink: 'rslhtn', tier: 'complete-access', label: '$49 Complete Access' },
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

    // Normalize: Gumroad keys are hex (0-9, A-F only).
    // The dashboard font makes O and 0, I and 1 indistinguishable.
    const normalizedKey = licenseKey
      .toUpperCase()
      .replace(/O/g, '0')   // letter O → digit zero
      .replace(/I/g, '1')   // letter I → digit one
      .replace(/\s/g, '');  // strip any stray whitespace

    // Try each product in order — first successful verification wins
    for (const product of PRODUCTS) {
      const params = new URLSearchParams();
      params.append('product_permalink', product.permalink);
      params.append('license_key', normalizedKey);
      params.append('increment_uses_count', body.renew ? 'false' : 'true');

      const res = await fetch('https://api.gumroad.com/v2/licenses/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      const data = await res.json();

      if (data.success) {
        return new Response(JSON.stringify({ success: true, tier: product.tier }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

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

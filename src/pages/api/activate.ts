import type { APIRoute } from 'astro';

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

    const params = new URLSearchParams();
    params.append('product_id', 'fsupd');  // hardcoded, no env var
    params.append('license_key', licenseKey);
    params.append('increment_uses_count', body.renew ? 'false' : 'true');

    const res = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await res.json();

    if (data.success) {
      return new Response(JSON.stringify({ success: true, tier: 'dispute-kit' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
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

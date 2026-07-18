import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const text = await request.text();
    const params = new URLSearchParams(text);
    const body: Record<string, string> = {};
    for (const [key, value] of params.entries()) {
      body[key] = value;
    }

    const isSale =
      body['resource_name'] === 'sale' ||
      body['sale_id'] != null ||
      body['license_key'] != null;

    if (isSale) {
      console.log('[gumroad-webhook] sale event:', body);
    } else {
      console.log('[gumroad-webhook] event:', body);
    }
  } catch (err) {
    console.error('[gumroad-webhook] parse error:', err);
  }

  // Always return 200 so Gumroad does not retry
  return new Response('OK', { status: 200 });
};

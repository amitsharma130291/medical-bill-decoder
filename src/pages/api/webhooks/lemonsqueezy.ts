import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  // TODO: Verify X-Signature header with LEMONSQUEEZY_WEBHOOK_SECRET
  // Handle order_created: grant paid access
  const body = await request.json();
  console.log('LemonSqueezy webhook:', body.meta?.event_name);
  return new Response('ok', { status: 200 });
};

import type { APIRoute } from 'astro';

// Paddle webhook stub — verify signature and handle events in production
// See: https://developer.paddle.com/webhooks/overview
export const POST: APIRoute = async ({ request }) => {
  // TODO: Verify Paddle-Signature header with PADDLE_WEBHOOK_SECRET
  // const signature = request.headers.get('Paddle-Signature');
  const body = await request.json();
  console.log('Paddle webhook event:', body.event_type, body.data?.id);
  // Handle: transaction.completed → grant paid access
  // Handle: subscription.activated, subscription.canceled, etc.
  return new Response('ok', { status: 200 });
};

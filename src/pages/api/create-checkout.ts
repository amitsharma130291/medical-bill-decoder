import type { APIRoute } from 'astro';

// Returns the Paddle price ID so the client-side overlay checkout can open it
export const GET: APIRoute = async () => {
  const priceId = import.meta.env.PADDLE_PRICE_ID ?? 'pri_01kxk93szzx7sxvk3emdsw6cqv';
  return new Response(JSON.stringify({ priceId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

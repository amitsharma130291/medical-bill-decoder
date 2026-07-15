import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const GET: APIRoute = async ({ request }) => {
  try {
    const stripeSecretKey = import.meta.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return new Response(JSON.stringify({ error: 'Stripe not configured.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-12-18.acacia' });

    const siteUrl = import.meta.env.SITE_URL || 'https://medical-bill-decoder.vercel.app';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Complete Medical Bill Dispute Kit',
              description: 'Unlimited EOB decodes, dispute letter templates, state-specific guides, and step-by-step appeal instructions.',
            },
            unit_amount: 1900, // $19.00
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#complete-kit`,
      metadata: {
        product: 'complete-dispute-kit',
      },
    });

    if (!session.url) {
      return new Response(JSON.stringify({ error: 'Failed to create checkout session.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return Response.redirect(session.url, 302);
  } catch (err: any) {
    console.error('create-checkout error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

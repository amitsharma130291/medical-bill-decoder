import type { APIRoute } from 'astro';
import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js';

export const POST: APIRoute = async ({ request, redirect }) => {
  lemonSqueezySetup({ apiKey: import.meta.env.LEMONSQUEEZY_API_KEY });

  const checkout = await createCheckout(
    import.meta.env.LEMONSQUEEZY_STORE_ID,
    import.meta.env.LEMONSQUEEZY_VARIANT_ID,
    {
      checkoutOptions: { embed: false, media: true, logo: true },
      checkoutData: { custom: { source: 'medical-bill-decoder' } },
      productOptions: {
        redirectUrl: `${import.meta.env.SITE_URL}/success`,
        receiptButtonText: 'Go to Dashboard',
        receiptThankYouNote: 'Thank you! You now have full access to all dispute tools.',
      },
    }
  );

  const url = checkout.data?.data?.attributes?.url;
  if (!url) {
    return new Response(JSON.stringify({ error: 'Failed to create checkout' }), { status: 500 });
  }
  return redirect(url, 302);
};

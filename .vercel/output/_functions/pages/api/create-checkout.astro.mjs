import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request, redirect }) => {
  lemonSqueezySetup({ apiKey: undefined                                     });
  const checkout = await createCheckout(
    undefined                                     ,
    undefined                                       ,
    {
      checkoutOptions: { embed: false, media: true, logo: true },
      checkoutData: { custom: { source: "medical-bill-decoder" } },
      productOptions: {
        redirectUrl: `${undefined                        }/success`,
        receiptButtonText: "Go to Dashboard",
        receiptThankYouNote: "Thank you! You now have full access to all dispute tools."
      }
    }
  );
  const url = checkout.data?.data?.attributes?.url;
  if (!url) {
    return new Response(JSON.stringify({ error: "Failed to create checkout" }), { status: 500 });
  }
  return redirect(url, 302);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

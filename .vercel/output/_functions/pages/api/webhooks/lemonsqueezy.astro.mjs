export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const body = await request.json();
  console.log("LemonSqueezy webhook:", body.meta?.event_name);
  return new Response("ok", { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

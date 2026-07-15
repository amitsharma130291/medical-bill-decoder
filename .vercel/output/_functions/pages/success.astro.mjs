/* empty css                                          */
import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_C3ATigc7.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_dExX_k1h.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://medical-bill-decoder.vercel.app");
const $$Success = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Success;
  const expires = /* @__PURE__ */ new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  Astro2.cookies.set("paid", "true", {
    expires,
    path: "/",
    sameSite: "lax",
    httpOnly: false
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Payment Successful \u2014 Complete Dispute Kit Activated", "description": "Thank you! Your Complete Medical Bill Dispute Kit is now active." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="min-h-[70vh] flex items-center justify-center px-4 py-20"> <div class="max-w-2xl mx-auto text-center"> <!-- Success icon --> <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8" style="background-color: #DCFCE7;"> <svg class="w-10 h-10" fill="none" stroke="#16A34A" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h1 class="font-bold text-[#1A2332] mb-4" style="font-size: 36px;">Payment Successful!</h1> <p class="text-[#64748B] mb-10" style="font-size: 18px; line-height: 1.6;">Your Complete Medical Bill Dispute Kit is now active. You have unlimited access to all tools and features.</p> <div class="rounded-2xl p-6 mb-10 text-left" style="background-color: #F0FDF4; border: 1px solid #86EFAC;"> <h2 class="font-semibold text-[#14532D] mb-5" style="font-size: 18px;">What you now have access to:</h2> <ul class="space-y-4"> ${[
    "Unlimited EOB decodes with full dispute guidance",
    "Unlimited dispute letter generation",
    "Step-by-step appeal instructions",
    "Access valid for 1 year on this browser"
  ].map((item) => renderTemplate`<li class="flex items-center gap-3 text-[#15803D]"> <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="#16A34A" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> <span style="font-size: 15px;">${item}</span> </li>`)} </ul> </div> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="/eob-decoder" class="text-white font-bold px-8 py-4 rounded-xl transition-colors" style="background-color: #0F7B8C; font-size: 16px;" onmouseover="this.style.backgroundColor='#0a6475'" onmouseout="this.style.backgroundColor='#0F7B8C'">
Decode My EOB Now →
</a> <a href="/dispute-letter" class="font-bold px-8 py-4 rounded-xl transition-colors" style="border: 2px solid #2D4A7A; color: #2D4A7A; font-size: 16px; background: transparent;" onmouseover="this.style.backgroundColor='#EFF9FA'" onmouseout="this.style.backgroundColor='transparent'">
Generate Dispute Letter
</a> </div> <p class="mt-8 text-sm" style="color: #64748B;">
Your access is stored in your browser. If you clear cookies, use the link in your confirmation email to restore access.
</p> </div> </section> ` })}`;
}, "/home/node/.openclaw/workspaces/mbd-coder/jobs/2026/Jul/medical-bill-decoder-astro/repo/src/pages/success.astro", void 0);

const $$file = "/home/node/.openclaw/workspaces/mbd-coder/jobs/2026/Jul/medical-bill-decoder-astro/repo/src/pages/success.astro";
const $$url = "/success";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Success,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

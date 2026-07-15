import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Bjf2X85s.mjs';
import { manifest } from './manifest_Dw8-ZJPd.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/create-checkout.astro.mjs');
const _page2 = () => import('./pages/api/decode-eob.astro.mjs');
const _page3 = () => import('./pages/api/webhooks/lemonsqueezy.astro.mjs');
const _page4 = () => import('./pages/billing-errors.astro.mjs');
const _page5 = () => import('./pages/dispute-letter.astro.mjs');
const _page6 = () => import('./pages/eob-decoder.astro.mjs');
const _page7 = () => import('./pages/glossary/_term_.astro.mjs');
const _page8 = () => import('./pages/guides/_slug_.astro.mjs');
const _page9 = () => import('./pages/states/_state_.astro.mjs');
const _page10 = () => import('./pages/success.astro.mjs');
const _page11 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/create-checkout.ts", _page1],
    ["src/pages/api/decode-eob.ts", _page2],
    ["src/pages/api/webhooks/lemonsqueezy.ts", _page3],
    ["src/pages/billing-errors.astro", _page4],
    ["src/pages/dispute-letter.astro", _page5],
    ["src/pages/eob-decoder.astro", _page6],
    ["src/pages/glossary/[term].astro", _page7],
    ["src/pages/guides/[slug].astro", _page8],
    ["src/pages/states/[state].astro", _page9],
    ["src/pages/success.astro", _page10],
    ["src/pages/index.astro", _page11]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "3a134de2-60d9-4fda-8ca2-fedc87e3571e",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };

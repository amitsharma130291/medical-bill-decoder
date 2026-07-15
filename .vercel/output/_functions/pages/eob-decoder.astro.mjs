/* empty css                                          */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from '../chunks/astro/server_C3ATigc7.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_dExX_k1h.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
export { renderers } from '../renderers.mjs';

const TEAL = "#0F7B8C";
const BLUE = "#2D4A7A";
const AMBER = "#E8A020";
const INK = "#1A2332";
const MUTED = "#64748B";
const SURFACE = "#F7F8FA";
const SUCCESS = "#16A34A";
const ERROR_RED = "#DC2626";
const BORDER = "#E2E8F0";
function getTodayKey() {
  const d = /* @__PURE__ */ new Date();
  return `eob_count_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function getRateCount() {
  if (typeof document === "undefined") return 0;
  const key = getTodayKey();
  const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
  return match ? parseInt(match[1], 10) : 0;
}
function incrementRateCount() {
  const key = getTodayKey();
  const current = getRateCount();
  const tomorrow = /* @__PURE__ */ new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  document.cookie = `${key}=${current + 1}; expires=${tomorrow.toUTCString()}; path=/`;
}
function isPaid() {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("paid=true");
}
function EobDecoder() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const FREE_LIMIT = 3;
  const count = getRateCount();
  const paid = isPaid();
  const blocked = !paid && count >= FREE_LIMIT;
  async function handleDecode() {
    if (!text.trim()) {
      setError("Please paste your EOB text first.");
      return;
    }
    if (blocked) {
      setError(`You've used all ${FREE_LIMIT} free decodes for today. Upgrade to the Complete Dispute Kit for unlimited access.`);
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/decode-eob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eobText: text, paid })
      });
      if (!res.ok) {
        const data2 = await res.json().catch(() => ({}));
        setError(res.status === 429 ? "Daily limit reached. Upgrade to the Complete Dispute Kit for unlimited access." : data2.error || "Something went wrong. Please try again.");
        return;
      }
      const data = await res.json();
      setResult(data.result);
      incrementRateCount();
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
    !paid && /* @__PURE__ */ jsxs("div", { style: { background: "#EFF9FA", border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "16px", display: "flex", alignItems: "flex-start", gap: "12px" }, children: [
      /* @__PURE__ */ jsx("svg", { style: { width: 20, height: 20, color: TEAL, flexShrink: 0, marginTop: 2 }, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
      /* @__PURE__ */ jsxs("p", { style: { fontSize: 14, color: INK, margin: 0 }, children: [
        /* @__PURE__ */ jsx("strong", { children: "Free tier:" }),
        " ",
        Math.max(0, FREE_LIMIT - count),
        " of ",
        FREE_LIMIT,
        " daily decodes remaining.",
        " ",
        /* @__PURE__ */ jsx("a", { href: "/#complete-kit", style: { color: TEAL, textDecoration: "underline", fontWeight: 500 }, children: "Upgrade for unlimited access →" })
      ] })
    ] }),
    paid && /* @__PURE__ */ jsxs("div", { style: { background: "#DCFCE7", border: "1px solid #86EFAC", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "10px" }, children: [
      /* @__PURE__ */ jsx("span", { style: { color: SUCCESS, fontSize: 18 }, children: "✓" }),
      /* @__PURE__ */ jsxs("p", { style: { fontSize: 14, color: "#14532D", margin: 0 }, children: [
        /* @__PURE__ */ jsx("strong", { children: "Complete Dispute Kit active" }),
        " — unlimited decodes + full dispute guidance."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: 14, fontWeight: 600, color: INK, marginBottom: 8, fontFamily: "DM Sans, sans-serif" }, children: "Paste your EOB text here" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          style: {
            width: "100%",
            height: 192,
            padding: "12px 16px",
            border: `1px solid ${BORDER}`,
            borderRadius: "12px",
            fontSize: 14,
            color: INK,
            background: blocked ? SURFACE : "#fff",
            fontFamily: "DM Sans, sans-serif",
            lineHeight: 1.6,
            resize: "none",
            outline: "none",
            boxSizing: "border-box"
          },
          placeholder: "Paste the text from your Explanation of Benefits document here. Include the summary table, claim details, and any codes you see...",
          value: text,
          onChange: (e) => setText(e.target.value),
          disabled: loading || blocked,
          onFocus: (e) => e.target.style.borderColor = TEAL,
          onBlur: (e) => e.target.style.borderColor = BORDER
        }
      ),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 12, color: MUTED, marginTop: 4, fontFamily: "DM Sans, sans-serif" }, children: "Your data is never stored. Each request is processed privately." })
    ] }),
    error && /* @__PURE__ */ jsxs("div", { style: { background: "#FEF2F2", border: `1px solid #FECACA`, borderRadius: "12px", padding: "16px" }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontSize: 14, color: ERROR_RED, margin: 0 }, children: error }),
      blocked && /* @__PURE__ */ jsx("div", { style: { marginTop: 12 }, children: /* @__PURE__ */ jsx("a", { href: "/api/create-checkout", style: {
        display: "inline-block",
        background: AMBER,
        color: INK,
        fontWeight: 700,
        padding: "10px 20px",
        borderRadius: "10px",
        fontSize: 14,
        textDecoration: "none"
      }, children: "Get Complete Dispute Kit — $19" }) })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleDecode,
        disabled: loading || blocked || !text.trim(),
        style: {
          width: "100%",
          background: blocked ? MUTED : BLUE,
          color: "#fff",
          fontWeight: 700,
          padding: "16px",
          borderRadius: "12px",
          border: "none",
          cursor: loading || blocked || !text.trim() ? "not-allowed" : "pointer",
          fontSize: 16,
          fontFamily: "DM Sans, sans-serif",
          transition: "background 0.2s",
          opacity: !text.trim() && !blocked ? 0.6 : 1
        },
        onMouseOver: (e) => {
          if (!loading && !blocked && text.trim()) e.currentTarget.style.background = "#243D66";
        },
        onMouseOut: (e) => {
          if (!blocked) e.currentTarget.style.background = BLUE;
        },
        children: loading ? /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }, children: [
          /* @__PURE__ */ jsxs("svg", { style: { width: 20, height: 20, animation: "spin 1s linear infinite" }, fill: "none", viewBox: "0 0 24 24", children: [
            /* @__PURE__ */ jsx("circle", { style: { opacity: 0.25 }, cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
            /* @__PURE__ */ jsx("path", { style: { opacity: 0.75 }, fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
          ] }),
          "Decoding your EOB..."
        ] }) : blocked ? "Daily Limit Reached — Upgrade to Continue" : "Decode My EOB"
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }` }),
    result && /* @__PURE__ */ jsxs("div", { style: { background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "28px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }, children: [
      /* @__PURE__ */ jsxs("h2", { style: { fontWeight: 700, color: INK, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, fontSize: 18, fontFamily: "DM Sans, sans-serif" }, children: [
        /* @__PURE__ */ jsx("svg", { style: { width: 20, height: 20, color: SUCCESS }, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
        "Your EOB Explained"
      ] }),
      /* @__PURE__ */ jsx("div", { style: { fontSize: 15, color: INK, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "DM Sans, sans-serif" }, children: result }),
      !paid && /* @__PURE__ */ jsxs("div", { style: { marginTop: 24, padding: "20px", background: "#EFF9FA", border: `1px solid ${BORDER}`, borderRadius: "12px" }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontSize: 14, fontWeight: 600, color: INK, margin: "0 0 6px" }, children: "Want full dispute guidance?" }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: MUTED, margin: "0 0 14px", lineHeight: 1.5 }, children: "The Complete Dispute Kit includes step-by-step dispute instructions, state-specific guides, and unlimited decodes." }),
        /* @__PURE__ */ jsx("a", { href: "/api/create-checkout", style: {
          display: "inline-block",
          background: AMBER,
          color: INK,
          fontWeight: 700,
          padding: "10px 20px",
          borderRadius: "10px",
          fontSize: 14,
          textDecoration: "none"
        }, children: "Upgrade for $19 →" })
      ] })
    ] })
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$EobDecoder = createComponent(($$result, $$props, $$slots) => {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Decode Your Explanation of Benefits (EOB)",
    "description": "Use AI to decode confusing medical EOB documents into plain English.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Copy your EOB text",
        "text": "Open your Explanation of Benefits from your insurance company and copy the relevant sections."
      },
      {
        "@type": "HowToStep",
        "name": "Paste into the decoder",
        "text": "Paste the EOB text into the decoder field below."
      },
      {
        "@type": "HowToStep",
        "name": "Get your plain-English explanation",
        "text": "Click 'Decode My EOB' to receive a clear explanation of what you owe and why."
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "EOB Decoder \u2014 Decode Your Explanation of Benefits", "description": "Paste your EOB text and get a plain-English explanation of what you actually owe. Free AI-powered medical bill decoder \u2014 3 free uses per day." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script>  ", '<section style="background: linear-gradient(135deg, #0F7B8C 0%, #2D4A7A 100%);" class="text-white py-14 px-4"> <div class="max-w-3xl mx-auto text-center"> <h1 class="font-bold mb-4" style="font-size: 36px;">EOB Decoder</h1> <p class="text-blue-100" style="font-size: 18px; line-height: 1.6;">Paste your Explanation of Benefits and get a plain-English breakdown of what you owe and why. Powered by GPT-4o.</p> </div> </section>  <section class="py-12 px-4"> <div class="max-w-3xl mx-auto"> ', ' </div> </section>  <section class="py-12 px-4 bg-white border-t border-[#E2E8F0]"> <div class="max-w-3xl mx-auto"> <h2 class="font-semibold text-center mb-10 text-[#1A2332]" style="font-size: 28px;">How It Works</h2> <div class="grid grid-cols-1 sm:grid-cols-3 gap-8"> <div class="text-center"> <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style="background-color: #D0EFF3;"> <span class="text-[#0F7B8C] font-bold text-lg">1</span> </div> <h3 class="font-semibold mb-2 text-[#1A2332]" style="font-size: 16px;">Copy your EOB</h3> <p class="text-[#64748B] text-sm leading-relaxed">Open your EOB from your insurance portal or paper mail and copy the text.</p> </div> <div class="text-center"> <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style="background-color: #D0EFF3;"> <span class="text-[#0F7B8C] font-bold text-lg">2</span> </div> <h3 class="font-semibold mb-2 text-[#1A2332]" style="font-size: 16px;">Paste and decode</h3> <p class="text-[#64748B] text-sm leading-relaxed">Paste the text below and click "Decode My EOB."</p> </div> <div class="text-center"> <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style="background-color: #D0EFF3;"> <span class="text-[#0F7B8C] font-bold text-lg">3</span> </div> <h3 class="font-semibold mb-2 text-[#1A2332]" style="font-size: 16px;">Understand your bill</h3> <p class="text-[#64748B] text-sm leading-relaxed">Get a clear explanation and next steps if you spot potential errors.</p> </div> </div> </div> </section> '])), unescapeHTML(JSON.stringify(howToSchema)), maybeRenderHead(), renderComponent($$result2, "EobDecoder", EobDecoder, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/node/.openclaw/workspaces/mbd-coder/jobs/2026/Jul/medical-bill-decoder-astro/repo/src/components/EobDecoder.tsx", "client:component-export": "default" })) })}`;
}, "/home/node/.openclaw/workspaces/mbd-coder/jobs/2026/Jul/medical-bill-decoder-astro/repo/src/pages/eob-decoder.astro", void 0);

const $$file = "/home/node/.openclaw/workspaces/mbd-coder/jobs/2026/Jul/medical-bill-decoder-astro/repo/src/pages/eob-decoder.astro";
const $$url = "/eob-decoder";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$EobDecoder,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

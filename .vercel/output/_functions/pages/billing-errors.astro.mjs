/* empty css                                          */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from '../chunks/astro/server_C3ATigc7.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_QjW8KUyF.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
export { renderers } from '../renderers.mjs';

const TEAL = "#0F7B8C";
const BLUE = "#2D4A7A";
const AMBER = "#E8A020";
const INK = "#1A2332";
const MUTED = "#64748B";
const SUCCESS = "#16A34A";
const ERROR_RED = "#DC2626";
const BORDER = "#E2E8F0";
const BILLING_ERRORS = [
  { id: 1, title: "Duplicate Charges", description: "The same service or procedure is billed more than once on the same date.", howToCheck: "Look for identical line items with the same CPT code and date of service." },
  { id: 2, title: "Upcoding", description: "A provider bills for a more expensive service than what was actually performed.", howToCheck: "Compare the CPT codes on your bill against the actual services you received." },
  { id: 3, title: "Unbundling", description: "Procedures that should be billed together as a package are split into separate charges.", howToCheck: "Look for multiple procedure codes that typically go together (e.g., surgical components)." },
  { id: 4, title: "Incorrect Patient Information", description: "Your name, date of birth, or insurance ID is wrong, causing claim errors.", howToCheck: "Verify your personal information is correct on every page of your bill." },
  { id: 5, title: "Services Not Rendered", description: "You are charged for a service, supply, or procedure you never received.", howToCheck: "Go line by line and cross-reference with your actual appointment notes or discharge paperwork." },
  { id: 6, title: "Incorrect Diagnosis Code (ICD)", description: "The wrong diagnosis code is used, leading to denied claims or incorrect billing.", howToCheck: "Ask for your ICD codes and verify they match your actual diagnosis." },
  { id: 7, title: "Inpatient vs. Outpatient Status Error", description: "Facility fees charged as inpatient when you were actually an outpatient or under observation.", howToCheck: "Confirm your admission status. Observation status vs. inpatient has different billing rules." },
  { id: 8, title: "Overpriced Medical Supplies", description: "Basic supplies like gloves, bandages, or saline are billed at inflated prices.", howToCheck: "Look for supply line items and compare against typical market prices." },
  { id: 9, title: "Incorrect Insurance Coordination", description: "If you have two insurance plans, the primary/secondary coordination may be applied incorrectly.", howToCheck: "Confirm with both insurers that the coordination of benefits was applied correctly." },
  { id: 10, title: "Balance Billing by In-Network Provider", description: "An in-network provider bills you for the difference between their charge and what insurance paid.", howToCheck: "Confirm the provider was truly in-network on your date of service and review your EOB." },
  { id: 11, title: "Phantom Medication Charges", description: "Medications are listed that you never received or that were charged at the wrong dose.", howToCheck: "Review all medication line items and match against any medications actually administered." },
  { id: 12, title: "Incorrect Number of Units", description: "A procedure is billed for more units than were actually performed.", howToCheck: "Check the quantity column next to each CPT code and verify it matches reality." },
  { id: 13, title: "Wrong Procedure Code (Typo)", description: "A typographical error in the CPT code leads to billing for the wrong service entirely.", howToCheck: "Look up any unfamiliar CPT codes online and confirm they match the care you received." },
  { id: 14, title: "Cancelled Services Still Billed", description: "A procedure was cancelled or not performed but still appears on the bill.", howToCheck: "Cross-reference with your appointment history and any cancellation confirmations." },
  { id: 15, title: "No Itemized Bill Provided", description: "You received only a summary bill. You have the right to an itemized bill.", howToCheck: "If you only received a lump sum, call the billing department and request a complete itemized bill." }
];
function ErrorChecklist() {
  const [checked, setChecked] = useState(/* @__PURE__ */ new Set());
  const [found, setFound] = useState(/* @__PURE__ */ new Set());
  function toggle(id) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setFound((f) => {
          const nf = new Set(f);
          nf.delete(id);
          return nf;
        });
      } else {
        next.add(id);
      }
      return next;
    });
  }
  function markFound(id) {
    setFound((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setChecked((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }
  const checkedCount = checked.size;
  const foundCount = found.size;
  const pct = Math.round(checkedCount / BILLING_ERRORS.length * 100);
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }, children: [
        /* @__PURE__ */ jsxs("span", { style: { fontSize: 14, fontWeight: 600, color: INK, fontFamily: "DM Sans, sans-serif" }, children: [
          "Progress: ",
          checkedCount,
          " / ",
          BILLING_ERRORS.length,
          " checked"
        ] }),
        foundCount > 0 && /* @__PURE__ */ jsxs("span", { style: {
          background: ERROR_RED,
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          padding: "4px 12px",
          borderRadius: "999px",
          fontFamily: "DM Sans, sans-serif"
        }, children: [
          foundCount,
          " error",
          foundCount !== 1 ? "s" : "",
          " found!"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { width: "100%", background: "#E2E8F0", borderRadius: "999px", height: 8 }, children: /* @__PURE__ */ jsx("div", { style: {
        width: `${pct}%`,
        background: checkedCount === BILLING_ERRORS.length ? SUCCESS : TEAL,
        height: 8,
        borderRadius: "999px",
        transition: "width 0.3s ease"
      } }) }),
      checkedCount === BILLING_ERRORS.length && foundCount === 0 && /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: SUCCESS, marginTop: 10, fontWeight: 500, fontFamily: "DM Sans, sans-serif" }, children: "Great news — no obvious errors found! Always request an itemized bill to be fully sure." })
    ] }),
    /* @__PURE__ */ jsxs("p", { style: { fontSize: 14, color: MUTED, margin: 0, lineHeight: 1.6 }, children: [
      "Check each item against your bill. Mark any errors found, then",
      " ",
      /* @__PURE__ */ jsx("a", { href: "/dispute-letter", style: { color: TEAL, textDecoration: "underline", fontWeight: 500 }, children: "generate a dispute letter" }),
      " to contest them."
    ] }),
    /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: BILLING_ERRORS.map((item) => {
      const isChecked = checked.has(item.id);
      const isFound = found.has(item.id);
      return /* @__PURE__ */ jsx("div", { style: {
        background: isFound ? "#FEF2F2" : isChecked ? "#F0FDF4" : "#fff",
        border: `1px solid ${isFound ? "#FECACA" : isChecked ? "#86EFAC" : BORDER}`,
        borderRadius: "12px",
        padding: "18px",
        transition: "all 0.15s ease"
      }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: "14px" }, children: [
        /* @__PURE__ */ jsx("button", { onClick: () => toggle(item.id), style: {
          flexShrink: 0,
          width: 24,
          height: 24,
          borderRadius: "6px",
          border: `2px solid ${isChecked ? SUCCESS : BORDER}`,
          background: isChecked ? SUCCESS : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          marginTop: 2,
          transition: "all 0.15s"
        }, children: isChecked && /* @__PURE__ */ jsx("svg", { style: { width: 14, height: 14, color: "#fff" }, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }) }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }, children: [
            /* @__PURE__ */ jsxs("span", { style: { fontSize: 12, color: MUTED, fontFamily: "JetBrains Mono, monospace" }, children: [
              "#",
              item.id
            ] }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: 16, fontWeight: 600, color: INK, fontFamily: "DM Sans, sans-serif" }, children: item.title }),
            isFound && /* @__PURE__ */ jsx("span", { style: {
              background: ERROR_RED,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "999px",
              fontFamily: "DM Sans, sans-serif"
            }, children: "ERROR FOUND" })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: 14, color: MUTED, margin: "0 0 6px", lineHeight: 1.5 }, children: item.description }),
          /* @__PURE__ */ jsxs("p", { style: { fontSize: 12, color: MUTED, margin: 0, fontStyle: "italic", lineHeight: 1.5 }, children: [
            /* @__PURE__ */ jsx("strong", { style: { fontStyle: "normal" }, children: "How to check:" }),
            " ",
            item.howToCheck
          ] }),
          isChecked && /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsx("button", { onClick: () => markFound(item.id), style: {
              background: isFound ? ERROR_RED : "#FEE2E2",
              color: isFound ? "#fff" : ERROR_RED,
              fontWeight: 600,
              padding: "7px 14px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "DM Sans, sans-serif",
              transition: "all 0.15s"
            }, children: isFound ? "✓ Error Marked" : "Mark as Error Found" }),
            isFound && /* @__PURE__ */ jsx("a", { href: "/dispute-letter", style: {
              display: "inline-block",
              background: AMBER,
              color: INK,
              fontWeight: 700,
              padding: "7px 14px",
              borderRadius: "8px",
              fontSize: 13,
              textDecoration: "none",
              fontFamily: "DM Sans, sans-serif"
            }, children: "Dispute This →" })
          ] })
        ] })
      ] }) }, item.id);
    }) }),
    foundCount > 0 && /* @__PURE__ */ jsxs("div", { style: {
      background: `linear-gradient(135deg, ${BLUE} 0%, #1A2D4A 100%)`,
      borderRadius: "16px",
      padding: "28px",
      textAlign: "center"
    }, children: [
      /* @__PURE__ */ jsxs("h3", { style: { color: "#fff", fontWeight: 700, fontSize: 20, margin: "0 0 8px", fontFamily: "DM Sans, sans-serif" }, children: [
        "You found ",
        foundCount,
        " potential error",
        foundCount !== 1 ? "s" : "",
        "!"
      ] }),
      /* @__PURE__ */ jsx("p", { style: { color: "#CBD5E1", fontSize: 14, margin: "0 0 20px", lineHeight: 1.5 }, children: "Generate a professional dispute letter to contest these charges." }),
      /* @__PURE__ */ jsx("a", { href: "/dispute-letter", style: {
        display: "inline-block",
        background: AMBER,
        color: INK,
        fontWeight: 700,
        padding: "13px 28px",
        borderRadius: "12px",
        fontSize: 15,
        textDecoration: "none",
        fontFamily: "DM Sans, sans-serif"
      }, children: "Generate Dispute Letter →" })
    ] })
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$BillingErrors = createComponent(($$result, $$props, $$slots) => {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Check for Medical Billing Errors",
    "description": "Use our 15-point checklist to identify common medical billing errors in your bill.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Get your itemized bill",
        "text": "Request a complete itemized bill from your provider if you don't already have one."
      },
      {
        "@type": "HowToStep",
        "name": "Go through the checklist",
        "text": "Check each of the 15 common billing errors against your bill."
      },
      {
        "@type": "HowToStep",
        "name": "Take action on errors found",
        "text": "For each error found, use our Dispute Letter Generator to contest the charge."
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Medical Billing Error Checklist \u2014 15 Common Errors", "description": "Check your medical bill against 15 common billing errors. Find overcharges in minutes with this free interactive checklist." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script>  ", '<section style="background: linear-gradient(135deg, #0F7B8C 0%, #2D4A7A 100%);" class="text-white py-14 px-4"> <div class="max-w-3xl mx-auto text-center"> <h1 class="font-bold mb-4" style="font-size: 36px;">Billing Error Checklist</h1> <p class="text-blue-100" style="font-size: 18px; line-height: 1.6;">80% of medical bills contain errors. Check yours against the 15 most common billing mistakes. Completely free.</p> </div> </section>  <section class="py-12 px-4"> <div class="max-w-2xl mx-auto"> ', ` </div> </section>  <section class="py-12 px-4 bg-white border-t border-[#E2E8F0]"> <div class="max-w-3xl mx-auto text-center"> <h2 class="font-semibold mb-4 text-[#1A2332]" style="font-size: 28px;">Found an Error? Generate a Dispute Letter</h2> <p class="text-[#64748B] mb-8" style="font-size: 16px; line-height: 1.6;">Our dispute letter generator creates a professional letter you can send to contest billing errors.</p> <a href="/dispute-letter" class="inline-block text-white font-bold px-8 py-4 rounded-xl transition-colors" style="background-color: #E8A020; color: #1A2332;" onmouseover="this.style.backgroundColor='#D4901A'" onmouseout="this.style.backgroundColor='#E8A020'">
Generate Dispute Letter \u2192
</a> </div> </section> `])), unescapeHTML(JSON.stringify(howToSchema)), maybeRenderHead(), renderComponent($$result2, "ErrorChecklist", ErrorChecklist, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/node/.openclaw/workspaces/mbd-coder/jobs/2026/Jul/medical-bill-decoder-astro/repo/src/components/ErrorChecklist.tsx", "client:component-export": "default" })) })}`;
}, "/home/node/.openclaw/workspaces/mbd-coder/jobs/2026/Jul/medical-bill-decoder-astro/repo/src/pages/billing-errors.astro", void 0);

const $$file = "/home/node/.openclaw/workspaces/mbd-coder/jobs/2026/Jul/medical-bill-decoder-astro/repo/src/pages/billing-errors.astro";
const $$url = "/billing-errors";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$BillingErrors,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

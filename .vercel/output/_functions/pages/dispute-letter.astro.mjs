/* empty css                                          */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from '../chunks/astro/server_C3ATigc7.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_QjW8KUyF.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
export { renderers } from '../renderers.mjs';

const TEAL = "#0F7B8C";
const BLUE = "#2D4A7A";
const AMBER = "#E8A020";
const INK = "#1A2332";
const MUTED = "#64748B";
const SURFACE = "#F7F8FA";
const ERROR_RED = "#DC2626";
const BORDER = "#E2E8F0";
const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming"
];
function isPaid() {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("paid=true");
}
function hasUsedFreeLetter() {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem("dispute_letter_used") === "true";
}
function markLetterUsed() {
  if (typeof sessionStorage !== "undefined") sessionStorage.setItem("dispute_letter_used", "true");
}
function generateLetter(f) {
  const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return `${f.patientName}
[Your Address]
[City, State ZIP]
[Your Phone Number]
[Your Email Address]

${today}

Patient Services / Billing Department
${f.providerName}
[Provider Address]
[City, State ZIP]

Re: Formal Dispute of Medical Bill
Patient Name: ${f.patientName}
Bill Date: ${f.billDate}
State: ${f.state}

To Whom It May Concern:

I am writing to formally dispute charges on a medical bill dated ${f.billDate}, from ${f.providerName}.

Reason for Dispute:
${f.disputeReason}

Under applicable state and federal law, I have the right to dispute this bill and request a full review of all charges. I respectfully request the following:

1. A complete, itemized bill listing every service, procedure, supply, and corresponding billing code (CPT/ICD code) with the associated charge.

2. A written explanation of any charge I am disputing, including the medical necessity and documentation supporting each line item.

3. A correction and reprocessing of any identified billing errors, including erroneous codes, duplicate charges, or services not rendered.

4. Suspension of any collection activity and reporting to credit bureaus during the dispute review period.

I expect a written response within 30 days of receiving this letter. If I do not receive a satisfactory response, I reserve the right to file a complaint with the ${f.state} Department of Insurance, the relevant state Attorney General's office, and/or the Centers for Medicare & Medicaid Services (CMS), as applicable.

Please send all correspondence to the address listed above.

Sincerely,

${f.patientName}
[Signature]

Enclosures:
- Copy of disputed bill dated ${f.billDate}
- [Any relevant insurance EOB or prior correspondence]

Note: Send via Certified Mail with Return Receipt Requested. Keep a copy of this letter and all enclosures for your records.`;
}
const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  border: `1px solid ${BORDER}`,
  borderRadius: "10px",
  fontSize: 14,
  color: INK,
  background: "#fff",
  fontFamily: "DM Sans, sans-serif",
  outline: "none",
  boxSizing: "border-box"
};
function DisputeLetter() {
  const [fields, setFields] = useState({ patientName: "", providerName: "", billDate: "", disputeReason: "", state: "" });
  const [letter, setLetter] = useState("");
  const [error, setError] = useState("");
  const paid = isPaid();
  const alreadyUsed = hasUsedFreeLetter();
  const blocked = !paid && alreadyUsed;
  function handleChange(e) {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
  }
  function handleGenerate() {
    const { patientName, providerName, billDate, disputeReason, state } = fields;
    if (!patientName || !providerName || !billDate || !disputeReason || !state) {
      setError("Please fill in all 5 fields before generating your letter.");
      return;
    }
    if (blocked) {
      setError("You have already generated 1 free dispute letter this session. Upgrade for unlimited letters.");
      return;
    }
    setError("");
    setLetter(generateLetter(fields));
    if (!paid) markLetterUsed();
  }
  function handleCopy() {
    if (letter) navigator.clipboard.writeText(letter).catch(() => {
    });
  }
  function handlePrint() {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`<pre style="font-family: Georgia, serif; white-space: pre-wrap; padding: 48px; font-size: 15px; line-height: 1.7;">${letter}</pre>`);
      w.document.close();
      w.print();
    }
  }
  const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: INK, marginBottom: 6, fontFamily: "DM Sans, sans-serif", letterSpacing: "0.01em" };
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
    !paid && /* @__PURE__ */ jsxs("div", { style: {
      background: alreadyUsed ? "#FFFBEB" : "#EFF9FA",
      border: `1px solid ${alreadyUsed ? "#FCD34D" : BORDER}`,
      borderRadius: "12px",
      padding: "14px 16px",
      display: "flex",
      alignItems: "flex-start",
      gap: 10
    }, children: [
      /* @__PURE__ */ jsx("svg", { style: { width: 18, height: 18, color: alreadyUsed ? AMBER : TEAL, flexShrink: 0, marginTop: 2 }, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: INK, margin: 0 }, children: alreadyUsed ? /* @__PURE__ */ jsxs(Fragment, { children: [
        "Free letter used. ",
        /* @__PURE__ */ jsx("a", { href: "/api/create-checkout", style: { color: AMBER, fontWeight: 600, textDecoration: "underline" }, children: "Upgrade to Complete Dispute Kit ($19)" }),
        " for unlimited letters."
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("strong", { children: "Free tier:" }),
        " 1 dispute letter per session. ",
        /* @__PURE__ */ jsx("a", { href: "/#complete-kit", style: { color: TEAL, fontWeight: 500, textDecoration: "underline" }, children: "Upgrade for unlimited →" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Patient Name *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "patientName",
            value: fields.patientName,
            onChange: handleChange,
            placeholder: "Jane Smith",
            style: inputStyle,
            disabled: blocked,
            onFocus: (e) => e.target.style.borderColor = TEAL,
            onBlur: (e) => e.target.style.borderColor = BORDER
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Provider / Hospital Name *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "providerName",
            value: fields.providerName,
            onChange: handleChange,
            placeholder: "Acme Regional Hospital",
            style: inputStyle,
            disabled: blocked,
            onFocus: (e) => e.target.style.borderColor = TEAL,
            onBlur: (e) => e.target.style.borderColor = BORDER
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Bill Date *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            name: "billDate",
            value: fields.billDate,
            onChange: handleChange,
            style: inputStyle,
            disabled: blocked,
            onFocus: (e) => e.target.style.borderColor = TEAL,
            onBlur: (e) => e.target.style.borderColor = BORDER
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { style: labelStyle, children: "State *" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            name: "state",
            value: fields.state,
            onChange: handleChange,
            style: { ...inputStyle, background: blocked ? SURFACE : "#fff" },
            disabled: blocked,
            onFocus: (e) => e.target.style.borderColor = TEAL,
            onBlur: (e) => e.target.style.borderColor = BORDER,
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select your state" }),
              US_STATES.map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s }, s))
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Dispute Reason *" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          name: "disputeReason",
          value: fields.disputeReason,
          onChange: handleChange,
          placeholder: "e.g., I was charged twice for the same blood test (CPT 80053). The itemized bill shows two identical charges on 01/15/2024 totaling $486. I only had one blood draw during my visit.",
          style: { ...inputStyle, height: 120, resize: "none", lineHeight: 1.6 },
          disabled: blocked,
          onFocus: (e) => e.target.style.borderColor = TEAL,
          onBlur: (e) => e.target.style.borderColor = BORDER
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxs("div", { style: { background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", padding: "14px 16px" }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: ERROR_RED, margin: 0 }, children: error }),
      blocked && /* @__PURE__ */ jsx("a", { href: "/api/create-checkout", style: {
        display: "inline-block",
        marginTop: 10,
        background: AMBER,
        color: INK,
        fontWeight: 700,
        padding: "9px 18px",
        borderRadius: "8px",
        fontSize: 13,
        textDecoration: "none"
      }, children: "Get Complete Dispute Kit — $19" })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleGenerate,
        disabled: blocked,
        style: {
          width: "100%",
          background: blocked ? MUTED : BLUE,
          color: "#fff",
          fontWeight: 700,
          padding: "15px",
          borderRadius: "12px",
          border: "none",
          cursor: blocked ? "not-allowed" : "pointer",
          fontSize: 16,
          fontFamily: "DM Sans, sans-serif"
        },
        onMouseOver: (e) => {
          if (!blocked) e.currentTarget.style.background = "#243D66";
        },
        onMouseOut: (e) => {
          if (!blocked) e.currentTarget.style.background = BLUE;
        },
        children: blocked ? "Free Letter Used — Upgrade to Continue" : "Generate My Dispute Letter"
      }
    ),
    letter && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }, children: [
        /* @__PURE__ */ jsx("h2", { style: { fontWeight: 700, color: INK, margin: 0, fontSize: 18, fontFamily: "DM Sans, sans-serif" }, children: "Your Dispute Letter" }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ jsx("button", { onClick: handleCopy, style: {
            background: SURFACE,
            color: INK,
            fontWeight: 500,
            padding: "8px 16px",
            borderRadius: "8px",
            border: `1px solid ${BORDER}`,
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "DM Sans, sans-serif"
          }, children: "Copy" }),
          /* @__PURE__ */ jsx("button", { onClick: handlePrint, style: {
            background: BLUE,
            color: "#fff",
            fontWeight: 600,
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "DM Sans, sans-serif"
          }, children: "Print / Save" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "28px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }, children: /* @__PURE__ */ jsx("pre", { style: { fontSize: 14, color: INK, whiteSpace: "pre-wrap", fontFamily: "Georgia, serif", lineHeight: 1.8, margin: 0 }, children: letter }) }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 12, color: MUTED, textAlign: "center", margin: 0 }, children: "This letter is a template. Review and customize as needed. Not legal advice." })
    ] })
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$DisputeLetter = createComponent(($$result, $$props, $$slots) => {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Generate a Medical Bill Dispute Letter",
    "description": "Generate a professional dispute letter to contest medical billing errors.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter your information",
        "text": "Fill in your name, the provider name, bill date, and your state."
      },
      {
        "@type": "HowToStep",
        "name": "Describe the dispute",
        "text": "Explain why you are disputing the bill \u2014 duplicate charges, incorrect codes, etc."
      },
      {
        "@type": "HowToStep",
        "name": "Generate and send",
        "text": "Click 'Generate Letter' to get a professional dispute letter ready to print and mail."
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Dispute Letter Generator \u2014 Medical Bill Dispute", "description": "Generate a professional medical bill dispute letter in seconds. Fill in 5 fields, get a ready-to-send letter. Free \u2014 1 letter per session." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script>  ", '<section style="background: linear-gradient(135deg, #2D4A7A 0%, #1A2D4A 100%);" class="text-white py-14 px-4"> <div class="max-w-3xl mx-auto text-center"> <h1 class="font-bold mb-4" style="font-size: 36px;">Dispute Letter Generator</h1> <p class="text-blue-200" style="font-size: 18px; line-height: 1.6;">Fill in 5 fields to generate a professional, ready-to-send medical bill dispute letter. Free for your first letter.</p> </div> </section>  <section class="py-12 px-4"> <div class="max-w-2xl mx-auto"> ', ` </div> </section>  <section class="py-12 px-4 bg-white border-t border-[#E2E8F0]"> <div class="max-w-3xl mx-auto"> <h2 class="font-semibold mb-8 text-center text-[#1A2332]" style="font-size: 28px;">Tips for a Successful Dispute</h2> <ul class="space-y-4"> <li class="flex items-start gap-4 bg-[#F7F8FA] p-5 rounded-xl border border-[#E2E8F0]"> <span class="text-[#0F7B8C] font-bold text-lg mt-0.5 w-6 flex-shrink-0">1</span> <div> <div class="font-semibold text-[#1A2332] mb-1" style="font-size: 16px;">Send certified mail</div> <div class="text-[#64748B] text-sm leading-relaxed">Always send dispute letters via certified mail with return receipt so you have proof of delivery.</div> </div> </li> <li class="flex items-start gap-4 bg-[#F7F8FA] p-5 rounded-xl border border-[#E2E8F0]"> <span class="text-[#0F7B8C] font-bold text-lg mt-0.5 w-6 flex-shrink-0">2</span> <div> <div class="font-semibold text-[#1A2332] mb-1" style="font-size: 16px;">Request an itemized bill</div> <div class="text-[#64748B] text-sm leading-relaxed">Ask for a complete itemized bill if you haven't already \u2014 you're entitled to one by law.</div> </div> </li> <li class="flex items-start gap-4 bg-[#F7F8FA] p-5 rounded-xl border border-[#E2E8F0]"> <span class="text-[#0F7B8C] font-bold text-lg mt-0.5 w-6 flex-shrink-0">3</span> <div> <div class="font-semibold text-[#1A2332] mb-1" style="font-size: 16px;">Keep copies of everything</div> <div class="text-[#64748B] text-sm leading-relaxed">Save copies of all correspondence, bills, and responses. You may need them if you escalate.</div> </div> </li> <li class="flex items-start gap-4 bg-[#F7F8FA] p-5 rounded-xl border border-[#E2E8F0]"> <span class="text-[#0F7B8C] font-bold text-lg mt-0.5 w-6 flex-shrink-0">4</span> <div> <div class="font-semibold text-[#1A2332] mb-1" style="font-size: 16px;">Act within 30 days</div> <div class="text-[#64748B] text-sm leading-relaxed">Most insurers and providers have a 30-day window for disputes. Don't wait.</div> </div> </li> </ul> </div> </section> `])), unescapeHTML(JSON.stringify(howToSchema)), maybeRenderHead(), renderComponent($$result2, "DisputeLetter", DisputeLetter, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/node/.openclaw/workspaces/mbd-coder/jobs/2026/Jul/medical-bill-decoder-astro/repo/src/components/DisputeLetter.tsx", "client:component-export": "default" })) })}`;
}, "/home/node/.openclaw/workspaces/mbd-coder/jobs/2026/Jul/medical-bill-decoder-astro/repo/src/pages/dispute-letter.astro", void 0);

const $$file = "/home/node/.openclaw/workspaces/mbd-coder/jobs/2026/Jul/medical-bill-decoder-astro/repo/src/pages/dispute-letter.astro";
const $$url = "/dispute-letter";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$DisputeLetter,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

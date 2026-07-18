import { useState } from 'react';

// ---------------------------------------------------------------------------
// PAYMENTS_LIVE: set to true to re-enable the $29 checkout button.
// false = show Coming Soon UI instead. One-line change to go live.
// ---------------------------------------------------------------------------
const PAYMENTS_LIVE = false;

const TEAL = '#0F7B8C';
const BLUE = '#2D4A7A';
const AMBER = '#E8A020';
const INK = '#1A2332';
const MUTED = '#64748B';
const SURFACE = '#F7F8FA';
const SUCCESS = '#16A34A';
const ERROR_RED = '#DC2626';
const BORDER = '#E2E8F0';

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
];

const FREE_LETTER_LIMIT = 3;
const PAID_LETTER_LIMIT = 20;
const SESSION_PASS_LETTER_LIMIT = 20;
const COMPLETE_ACCESS_LETTER_LIMIT = 50;

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function isPaid(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some(c => c.trim() === 'paid=true');
}
function getTier(): string {
  if (typeof document === 'undefined') return 'free';
  return document.cookie.split(';').find(c => c.trim().startsWith('tier='))?.split('=')?.[1]?.trim() || 'free';
}
function isCompleteAccess(): boolean {
  return getTier() === 'complete-access';
}
function isSessionPass(): boolean {
  if (typeof document === 'undefined') return false;
  if (getTier() !== 'session-pass') return false;
  // Verify session hasn't expired
  const match = document.cookie.split(';').find(c => c.trim().startsWith('session_expires='));
  const expiresAt = match ? parseInt(match.split('=')[1]?.trim() || '0', 10) : 0;
  return expiresAt > Date.now();
}

// Free tier: date-keyed localStorage counter — resets automatically each new day
function getFreeLetterCount(): number {
  if (typeof localStorage === 'undefined') return 0;
  const key = `free_letter_count_${getTodayKey()}`;
  return parseInt(localStorage.getItem(key) || '0', 10);
}
function incrementFreeLetterCount() {
  if (typeof localStorage === 'undefined') return;
  const key = `free_letter_count_${getTodayKey()}`;
  localStorage.setItem(key, String(getFreeLetterCount() + 1));
}

// Paid tiers: date-keyed localStorage counter — resets automatically each new day
function getPaidLetterCount(): number {
  if (typeof localStorage === 'undefined') return 0;
  const key = `paid_letter_count_${getTodayKey()}`;
  return parseInt(localStorage.getItem(key) || '0', 10);
}
function incrementPaidLetterCount() {
  if (typeof localStorage === 'undefined') return;
  const key = `paid_letter_count_${getTodayKey()}`;
  localStorage.setItem(key, String(getPaidLetterCount() + 1));
}

function generateLetter(f: { patientName: string; providerName: string; billDate: string; disputeReason: string; state: string }) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px',
  border: `1px solid ${BORDER}`, borderRadius: '10px',
  fontSize: 14, color: INK, background: '#fff',
  fontFamily: 'DM Sans, sans-serif', outline: 'none',
  boxSizing: 'border-box',
};

const printStyles = `
@media print {
  /* Hide everything except the letter */
  body > *:not(#print-root) { display: none !important; }
  nav, header, footer, aside,
  [data-no-print], .no-print,
  [class*="nav"], [class*="header"], [class*="footer"],
  [class*="sidebar"], [class*="cta"], [class*="banner"],
  [class*="sticky"], [id*="nav"], [id*="header"], [id*="footer"],
  button, form, input, select, textarea,
  #print-hide { display: none !important; }

  /* Show only the letter content */
  #print-letter {
    display: block !important;
    position: fixed !important;
    top: 0 !important; left: 0 !important;
    width: 100% !important;
    background: #fff !important;
    z-index: 99999 !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    box-shadow: none !important;
  }

  #print-letter pre {
    font-family: Georgia, 'Times New Roman', serif !important;
    font-size: 12pt !important;
    line-height: 1.8 !important;
    color: #000 !important;
    white-space: pre-wrap !important;
    word-break: break-word !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  @page {
    size: A4;
    margin: 25mm 20mm 25mm 20mm;
  }
}
`;

export default function DisputeLetter() {
  const [fields, setFields] = useState({ patientName: '', providerName: '', billDate: '', disputeReason: '', state: '' });
  const [letter, setLetter] = useState('');
  const [error, setError] = useState('');

  const paid = isPaid();
  const completeAccess = isCompleteAccess();
  const sessionPass = isSessionPass();
  // If session-pass cookie exists but is expired, treat as free
  const effectivelyPaid = paid && (completeAccess || sessionPass || (!completeAccess && getTier() === 'dispute-kit'));
  const freeLetterCount = getFreeLetterCount();
  const freeExhausted = !effectivelyPaid && freeLetterCount >= FREE_LETTER_LIMIT;
  const paidLetterCount = getPaidLetterCount();
  // complete-access: 50/day; session-pass: 20/day; dispute-kit: 20/day
  const paidLetterBlocked = effectivelyPaid && (
    completeAccess ? paidLetterCount >= COMPLETE_ACCESS_LETTER_LIMIT :
    sessionPass ? paidLetterCount >= SESSION_PASS_LETTER_LIMIT :
    paidLetterCount >= PAID_LETTER_LIMIT
  );
  const blocked = freeExhausted || paidLetterBlocked;
  // PDF is only available to dispute-kit ($29) and complete-access ($49), NOT session-pass
  const pdfUnlocked = effectivelyPaid && !sessionPass;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleGenerate() {
    const { patientName, providerName, billDate, disputeReason, state } = fields;
    if (!patientName || !providerName || !billDate || !disputeReason || !state) {
      setError('Please fill in all 5 fields before generating your letter.'); return;
    }
    if (freeExhausted) {
      setError(`You have used all ${FREE_LETTER_LIMIT} free dispute letters for today. Upgrade for up to 20 letters per day, or try again tomorrow.`); return;
    }
    if (paidLetterBlocked) {
      const limit = completeAccess ? COMPLETE_ACCESS_LETTER_LIMIT : SESSION_PASS_LETTER_LIMIT;
      setError(`You have reached your daily limit of ${limit} dispute letters. Please try again tomorrow.`); return;
    }
    setError('');
    setLetter(generateLetter(fields));
    if (!effectivelyPaid) incrementFreeLetterCount();
    // track count for all paid tiers
    if (effectivelyPaid) incrementPaidLetterCount();
  }

  function handleCopy() {
    if (letter) navigator.clipboard.writeText(letter).catch(() => {});
  }

  function handleDownloadPDF() {
    window.print();
  }

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: INK, marginBottom: 6, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.01em' };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Tier notice */}
        {!effectivelyPaid && (
          <div style={{
            background: freeExhausted ? '#FFFBEB' : '#EFF9FA',
            border: `1px solid ${freeExhausted ? '#FCD34D' : BORDER}`,
            borderRadius: '12px', padding: '14px 16px',
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <svg style={{ width: 18, height: 18, color: freeExhausted ? AMBER : TEAL, flexShrink: 0, marginTop: 2 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p style={{ fontSize: 13, color: INK, margin: 0 }}>
              {freeExhausted
                ? <>Daily free letters used ({FREE_LETTER_LIMIT}/{FREE_LETTER_LIMIT}). {PAYMENTS_LIVE
                    ? <a href="/api/create-checkout" style={{ color: AMBER, fontWeight: 600, textDecoration: 'underline' }}>Upgrade to Complete Dispute Kit ($29)</a>
                    : <a href="/#complete-kit" style={{ color: AMBER, fontWeight: 600, textDecoration: 'underline' }}>Complete Dispute Kit — coming soon</a>
                  } for up to 20 letters per day.</>
                : <><strong>Free tier:</strong> {freeLetterCount}/{FREE_LETTER_LIMIT} letters used today. <a href="/#complete-kit" style={{ color: TEAL, fontWeight: 500, textDecoration: 'underline' }}>Upgrade for up to 20 letters/day →</a></>
              }
            </p>
          </div>
        )}

        {/* Form grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Patient Name *</label>
            <input type="text" name="patientName" value={fields.patientName} onChange={handleChange}
              placeholder="Jane Smith" style={inputStyle} disabled={blocked}
              onFocus={e => (e.target.style.borderColor = TEAL)} onBlur={e => (e.target.style.borderColor = BORDER)}/>
          </div>
          <div>
            <label style={labelStyle}>Provider / Hospital Name *</label>
            <input type="text" name="providerName" value={fields.providerName} onChange={handleChange}
              placeholder="Acme Regional Hospital" style={inputStyle} disabled={blocked}
              onFocus={e => (e.target.style.borderColor = TEAL)} onBlur={e => (e.target.style.borderColor = BORDER)}/>
          </div>
          <div>
            <label style={labelStyle}>Bill Date *</label>
            <input type="date" name="billDate" value={fields.billDate} onChange={handleChange}
              style={inputStyle} disabled={blocked}
              onFocus={e => (e.target.style.borderColor = TEAL)} onBlur={e => (e.target.style.borderColor = BORDER)}/>
          </div>
          <div>
            <label style={labelStyle}>State *</label>
            <select name="state" value={fields.state} onChange={handleChange}
              style={{ ...inputStyle, background: blocked ? SURFACE : '#fff' }} disabled={blocked}
              onFocus={e => (e.target.style.borderColor = TEAL)} onBlur={e => (e.target.style.borderColor = BORDER)}>
              <option value="">Select your state</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Dispute Reason *</label>
          <textarea name="disputeReason" value={fields.disputeReason} onChange={handleChange}
            placeholder="e.g., I was charged twice for the same blood test (CPT 80053). The itemized bill shows two identical charges on 01/15/2024 totaling $486. I only had one blood draw during my visit."
            style={{ ...inputStyle, height: 120, resize: 'none', lineHeight: 1.6 }} disabled={blocked}
            onFocus={e => (e.target.style.borderColor = TEAL)} onBlur={e => (e.target.style.borderColor = BORDER)}/>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '14px 16px' }}>
            <p style={{ fontSize: 13, color: ERROR_RED, margin: 0 }}>{error}</p>
            {blocked && (
              PAYMENTS_LIVE ? (
                <a href="/api/create-checkout" style={{
                  display: 'inline-block', marginTop: 10, background: AMBER, color: INK,
                  fontWeight: 700, padding: '9px 18px', borderRadius: '8px', fontSize: 13, textDecoration: 'none',
                }}>Get Complete Dispute Kit — $29</a>
              ) : (
                <div style={{ marginTop: 10 }}>
                  <span style={{
                    display: 'inline-block', background: '#D1D5DB', color: '#6B7280',
                    fontWeight: 700, padding: '9px 18px', borderRadius: '8px', fontSize: 13, cursor: 'not-allowed',
                  }}>Coming Soon — $29</span>
                  <p style={{ fontSize: 12, color: '#6B7280', marginTop: 6, marginBottom: 0 }}>
                    <a href="/pricing" style={{ color: TEAL, textDecoration: 'underline' }}>View pricing</a> — now live!
                  </p>
                </div>
              )
            )}
          </div>
        )}

        <button onClick={handleGenerate} disabled={blocked} style={{
          width: '100%', background: blocked ? MUTED : BLUE, color: '#fff',
          fontWeight: 700, padding: '15px', borderRadius: '12px',
          border: 'none', cursor: blocked ? 'not-allowed' : 'pointer',
          fontSize: 16, fontFamily: 'DM Sans, sans-serif',
        }}
          onMouseOver={e => { if (!blocked) e.currentTarget.style.background = '#243D66'; }}
          onMouseOut={e => { if (!blocked) e.currentTarget.style.background = BLUE; }}>
          {blocked ? (paidLetterBlocked ? `Daily limit reached — Try again tomorrow` : `Daily free letters used — Upgrade to Continue`) : 'Generate My Dispute Letter'}
        </button>

        {letter && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div id="print-hide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <h2 style={{ fontWeight: 700, color: INK, margin: 0, fontSize: 18, fontFamily: 'DM Sans, sans-serif' }}>Your Dispute Letter</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleCopy} style={{
                  background: SURFACE, color: INK, fontWeight: 500, padding: '8px 16px',
                  borderRadius: '8px', border: `1px solid ${BORDER}`, cursor: 'pointer',
                  fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                }}>Copy</button>

                {/* PDF Download: dispute-kit and complete-access only; session-pass sees locked state */}
                {pdfUnlocked ? (
                  <button onClick={handleDownloadPDF} style={{
                    background: TEAL, color: '#fff', fontWeight: 600, padding: '8px 16px',
                    borderRadius: '8px', border: 'none', cursor: 'pointer',
                    fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    Download as PDF
                  </button>
                ) : (
                  PAYMENTS_LIVE ? (
                    <a href="/api/create-checkout" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: AMBER, color: INK, fontWeight: 700,
                      padding: '8px 16px', borderRadius: '8px',
                      fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                      textDecoration: 'none', cursor: 'pointer',
                    }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                      Unlock PDF — $29
                    </a>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: INK, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>This letter is ready to send.</p>
                      <p style={{ fontSize: 12, color: MUTED, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>Download as PDF to keep a clean formatted copy — or copy the text above.</p>
                      <a href="https://amitverse58.gumroad.com/l/fsupd" target="_blank" rel="noopener" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: TEAL, color: '#fff', fontWeight: 600,
                        padding: '8px 16px', borderRadius: '8px',
                        fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                        textDecoration: 'none', marginTop: 4,
                      }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                        Download as PDF — $29 →
                      </a>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Letter content — shown during print, rest is hidden */}
            <div id="print-letter" style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '28px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
              <pre style={{ fontSize: 14, color: INK, whiteSpace: 'pre-wrap', fontFamily: 'Georgia, serif', lineHeight: 1.8, margin: 0 }}>{letter}</pre>
            </div>

            <p id="print-hide" style={{ fontSize: 12, color: MUTED, textAlign: 'center', margin: 0 }}>
              This letter is a template. Review and customize as needed. Not legal advice.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

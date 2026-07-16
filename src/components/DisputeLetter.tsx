import { useState } from 'react';

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

const PAID_LETTER_LIMIT = 20;

function isPaid(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.includes('paid=true');
}
function hasUsedFreeLetter(): boolean {
  if (typeof sessionStorage === 'undefined') return false;
  return sessionStorage.getItem('dispute_letter_used') === 'true';
}
function markLetterUsed() {
  if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('dispute_letter_used', 'true');
}
function getPaidLetterCount(): number {
  if (typeof localStorage === 'undefined') return 0;
  return parseInt(localStorage.getItem('paid_letter_count') || '0', 10);
}
function incrementPaidLetterCount() {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('paid_letter_count', String(getPaidLetterCount() + 1));
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

export default function DisputeLetter() {
  const [fields, setFields] = useState({ patientName: '', providerName: '', billDate: '', disputeReason: '', state: '' });
  const [letter, setLetter] = useState('');
  const [error, setError] = useState('');

  const paid = isPaid();
  const alreadyUsed = hasUsedFreeLetter();
  const paidLetterCount = getPaidLetterCount();
  const paidLetterBlocked = paid && paidLetterCount >= PAID_LETTER_LIMIT;
  const blocked = (!paid && alreadyUsed) || paidLetterBlocked;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleGenerate() {
    const { patientName, providerName, billDate, disputeReason, state } = fields;
    if (!patientName || !providerName || !billDate || !disputeReason || !state) {
      setError('Please fill in all 5 fields before generating your letter.'); return;
    }
    if (!paid && alreadyUsed) {
      setError('You have already generated 1 free dispute letter this session. Upgrade for up to 20 letters.'); return;
    }
    if (paidLetterBlocked) {
      setError(`You have reached your limit of ${PAID_LETTER_LIMIT} dispute letters. Thank you for using the Complete Dispute Kit!`); return;
    }
    setError('');
    setLetter(generateLetter(fields));
    if (!paid) markLetterUsed();
    if (paid) incrementPaidLetterCount();
  }

  function handleCopy() {
    if (letter) navigator.clipboard.writeText(letter).catch(() => {});
  }
  function handlePrint() {
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(`<pre style="font-family: Georgia, serif; white-space: pre-wrap; padding: 48px; font-size: 15px; line-height: 1.7;">${letter}</pre>`);
      w.document.close(); w.print();
    }
  }

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: INK, marginBottom: 6, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.01em' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Tier notice */}
      {!paid && (
        <div style={{
          background: alreadyUsed ? '#FFFBEB' : '#EFF9FA',
          border: `1px solid ${alreadyUsed ? '#FCD34D' : BORDER}`,
          borderRadius: '12px', padding: '14px 16px',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <svg style={{ width: 18, height: 18, color: alreadyUsed ? AMBER : TEAL, flexShrink: 0, marginTop: 2 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p style={{ fontSize: 13, color: INK, margin: 0 }}>
            {alreadyUsed
              ? <>Free letter used. <a href="/api/create-checkout" style={{ color: AMBER, fontWeight: 600, textDecoration: 'underline' }}>Upgrade to Complete Dispute Kit ($19)</a> for up to 20 letters per day.</>
              : <><strong>Free tier:</strong> 1 dispute letter per session. <a href="/#complete-kit" style={{ color: TEAL, fontWeight: 500, textDecoration: 'underline' }}>Upgrade for up to 20 letters →</a></>
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
            <a href="/api/create-checkout" style={{
              display: 'inline-block', marginTop: 10, background: AMBER, color: INK,
              fontWeight: 700, padding: '9px 18px', borderRadius: '8px', fontSize: 13, textDecoration: 'none',
            }}>Get Complete Dispute Kit — $19</a>
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
        {blocked ? 'Free Letter Used — Upgrade to Continue' : 'Generate My Dispute Letter'}
      </button>

      {letter && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <h2 style={{ fontWeight: 700, color: INK, margin: 0, fontSize: 18, fontFamily: 'DM Sans, sans-serif' }}>Your Dispute Letter</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleCopy} style={{
                background: SURFACE, color: INK, fontWeight: 500, padding: '8px 16px',
                borderRadius: '8px', border: `1px solid ${BORDER}`, cursor: 'pointer',
                fontSize: 13, fontFamily: 'DM Sans, sans-serif',
              }}>Copy</button>
              <button onClick={handlePrint} style={{
                background: BLUE, color: '#fff', fontWeight: 600, padding: '8px 16px',
                borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontSize: 13, fontFamily: 'DM Sans, sans-serif',
              }}>Print / Save</button>
            </div>
          </div>
          <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '28px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
            <pre style={{ fontSize: 14, color: INK, whiteSpace: 'pre-wrap', fontFamily: 'Georgia, serif', lineHeight: 1.8, margin: 0 }}>{letter}</pre>
          </div>
          <p style={{ fontSize: 12, color: MUTED, textAlign: 'center', margin: 0 }}>
            This letter is a template. Review and customize as needed. Not legal advice.
          </p>
        </div>
      )}
    </div>
  );
}

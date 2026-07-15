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

const BILLING_ERRORS = [
  { id: 1, title: 'Duplicate Charges', description: 'The same service or procedure is billed more than once on the same date.', howToCheck: 'Look for identical line items with the same CPT code and date of service.' },
  { id: 2, title: 'Upcoding', description: 'A provider bills for a more expensive service than what was actually performed.', howToCheck: 'Compare the CPT codes on your bill against the actual services you received.' },
  { id: 3, title: 'Unbundling', description: 'Procedures that should be billed together as a package are split into separate charges.', howToCheck: 'Look for multiple procedure codes that typically go together (e.g., surgical components).' },
  { id: 4, title: 'Incorrect Patient Information', description: 'Your name, date of birth, or insurance ID is wrong, causing claim errors.', howToCheck: 'Verify your personal information is correct on every page of your bill.' },
  { id: 5, title: 'Services Not Rendered', description: 'You are charged for a service, supply, or procedure you never received.', howToCheck: 'Go line by line and cross-reference with your actual appointment notes or discharge paperwork.' },
  { id: 6, title: 'Incorrect Diagnosis Code (ICD)', description: 'The wrong diagnosis code is used, leading to denied claims or incorrect billing.', howToCheck: 'Ask for your ICD codes and verify they match your actual diagnosis.' },
  { id: 7, title: 'Inpatient vs. Outpatient Status Error', description: 'Facility fees charged as inpatient when you were actually an outpatient or under observation.', howToCheck: 'Confirm your admission status. Observation status vs. inpatient has different billing rules.' },
  { id: 8, title: 'Overpriced Medical Supplies', description: 'Basic supplies like gloves, bandages, or saline are billed at inflated prices.', howToCheck: 'Look for supply line items and compare against typical market prices.' },
  { id: 9, title: 'Incorrect Insurance Coordination', description: 'If you have two insurance plans, the primary/secondary coordination may be applied incorrectly.', howToCheck: 'Confirm with both insurers that the coordination of benefits was applied correctly.' },
  { id: 10, title: 'Balance Billing by In-Network Provider', description: 'An in-network provider bills you for the difference between their charge and what insurance paid.', howToCheck: 'Confirm the provider was truly in-network on your date of service and review your EOB.' },
  { id: 11, title: 'Phantom Medication Charges', description: 'Medications are listed that you never received or that were charged at the wrong dose.', howToCheck: 'Review all medication line items and match against any medications actually administered.' },
  { id: 12, title: 'Incorrect Number of Units', description: 'A procedure is billed for more units than were actually performed.', howToCheck: 'Check the quantity column next to each CPT code and verify it matches reality.' },
  { id: 13, title: 'Wrong Procedure Code (Typo)', description: 'A typographical error in the CPT code leads to billing for the wrong service entirely.', howToCheck: 'Look up any unfamiliar CPT codes online and confirm they match the care you received.' },
  { id: 14, title: 'Cancelled Services Still Billed', description: 'A procedure was cancelled or not performed but still appears on the bill.', howToCheck: 'Cross-reference with your appointment history and any cancellation confirmations.' },
  { id: 15, title: 'No Itemized Bill Provided', description: 'You received only a summary bill. You have the right to an itemized bill.', howToCheck: 'If you only received a lump sum, call the billing department and request a complete itemized bill.' },
];

export default function ErrorChecklist() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [found, setFound] = useState<Set<number>>(new Set());

  function toggle(id: number) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setFound(f => { const nf = new Set(f); nf.delete(id); return nf; });
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function markFound(id: number) {
    setFound(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setChecked(prev => { const next = new Set(prev); next.add(id); return next; });
  }

  const checkedCount = checked.size;
  const foundCount = found.size;
  const pct = Math.round((checkedCount / BILLING_ERRORS.length) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Progress card */}
      <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: INK, fontFamily: 'DM Sans, sans-serif' }}>
            Progress: {checkedCount} / {BILLING_ERRORS.length} checked
          </span>
          {foundCount > 0 && (
            <span style={{
              background: ERROR_RED, color: '#fff', fontSize: 12, fontWeight: 700,
              padding: '4px 12px', borderRadius: '999px', fontFamily: 'DM Sans, sans-serif',
            }}>
              {foundCount} error{foundCount !== 1 ? 's' : ''} found!
            </span>
          )}
        </div>
        <div style={{ width: '100%', background: '#E2E8F0', borderRadius: '999px', height: 8 }}>
          <div style={{
            width: `${pct}%`, background: checkedCount === BILLING_ERRORS.length ? SUCCESS : TEAL,
            height: 8, borderRadius: '999px', transition: 'width 0.3s ease',
          }}/>
        </div>
        {checkedCount === BILLING_ERRORS.length && foundCount === 0 && (
          <p style={{ fontSize: 13, color: SUCCESS, marginTop: 10, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
            Great news — no obvious errors found! Always request an itemized bill to be fully sure.
          </p>
        )}
      </div>

      {/* Instruction */}
      <p style={{ fontSize: 14, color: MUTED, margin: 0, lineHeight: 1.6 }}>
        Check each item against your bill. Mark any errors found, then{' '}
        <a href="/dispute-letter" style={{ color: TEAL, textDecoration: 'underline', fontWeight: 500 }}>generate a dispute letter</a> to contest them.
      </p>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {BILLING_ERRORS.map(item => {
          const isChecked = checked.has(item.id);
          const isFound = found.has(item.id);

          return (
            <div key={item.id} style={{
              background: isFound ? '#FEF2F2' : isChecked ? '#F0FDF4' : '#fff',
              border: `1px solid ${isFound ? '#FECACA' : isChecked ? '#86EFAC' : BORDER}`,
              borderRadius: '12px', padding: '18px',
              transition: 'all 0.15s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                {/* Checkbox */}
                <button onClick={() => toggle(item.id)} style={{
                  flexShrink: 0, width: 24, height: 24, borderRadius: '6px',
                  border: `2px solid ${isChecked ? SUCCESS : BORDER}`,
                  background: isChecked ? SUCCESS : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', marginTop: 2, transition: 'all 0.15s',
                }}>
                  {isChecked && (
                    <svg style={{ width: 14, height: 14, color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                    </svg>
                  )}
                </button>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: MUTED, fontFamily: 'JetBrains Mono, monospace' }}>#{item.id}</span>
                    <span style={{ fontSize: 16, fontWeight: 600, color: INK, fontFamily: 'DM Sans, sans-serif' }}>{item.title}</span>
                    {isFound && (
                      <span style={{
                        background: ERROR_RED, color: '#fff', fontSize: 11,
                        fontWeight: 700, padding: '2px 8px', borderRadius: '999px', fontFamily: 'DM Sans, sans-serif',
                      }}>ERROR FOUND</span>
                    )}
                  </div>
                  <p style={{ fontSize: 14, color: MUTED, margin: '0 0 6px', lineHeight: 1.5 }}>{item.description}</p>
                  <p style={{ fontSize: 12, color: MUTED, margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
                    <strong style={{ fontStyle: 'normal' }}>How to check:</strong> {item.howToCheck}
                  </p>

                  {isChecked && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                      <button onClick={() => markFound(item.id)} style={{
                        background: isFound ? ERROR_RED : '#FEE2E2',
                        color: isFound ? '#fff' : ERROR_RED,
                        fontWeight: 600, padding: '7px 14px', borderRadius: '8px',
                        border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                        transition: 'all 0.15s',
                      }}>
                        {isFound ? '✓ Error Marked' : 'Mark as Error Found'}
                      </button>
                      {isFound && (
                        <a href="/dispute-letter" style={{
                          display: 'inline-block', background: AMBER, color: INK,
                          fontWeight: 700, padding: '7px 14px', borderRadius: '8px',
                          fontSize: 13, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif',
                        }}>Dispute This →</a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Errors found CTA — amber for urgency */}
      {foundCount > 0 && (
        <div style={{
          background: `linear-gradient(135deg, ${BLUE} 0%, #1A2D4A 100%)`,
          borderRadius: '16px', padding: '28px', textAlign: 'center',
        }}>
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 20, margin: '0 0 8px', fontFamily: 'DM Sans, sans-serif' }}>
            You found {foundCount} potential error{foundCount !== 1 ? 's' : ''}!
          </h3>
          <p style={{ color: '#CBD5E1', fontSize: 14, margin: '0 0 20px', lineHeight: 1.5 }}>
            Generate a professional dispute letter to contest these charges.
          </p>
          <a href="/dispute-letter" style={{
            display: 'inline-block', background: AMBER, color: INK,
            fontWeight: 700, padding: '13px 28px', borderRadius: '12px',
            fontSize: 15, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif',
          }}>Generate Dispute Letter →</a>
        </div>
      )}
    </div>
  );
}

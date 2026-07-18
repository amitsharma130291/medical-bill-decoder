import { useState } from 'react';
import { marked } from 'marked';

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

function getTodayKey() {
  const d = new Date();
  return `eob_count_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getRateCount(): number {
  if (typeof document === 'undefined') return 0;
  const key = getTodayKey();
  const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
  return match ? parseInt(match[1], 10) : 0;
}

function incrementRateCount() {
  const key = getTodayKey();
  const current = getRateCount();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  document.cookie = `${key}=${current + 1}; expires=${tomorrow.toUTCString()}; path=/`;
}

function isPaid(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.includes('paid=true');
}

export default function EobDecoder() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const FREE_LIMIT = 3;
  const count = getRateCount();
  const paid = isPaid();
  const blocked = !paid && count >= FREE_LIMIT;

  async function handleDecode() {
    if (!text.trim()) { setError('Please paste your EOB text first.'); return; }
    if (blocked) {
      setError(`You've used all ${FREE_LIMIT} free decodes for today. Upgrade to the Complete Dispute Kit for up to 20 decodes per day.`);
      return;
    }
    setLoading(true); setError(''); setResult('');
    try {
      const res = await fetch('/api/decode-eob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eobText: text, paid }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(res.status === 429
          ? 'Daily limit reached. Upgrade to the Complete Dispute Kit for up to 20 decodes per day.'
          : data.error || 'Something went wrong. Please try again.');
        return;
      }
      const data = await res.json();
      setResult(data.result);
      incrementRateCount();
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Tier notice */}
      {!paid && (
        <div style={{ background: '#EFF9FA', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <svg style={{ width: 20, height: 20, color: TEAL, flexShrink: 0, marginTop: 2 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p style={{ fontSize: 14, color: INK, margin: 0 }}>
            <strong>Free tier:</strong> {Math.max(0, FREE_LIMIT - count)} of {FREE_LIMIT} daily decodes remaining.{' '}
            <a href="/#complete-kit" style={{ color: TEAL, textDecoration: 'underline', fontWeight: 500 }}>Upgrade for up to 20 per day →</a>
          </p>
        </div>
      )}

      {paid && (
        <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: SUCCESS, fontSize: 18 }}>✓</span>
          <p style={{ fontSize: 14, color: '#14532D', margin: 0 }}><strong>Complete Dispute Kit active</strong> — up to 20 decodes per day + full dispute guidance.</p>
        </div>
      )}

      {/* Textarea */}
      <div>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: INK, marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>
          Paste your EOB text here
        </label>
        <textarea
          style={{
            width: '100%', height: 192, padding: '12px 16px',
            border: `1px solid ${BORDER}`, borderRadius: '12px',
            fontSize: 14, color: INK, background: blocked ? SURFACE : '#fff',
            fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6,
            resize: 'none', outline: 'none', boxSizing: 'border-box',
          }}
          placeholder="Paste the text from your Explanation of Benefits document here. Include the summary table, claim details, and any codes you see..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading || blocked}
          onFocus={e => (e.target.style.borderColor = TEAL)}
          onBlur={e => (e.target.style.borderColor = BORDER)}
        />
        <p style={{ fontSize: 12, color: MUTED, marginTop: 4, fontFamily: 'DM Sans, sans-serif' }}>
          Your data is never stored. Each request is processed privately.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#FEF2F2', border: `1px solid #FECACA`, borderRadius: '12px', padding: '16px' }}>
          <p style={{ fontSize: 14, color: ERROR_RED, margin: 0 }}>{error}</p>
          {blocked && (
            <div style={{ marginTop: 12 }}>
              {PAYMENTS_LIVE ? (
                <a href="/api/create-checkout" style={{
                  display: 'inline-block', background: AMBER, color: INK,
                  fontWeight: 700, padding: '10px 20px', borderRadius: '10px',
                  fontSize: 14, textDecoration: 'none',
                }}>
                  Get Complete Dispute Kit — $29
                </a>
              ) : (
                <span style={{
                  display: 'inline-block', background: '#D1D5DB', color: '#6B7280',
                  fontWeight: 700, padding: '10px 20px', borderRadius: '10px',
                  fontSize: 14, cursor: 'not-allowed',
                }}>
                  Coming Soon — $29
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Button */}
      <button
        onClick={handleDecode}
        disabled={loading || blocked || !text.trim()}
        style={{
          width: '100%', background: blocked ? MUTED : BLUE, color: '#fff',
          fontWeight: 700, padding: '16px', borderRadius: '12px',
          border: 'none', cursor: loading || blocked || !text.trim() ? 'not-allowed' : 'pointer',
          fontSize: 16, fontFamily: 'DM Sans, sans-serif', transition: 'background 0.2s',
          opacity: !text.trim() && !blocked ? 0.6 : 1,
        }}
        onMouseOver={e => { if (!loading && !blocked && text.trim()) (e.currentTarget.style.background = '#243D66'); }}
        onMouseOut={e => { if (!blocked) e.currentTarget.style.background = BLUE; }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Decoding your EOB...
          </span>
        ) : blocked ? 'Daily Limit Reached — Upgrade to Continue' : 'Decode My EOB'}
      </button>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Result */}
      {result && (
        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '28px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontWeight: 700, color: INK, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontFamily: 'DM Sans, sans-serif' }}>
            <svg style={{ width: 20, height: 20, color: SUCCESS }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Your EOB Explained
          </h2>
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: marked(result) as string }} />

          {!paid && (
            <div style={{ marginTop: 24, border: '1px solid #FDE68A', background: '#FFFBEB', borderRadius: '12px', padding: '16px' }}>
              <p style={{ fontWeight: 600, color: '#78350F', margin: '0 0 8px', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>🔒 Paid analysis also includes:</p>
              <ul style={{ fontSize: 13, color: '#92400E', margin: '0 0 14px', padding: '0 0 0 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>• Which of these issues insurers actually reverse (not all are worth fighting)</li>
                <li>• Exact language to use — matched to your specific denial code</li>
                <li>• Which sections of your EOB to challenge and why</li>
                <li>• A ready-to-send dispute letter with PDF download</li>
              </ul>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#78350F', margin: '0 0 10px', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Choose your plan:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* $9 7-Day Pass — Coming Soon (greyed out) */}
                <button disabled style={{
                  display: 'block', width: '100%', textAlign: 'center',
                  background: '#D1D5DB', color: '#6B7280',
                  padding: '9px 16px', borderRadius: '8px', fontSize: 13,
                  fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                  border: 'none', cursor: 'not-allowed',
                }}>
                  Try for $9 — 7-day access (Coming Soon)
                </button>
                {/* $29 Dispute Kit — primary */}
                <a href="https://amitverse58.gumroad.com/l/fsupd" target="_blank" rel="noopener"
                  style={{
                    display: 'block', textAlign: 'center',
                    background: TEAL, color: '#fff',
                    padding: '9px 16px', borderRadius: '8px', fontSize: 13,
                    fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif',
                  }}>
                  Unlock for $29 — permanent + PDF →
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

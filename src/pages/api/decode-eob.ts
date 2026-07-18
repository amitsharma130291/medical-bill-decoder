import type { APIRoute } from 'astro';
import OpenAI from 'openai';

const DAILY_LIMIT = 3;
const PAID_DAILY_LIMIT = 20;
const SESSION_PASS_DAILY_LIMIT = 50;
const COMPLETE_ACCESS_DAILY_LIMIT = 50;

function getTodayKey() {
  const d = new Date();
  return `eob_count_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getPaidTodayKey() {
  const d = new Date();
  return `eob_paid_count_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k.trim(), v.join('=').trim()];
    })
  );
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { eobText } = body;

    if (!eobText || typeof eobText !== 'string' || eobText.trim().length < 10) {
      return new Response(JSON.stringify({ error: 'Please provide valid EOB text.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Rate limiting via cookies only (never trust client-supplied paid/tier in the body)
    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    const todayKey = getTodayKey();
    const count = parseInt(cookies[todayKey] || '0', 10);
    const isPaid = cookies['paid'] === 'true';
    const tier = cookies['tier'] || (isPaid ? 'dispute-kit' : 'free');
    const isCompleteAccess = tier === 'complete-access';
    const isSessionPass = tier === 'session-pass';

    // session-pass: verify the session hasn't expired — if expired, treat as free
    const effectiveTier = (() => {
      if (isSessionPass) {
        const sessionExpires = parseInt(cookies['session_expires'] || '0', 10);
        if (!sessionExpires || sessionExpires <= Date.now()) return 'free';
      }
      return tier;
    })();
    const effectivelyPaid = effectiveTier !== 'free' && isPaid;
    const effectivelySessionPass = effectiveTier === 'session-pass';
    const effectivelyCompleteAccess = effectiveTier === 'complete-access';

    if (!effectivelyPaid && count >= DAILY_LIMIT) {
      return new Response(
        JSON.stringify({ error: 'Daily limit reached. Upgrade to the Complete Dispute Kit for up to 20 decodes per day.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const paidKey = getPaidTodayKey();
    const paidCount = parseInt(cookies[paidKey] || '0', 10);
    // complete-access: 50/day; session-pass: 50/day; dispute-kit: 20/day
    if (effectivelyPaid && effectivelyCompleteAccess && paidCount >= COMPLETE_ACCESS_DAILY_LIMIT) {
      return new Response(
        JSON.stringify({ error: 'You have reached your 50 decode limit for today. Your limit resets at midnight.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (effectivelyPaid && effectivelySessionPass && paidCount >= SESSION_PASS_DAILY_LIMIT) {
      return new Response(
        JSON.stringify({ error: 'You have reached your 50 decode limit for today. Your limit resets at midnight.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (effectivelyPaid && !effectivelyCompleteAccess && !effectivelySessionPass && paidCount >= PAID_DAILY_LIMIT) {
      return new Response(
        JSON.stringify({ error: 'You have reached your 20 decode limit for today. Your limit resets at midnight. Thank you for using the Complete Dispute Kit!' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });
    // all tiers use gpt-4o-mini for consistent unit economics
    const model = 'gpt-4o-mini';

    const systemPrompt = effectivelyPaid
      ? `You are a medical billing expert. Decode the user's Explanation of Benefits (EOB) into plain English. Be concise. Explain in plain English using bullet points. Maximum 400 words.

Provide:
1. A clear summary of what the EOB says in simple terms
2. What the patient actually owes and why
3. Any potential errors or red flags you notice
4. Step-by-step dispute guidance for any suspicious charges
5. Specific next steps the patient should take

Use plain English — no jargon.`
      : `You are a medical billing expert. Decode the user's Explanation of Benefits (EOB) into plain English. Be concise. Explain in plain English using bullet points. Maximum 400 words.

Provide:
1. **Plain English explanation** — what the EOB says in plain terms: what each charge is, what the insurer paid, and what the patient owes
2. **Issues identified** — list each problem or concern by name/type only (e.g. "CO-45 denial code", "possible duplicate charge", "balance billing concern", "bundling error") — name the issue but do not advise on it or explain what to do about it

End your response with this exact closing line:
"To find out which of these issues insurers commonly reverse — and the exact language to use — upgrade to the Dispute Kit."

Do not include any dispute advice, likelihood of success, next steps, or recommendations on what to do. Stop at identifying and naming what is happening and what was found.`;

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Please decode this EOB:\n\n${eobText.slice(0, 8000)}` },
      ],
      max_tokens: 800,
      temperature: 0.3,
    });

    const result = completion.choices[0]?.message?.content || 'Unable to decode EOB. Please try again.';

    // Set rate limit cookie
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const responseHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
    if (!effectivelyPaid) {
      responseHeaders['Set-Cookie'] = `${todayKey}=${count + 1}; expires=${tomorrow.toUTCString()}; path=/; SameSite=Lax`;
    } else {
      // track usage for all paid tiers
      responseHeaders['Set-Cookie'] = `${paidKey}=${paidCount + 1}; expires=${tomorrow.toUTCString()}; path=/; SameSite=Lax`;
    }

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: responseHeaders,
    });
  } catch (err: any) {
    console.error('decode-eob error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

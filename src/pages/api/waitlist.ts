import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body?.email ?? '').trim();

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ success: false, error: 'Valid email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resendApiKey = import.meta.env.RESEND_API_KEY;

    if (resendApiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Medical Bill Decoder <waitlist@eobdecoder.com>',
          to: ['amitsharma00261@gmail.com'],
          subject: 'New Waitlist Sign-up — Medical Bill Decoder',
          html: `<p>New waitlist signup:</p><p><strong>${email}</strong></p>`,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('[waitlist] Resend error:', errText);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to send notification email' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } },
        );
      }
    } else {
      // Graceful fallback — log and succeed so the user isn't left hanging
      console.log('[waitlist] RESEND_API_KEY not set — signup recorded but no email sent:', email);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[waitlist] Unexpected error:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

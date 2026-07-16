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

    const web3formsKey = import.meta.env.WEB3FORMS_ACCESS_KEY;

    if (web3formsKey) {
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: web3formsKey,
            subject: `New waitlist signup: ${email}`,
            from_name: 'EOB Decoder Waitlist',
            email: email,
            message: `New waitlist signup from eobdecoder.com: ${email} at ${new Date().toISOString()}`,
            botcheck: false,
          }),
        });

        const data = await res.json();

        if (!data.success) {
          console.warn('[waitlist] Web3Forms response (server-side may require paid plan):', data.message);
        }
      } catch (err) {
        // Web3Forms server-side calls require paid plan; client-side call in Layout.astro
        // handles the notification for free-plan users.
        console.warn('[waitlist] Web3Forms server-side error (non-fatal):', err);
      }
    } else {
      // No key set — client-side call in Layout.astro still fires if key is set there.
      console.log('[waitlist] WEB3FORMS_ACCESS_KEY not set — client-side submission handles notification for:', email);
    }

    // Always return success so the UI confirms the signup.
    // The client-side Web3Forms call in Layout.astro is the primary notification path.
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

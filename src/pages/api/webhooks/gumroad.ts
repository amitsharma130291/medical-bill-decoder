import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request }) => {
  try {
    const text = await request.text();
    const params = new URLSearchParams(text);
    const body: Record<string, string> = {};
    for (const [key, value] of params.entries()) {
      body[key] = value;
    }

    const isSale =
      body['resource_name'] === 'sale' ||
      body['sale_id'] != null ||
      body['license_key'] != null;

    if (isSale) {
      console.log('[gumroad-webhook] sale event received');

      const email = body['email'];
      const licenseKey = body['license_key'];
      const productName = body['product_name'];
      const fullName = body['full_name'] || '';

      if (email && licenseKey) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const activateUrl = `https://eobdecoder.com/activate?key=${licenseKey}`;
        const greeting = fullName ? `Hi ${fullName.split(' ')[0]},` : 'Hi there,';

        try {
          await resend.emails.send({
            from: 'EOB Decoder <noreply@eobdecoder.com>',
            to: email,
            subject: 'Activate your EOB Decoder access — 1 click',
            html: `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#111;">
  <h1 style="font-size:24px;font-weight:700;margin-bottom:8px;">Your access is ready ✅</h1>
  <p style="color:#555;margin-bottom:24px;">${greeting} Thank you for purchasing the <strong>${productName || 'EOB Decoder'}</strong>. Click the button below to activate your access — it takes one second.</p>
  <a href="${activateUrl}" style="display:inline-block;background:#059669;color:white;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:16px;margin-bottom:24px;">Activate My Access →</a>
  <p style="color:#777;font-size:14px;margin-bottom:4px;">Or paste this link in your browser:</p>
  <p style="color:#0F7B8C;font-size:13px;word-break:break-all;margin-bottom:32px;">${activateUrl}</p>
  <hr style="border:none;border-top:1px solid #eee;margin-bottom:24px;"/>
  <p style="color:#777;font-size:13px;margin-bottom:4px;">Your license key (keep this safe):</p>
  <code style="display:block;font-family:monospace;background:#f5f5f5;padding:10px;border-radius:4px;font-size:13px;letter-spacing:1px;">${licenseKey}</code>
  <p style="color:#999;font-size:12px;margin-top:32px;">eobdecoder.com</p>
</body>
</html>`,
          });
          console.log('[gumroad-webhook] activation email sent to', email);
        } catch (emailErr) {
          console.error('[gumroad-webhook] email send failed:', emailErr);
          // Still return 200 — don't let email failure cause Gumroad to retry
        }
      } else {
        console.log('[gumroad-webhook] sale event missing email or license_key — skipping email');
      }
    } else {
      console.log('[gumroad-webhook] non-sale event, ignoring');
    }
  } catch (err) {
    console.error('[gumroad-webhook] parse error:', err);
  }

  // Always return 200 so Gumroad does not retry
  return new Response('OK', { status: 200 });
};

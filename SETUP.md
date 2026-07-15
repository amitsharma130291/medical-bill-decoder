# Setup Guide

## Paddle Billing Setup

Medical Bill Decoder uses [Paddle Billing](https://www.paddle.com/) for the one-time $19 Complete Dispute Kit purchase. Paddle provides an overlay checkout — no redirect needed.

### Sandbox (testing)
1. Create a sandbox account at https://sandbox-vendors.paddle.com
2. Create a Product (Catalog → Products): "$19 — Complete Dispute Kit" (one-time, not subscription)
3. Create a Price on that product: $19 one-time
4. Note the **Price ID** (starts with `pri_`)
5. Get your **Client Token**: Paddle Dashboard → Developer Tools → Authentication → Client-side token
6. For webhooks: Developer Tools → Notifications → New notification destination
   - URL: `https://eobdecoder.com/api/webhooks/paddle`
   - Events: `transaction.completed`
   - Copy the notification secret → set as `PADDLE_WEBHOOK_SECRET`

### Vercel Environment Variables
```
PADDLE_CLIENT_TOKEN=test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx   # client-side token (safe to expose)
PADDLE_PRICE_ID=pri_xxxxxxxxxxxxxxxxxxxxxxxxxxxx        # price to open in overlay
PADDLE_WEBHOOK_SECRET=pdl_ntfset_xxxxxxxxxxxxxxxxxxxx  # for verifying webhook signatures
PADDLE_ENV=sandbox                                      # remove or set to "production" for live
SITE_URL=https://eobdecoder.com
OPENAI_API_KEY=your_openai_api_key
```

### Going Live
1. Switch to your live Paddle account at https://vendors.paddle.com
2. Copy the product/price (or recreate it — live gets new IDs)
3. Update `PADDLE_CLIENT_TOKEN`, `PADDLE_PRICE_ID`, `PADDLE_WEBHOOK_SECRET` in Vercel
4. Remove `PADDLE_ENV` (or set it to `production`)
5. Re-add the webhook notification endpoint in the live dashboard

## OpenAI Setup
Set `OPENAI_API_KEY` in Vercel env vars. Used for the EOB Decoder (`/api/decode-eob`).

## Vercel Deployment
1. Import the GitHub repo at vercel.com/new
2. Set all env vars from `.env.example`
3. Deploy — the Vercel adapter is already configured in `astro.config.mjs`

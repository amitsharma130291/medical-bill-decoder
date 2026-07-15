# Setup Guide

## LemonSqueezy Payment Setup
1. Create account at https://app.lemonsqueezy.com
2. Create a Store (Settings → Stores)
3. Create a Product: "$19 — Complete Dispute Kit" (one-time, digital)
4. Note your Store ID (from the store URL) and Variant ID (from the product variant)
5. Get your API key: Settings → API → Create API Key
6. Set Vercel env vars: LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID, LEMONSQUEEZY_VARIANT_ID, SITE_URL
7. In LemonSqueezy dashboard: Settings → Webhooks → Add endpoint: https://eobdecoder.com/api/webhooks/lemonsqueezy
   - Events to subscribe: order_created
   - Copy the signing secret → set as LEMONSQUEEZY_WEBHOOK_SECRET

## OpenAI Setup
Set OPENAI_API_KEY in Vercel env vars.

## Vercel Deployment
1. Import the GitHub repo at vercel.com/new
2. Set all env vars from .env.example
3. Deploy — it will use the vercel adapter automatically

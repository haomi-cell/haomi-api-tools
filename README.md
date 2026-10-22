# haomi-api-tools

Payment gateway module: QRIS invoicing with automatic status checks.

## Features

- Invoice creation with unique reference codes (HAO + 10 hex)
- QRIS payment — funds go directly to the merchant's own e-wallet, no intermediary fee
- Unique amount suffix per invoice (+1) to avoid payment collisions
- Status endpoint for checking payments in real time
- Webhook endpoint for payment confirmation matching
- Optional voucher support (create / validate / discount)
- WhatsApp notification on successful payment

## Structure

```
api/haomi-pay.js   — serverless module (Vercel)
```

## Deploy

Vercel-ready. Set your environment variables, then `vercel --prod`.

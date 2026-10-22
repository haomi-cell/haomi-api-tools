<img src="https://capsule-render.vercel.app/api?type=cylinder&color=0:0d1117,50:2e2410,100:0d1117&height=150&section=header&text=haomi-api-tools&fontSize=40&fontColor=e6edf3&fontAlignY=40&desc=payment%20gateway%20engine%20%E2%80%94%20QRIS%2C%20zero-fee%20settlement&descSize=13&descAlignY=60" width="100%"/>

<div align="center">
<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/QRIS-payment-FFD700?style=flat-square&logo=qrcode&logoColor=black"/>
<img src="https://img.shields.io/badge/fee-0%25-brightgreen?style=flat-square"/>
<img src="https://img.shields.io/badge/deploy-Vercel-black?style=flat-square&logo=vercel&logoColor=white"/>
</div>

## Features

- **Invoice engine** — unique reference per transaction (`HAO` + 10 hex)
- **QRIS direct settlement** — funds land in your own e-wallet, no intermediary cut
- **Collision-free amounts** — +1 suffix per active invoice
- **Real-time status endpoint** — check any invoice on demand
- **Webhook matching** — auto-confirm paid invoices
- **Vouchers** — create / validate / apply discounts
- **WhatsApp notification** — instant confirmation on success

## API

```
POST /pay            → create invoice + QRIS
GET  /status/:id     → payment status
GET  /qris/:id.png   → QR image
POST /webhook/notif  → payment confirmation
GET  /health         → uptime check
```

## Deploy

```bash
vercel --prod
```

---
<div align="center"><sub>xMSHaomi</sub></div>

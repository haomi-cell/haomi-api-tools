<div align="center">

<img src="https://capsule-render.vercel.app/api?type=soft&color=0:000000,50:0f2f0f,100:000000&height=180&section=header&text=haomi-api-tools&fontSize=40&fontColor=00ff41&fontAlignY=42&desc=%5B%20payment%20gateway%20%2F%2F%20zero-fee%20protocol%20%5D&descSize=13&descAlignY=62&animation=fadeIn" width="100%"/>

</div>

```bash
root@xMSHaomi:~# cat /projects/pay/README

  >> STATUS    : OPERATIONAL
  >> FEE       : 0.0%  — dana langsung ke DANA merchant
  >> QRIS      : statis asli + nominal unik (+1) anti-bentrok
  >> INVOICE   : HAO + 10 hex uppercase
```

## ⚙ Modules

```bash
root@xMSHaomi:~# tree api/

  └── haomi-pay.js
      ├── [1] invoice engine     → auto-generate HAO+10hex
      ├── [2] qris builder       → QRIS pribadi, dana masuk sendiri
      ├── [3] status checker     → GET /status/:id real-time
      ├── [4] webhook matcher    → auto PAID saat bayaran masuk
      ├── [5] voucher system     → buat / cek / potongan
      └── [6] WA notifier        → kirim konfirmasi otomatis
```

## 🔌 Endpoints

```bash
POST /pay             →  { "amount": 5000 }
GET  /status/:id      →  invoice status
GET  /qris/:id.png    →  QR image
POST /webhook/notif   →  payment confirmation
GET  /health          →  uptime
```

## 🚀 Deploy

```bash
root@xMSHaomi:~# vercel --prod
  ▲ deploying... done [2s]
```

---
<div align="center"><sub>root@xMSHaomi — payment protocol v2</sub></div>

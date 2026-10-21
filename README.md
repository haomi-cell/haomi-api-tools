# HAOMI API Tools — README Struktur Dashboard

> Dokumentasi ini merangkum struktur, tata letak, navigasi, dan fitur web **HAOMI API Tools** v3.0 yang telah dibangun. Berbasis file `public/tools.html` (frontend) dan `api/tools.js` (backend).
> Creator: **𝐱𝙈𝙎𝙃𝙖𝙤𝙢𝙞** © 2026

- **Nama platform:** HAOMI API Tools
- **Deskripsi:** REST API portal untuk developer Indonesia — bot WhatsApp/Telegram, aplikasi web, downloader, AI, dan tools
- **Bahasa antarmuka:** Indonesia dengan label teknis berbahasa Inggris
- **Gaya visual:** dark emerald neon, terminal/developer style, font Outfit + JetBrains Mono
- **Layout:** header atas, navbar sticky glass, 6 halaman terpisah, footer, loader hacker, welcome popup, toast
- **Loading screen:** matrix rain + terminal log + progress bar neon
- **Kredit creator:** 𝐱𝙈𝙎𝙃𝙖𝙤𝙢𝙞 (loading, welcome, footer)

---

## 1. Struktur halaman utama

### 1.1 Head / konfigurasi dokumen
- `lang="id"`, charset UTF-8, viewport responsif
- Google Fonts: **Outfit** (judul/UI) + **JetBrains Mono** (kode/key)
- Tema: dark emerald (`#030d09` background, aksen `#10b981`/`#34d399`/`#a3e635`/`#fbbf24`)
- Animasi: cubic-bezier, fade+slide antar halaman, glow neon

### 1.2 Loader (loading screen)
- `#loader` fullscreen hitam dengan **matrix rain** (karakter Jepang + kode, canvas animasi)
- Terminal log mengetik sendiri: `> bypassing firewall [OK]`, `> injecting endpoints...`, `> access granted`
- Progress bar hijau neon + persentase real-time + status teks bertahap
- Kredit: `ROOT@HAOMI:~# CREATOR: 𝐱𝙈𝙎𝙃𝙖𝙤𝙢𝙞 — SECURE CONNECTION ESTABLISHED`
- Exit fade + zoom setelah ~2,5 detik

### 1.3 Welcome popup (muncul 1× per pengunjung, localStorage)
- Sambutan + ringkasan fitur (400+ tools, daftar gratis)
- **Iklan VIP**: Premium Rp 500/hari, unlimited + custom key
- Tombol "🚀 Mulai Sekarang"
- Kredit creator di bawah

### 1.4 Header (halaman Beranda)
- Logo kotak "H" gradient + `HAOMI•API` (gradient text + glow)
- Tagline: "Tools & API — cepat, stabil, siap pakai"
- Badge chip: 🆓 Free 100 req/hari · 💎 Premium unlimited · ⚡ 400+ endpoint
- Tombol notifikasi 🔔 + badge titik merah (info belum dibaca)
- Panel "📣 Info dari Owner" (pesan teks + gambar + waktu)
- Hero banner premium (gambar `banner.jpg`) → klik menuju halaman Premium

### 1.5 Navbar sticky (semua halaman)
Navbar glass blur, ikut scroll, bisa di-swipe di HP:

1. 🏠 **Beranda** — hero, banner, notif
2. 👤 **Akun** — daftar/login/profil
3. 🧪 **Test API** — playground ala docs
4. 📄 **Docs** — endpoint explorer (398 endpoint)
5. 📂 **Katalog** — kategori tools
6. 💎 **Premium** — plan & pembayaran
7. 👑 **Owner** — panel khusus owner

Tab aktif: glow hijau + highlight. Transisi antar halaman: fade + slide.

---

## 2. Halaman Beranda (`#page-home`)
- Header + badge + notif (lihat 1.3–1.4)
- Hero banner premium: gambar + teks "Mau Unlimited Request?" + harga → klik ke Premium

---

## 3. Halaman Akun (`#page-akun`)

### 3.1 Auth card
- Tab: **Login** / **Daftar Gratis** (bebas, tanpa syarat)
- Register: username (min 3) + password (min 4) + nomor WA opsional (untuk notif pembayaran)
- Login → token sesi 7 hari (localStorage)
- Rate limit: maks 8 percobaan gagal / 15 menit per IP
- Akun owner demo: `owner` / `HAOMI`

### 3.2 Profil (setelah login)
- Avatar inisial (gradient + ring glow), nama, badge plan (FREE abu / PREMIUM emas)
- Member sejak, masa aktif
- **Kartu API Key**: `••••` → Lihat/Sembunyikan, Salin, Custom/Regen (khusus premium)
- **Kuota harian**: progress bar animasi, reset 00:00 WIB
- **Total Request** sejak daftar
- **Perangkat Kamu**: OS, Browser, Layar, Baterai (deteksi otomatis)
- Tombol: Upgrade Premium → halaman Premium, Logout

---

## 4. Halaman Test API (`#page-api`) — playground
- Dropdown endpoint populer (10+) + input parameter
- Tombol **🚀 Execute** → badge **status code** (`200 OK` hijau / error merah) + waktu response (ms)
- **COPY JSON** — salin response
- **Snippet generator**: tab **CURL | NODE.JS | PYTHON | PHP**, klik tab berganti, tombol COPY melayang

---

## 5. Halaman Docs (`#page-docs`) — endpoint explorer
- Data: `endpoints.json` — **398 endpoint, 30 kategori** (ai, downloader, tools, search, maker, game, stalker, dll)
- **Terminal search**: prompt `$` + input `search endpoint path...`
- Filter kategori (tab scroll horizontal)
- List endpoint: badge method **GET** (hijau) / **POST** (biru) + path + kategori
- Klik endpoint → expand **playground per endpoint**:
  - APIKEY otomatis terisi dari key tersimpan
  - Input parameter (auto-detect: url/prompt/query/username/text)
  - Tombol ⚡ Execute → status code + waktu + response JSON
- Maks 120 hasil ditampilkan per pencarian

---

## 6. Halaman Katalog (`#page-katalog`)
- Grid kartu kategori: AI Chat, AI Gambar, AM Premium, Downloader, HD Enhance, Maker, Search & Stalk, Game, PDF & File, dll
- Tiap kartu: ikon dalam kotak gradient, judul, badge FREE/PREMIUM, deskripsi, contoh endpoint

---

## 7. Halaman Premium (`#page-premium`)

### 7.1 Plan & harga (per hari × durasi)
| Plan | Harga | Limit | Fitur |
|------|-------|-------|-------|
| FREE | Rp 0 | 100 req/hari | endpoint umum |
| PREMIUM | Rp 500/hari (minggu 3.500 / bulan 15.000 / custom) | unlimited | semua endpoint + custom key |
| PRO | Rp 1.100/hari | unlimited + prioritas | semua + eksklusif |

### 7.2 Voucher
- Kolom kode voucher di halaman bayar → potongan Rp otomatis + QRIS ter-update
- **Voucher public**: daftar voucher aktif ditampilkan ke semua user (kode, potongan, sisa kuota)
- Salah/habis → ditolak + sindiran

### 7.3 Pembayaran QRIS otomatis
- `buy` → invoice gateway QRIS (fee ~Rp 108) → QRIS tampil di web
- `checkpay` → status lunas → premium aktif otomatis + **notif WA ke user** (jika terdaftar)

### 7.4 Fallback manual (gateway gangguan)
- QRIS statis `/qris-manual.jpg` + instruksi lengkap
- Upload **bukti TF + nominal** → terkirim ke WA owner (data lengkap user) → antrean verifikasi
- Owner ACC/tolak dari panel

---

## 8. Halaman Owner (`#page-owner`)

Akses via **Owner Key** (atau akun demo owner — key = owner key):

| Fitur | Fungsi |
|-------|--------|
| 📈 Statistik | Total user, free/premium, request hari ini, storage mode |
| 👥 Kelola User | Upgrade premium, reset limit, hapus user, set limit |
| 🧾 Verifikasi | ACC/tolak bukti transfer manual |
| 🎟 Voucher | Buat (kode, potongan, batas) / hapus / daftar |
| 📣 Broadcast | Kirim info **teks + gambar** ke semua user |
| 🔐 Reset Password | Daftar & ACC/tolak permintaan lupa password |
| 🚫 Ban/Unban | Blokir user (roast toxic) / buka blokir |
| 💰 Pendapatan | Total & hari ini (dari riwayat invoice) |
| 📤 Export CSV | Unduh semua user (username, plan, usage, key) |
| 💲 Edit Harga | Ubah harga plan per hari langsung dari panel |

---

## 9. Sistem roast (anti-curang)
Pesan sindiran otomatis untuk: key palsu, limit maksa, maksa fitur premium, nunda bayar, spam error 5×, user diblokir. Contoh: "Maling API 😂 Key-nya aja palsu. Daftar dulu sana, jangan ngintil!"

---

## 10. Backend & keamanan (`api/tools.js`)
- **Storage dual-mode**: Upstash Redis (permanen, via env) / in-memory demo
- Prefix key: `u:` user, `k:` apikey, `s:` sesi, `inv:` invoice, `pr:` bukti TF, `v:` voucher, `bc:` broadcast, `fp:` reset password
- **Password hashing**: scrypt (salt unik per user, setara bcrypt)
- **Sesi expired 7 hari**
- **Rate limit auth**: 8 gagal / 15 menit per IP
- Error/upstream down → pesan branding HAOMI (pihak ketiga tak pernah tampil)
- Header respons proxy: `X-Plan`, `X-RateLimit-Used`

### Action API (POST `/api/auth`)
- User: `register`, `login`, `logout`, `profile`, `plans`, `buy`, `checkpay`, `submitproof`, `customkey`, `notif`, `forgot`, `checkvoucher`, `public_vouchers`
- Owner: `owner_stats`, `owner_users`, `upgrade`, `owner_reset`, `owner_delete`, `owner_ban`, `owner_unban`, `owner_voucher`, `owner_vdel`, `owner_proofs`, `owner_verify`, `owner_broadcast`, `owner_forgot`, `owner_forgot_acc`, `owner_forgot_del`, `owner_export`, `owner_setprice`, `owner_revenue`

### Proxy endpoint
- Semua path API lain di-proxy ke upstream dengan key user: `/api/ai/...`, `/api/downloader/...`, dll
- Status page publik: `/api/status` (web, auth, upstream, storage, latency)

---

## 11. Footer
- `© 2026 HAOMI API Tools v3.0 — Creator 𝐱𝙈𝙎𝙃𝙖𝙤𝙢𝙞 ⚡`
- Glow hijau, font mono

---

## 12. Daftar navigasi ringkas

```text
HAOMI API TOOLS
├── Loader (matrix rain + terminal + progress)
├── Welcome Popup + Iklan VIP (1× per pengunjung)
├── Navbar Sticky (glass blur)
│   ├── 🏠 Beranda
│   ├── 👤 Akun (Login/Daftar → Profil)
│   ├── 🧪 Test API (playground + snippet)
│   ├── 📄 Docs (398 endpoint explorer)
│   ├── 📂 Katalog (kategori tools)
│   ├── 💎 Premium (plan + QRIS + voucher)
│   └── 👑 Owner (panel lengkap)
├── Global
│   ├── Notif 🔔 (broadcast teks+gambar, read/unread)
│   ├── Toast
│   └── Roast system
└── Footer (kredit creator)
```

---

## 13. Deploy ringkas
1. Push ke GitHub → import ke Vercel
2. Env vars: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (wajib untuk production), `PAY_API_KEY`, `OWNER_WA`
3. Live → semua fitur aktif

*© 2026 HAOMI API Tools — Creator 𝐱𝙈𝙎𝙃𝙖𝙤𝙢𝙞. All rights reserved.*

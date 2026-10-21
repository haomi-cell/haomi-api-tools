// HAOMI API Tools v3 — Portal API lengkap
// Fitur: register, login, profil, free/premium, custom key, proxy 400+ tools upstream
// Storage: Upstash Redis (production) atau in-memory (demo)

"use strict";

const crypto = require("crypto");

const BASE_URL = process.env.UPSTREAM_BASE_URL || "https://api.upstreamxd.my.id";
const MASTER_KEY = process.env.UPSTREAM_API_KEY || "upstream_sTl9OLzPIyMn";
const OWNER_KEY = process.env.HAOMI_OWNER_KEY || "Hao-g6k-y86-7gj";
const FREE_DAILY_LIMIT = parseInt(process.env.FREE_DAILY_LIMIT || "100");

// Upstash (opsional): set UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN
const UP_URL = process.env.UPSTASH_REDIS_REST_URL || "";
const UP_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || "";
const USE_REDIS = !!(UP_URL && UP_TOKEN);

// ---------- Storage layer ----------
const mem = { users: new Map(), sessions: new Map() }; // demo fallback

async function redis(cmd, ...args) {
  const r = await fetch(UP_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${UP_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify([cmd, ...args]),
  });
  const j = await r.json();
  return j.result;
}

async function sGet(key) {
  if (USE_REDIS) {
    const raw = await redis("GET", key);
    return raw ? JSON.parse(raw) : null;
  }
  if (key.startsWith("k:")) return mem.users.get(key) || null;
  if (key.startsWith("u:")) return mem.users.get(key) || null;
  if (key.startsWith("s:") || key.startsWith("inv:") || key.startsWith("pr:") || key.startsWith("v:") || key.startsWith("bc:") || key.startsWith("fp:")) return mem.sessions.get(key) || null;
  return null;
}
async function sSet(key, val) {
  if (USE_REDIS) return redis("SET", key, JSON.stringify(val));
  if (key.startsWith("k:")) mem.users.set(key, val);
  if (key.startsWith("u:")) mem.users.set(key, val);
  if (key.startsWith("s:") || key.startsWith("inv:") || key.startsWith("pr:") || key.startsWith("v:") || key.startsWith("bc:") || key.startsWith("fp:")) mem.sessions.set(key, val);
}
async function sDel(key) {
  if (USE_REDIS) return redis("DEL", key);
  if (key.startsWith("u:")) mem.users.delete(key);
  if (key.startsWith("s:") || key.startsWith("inv:") || key.startsWith("pr:") || key.startsWith("v:") || key.startsWith("bc:") || key.startsWith("fp:")) mem.sessions.delete(key);
}

// ---------- Helpers ----------
// password hash via scrypt (algoritma hashing kuat, bawaan Node — setara bcrypt)
function hash(pw) {
  const salt = crypto.randomBytes(16).toString("hex");
  const h = crypto.scryptSync(String(pw), salt, 32).toString("hex");
  return `sc$${salt}$${h}`;
}
function verifyPw(pw, stored) {
  if (!stored) return false;
  if (!stored.startsWith("sc$")) { // legacy sha256
    return crypto.createHash("sha256").update(String(pw) + "haomi-salt").digest("hex") === stored;
  }
  const [, salt, h] = stored.split("$");
  return crypto.scryptSync(String(pw), salt, 32).toString("hex") === h;
}
const today = () => new Date().toISOString().slice(0, 10);
const randTok = () => crypto.randomBytes(24).toString("hex");

function newKey() {
  const seg = () => Array.from({ length: 3 }, () =>
    "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]
  ).join("");
  return `Hao-${seg()}-${seg()}-${seg()}`;
}
const KEY_RE = /^Hao-[a-z0-9]{3}-[a-z0-9]{3}-[a-z0-9]{3}$/;

function sendJson(res, code, obj) {
  res.setHeader("Content-Type", "application/json");
  res.status(code).json(obj);
}

async function proxyUpstream(path, params, method = "GET", body = null, upload = null) {
  const url = new URL(path, BASE_URL);
  url.searchParams.set("apikey", MASTER_KEY);
  if (params) for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  }
  const opts = { method, headers: {} };
  if (upload) opts.body = upload;
  else if (body && method === "POST") {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  let res;
  try {
    res = await fetch(url.toString(), opts);
  } catch {
    return { success: false, message: "Server HAOMI sedang sibuk / maintenance, coba lagi sebentar ya 🙏" };
  }
  const ctype = res.headers.get("content-type") || "";
  if (res.status >= 500 || res.status === 522 || res.status === 404 && !ctype.includes("application/json")) {
    // server sedang bermasalah — pesan branding sendiri, jangan bocorkan error pihak ketiga
    return { success: false, message: "Server HAOMI sedang sibuk / maintenance, coba lagi sebentar ya 🙏" };
  }
  if (ctype.includes("application/json")) return res.json();
  const text = await res.text();
  return { statusCode: res.status, raw: text.slice(0, 5000) };
}

async function validateAndCount(apikey) {
  const rec = await sGet(`k:${apikey}`);
  if (!rec) return { ok: false, reason: pick(ROAST.fakekey) };
  if (rec.banned) return { ok: false, banned: true, reason: pick(ROAST.banned) };
  if (rec.usedDate !== today()) { rec.used = 0; rec.usedDate = today(); }
  if (rec.plan === "free" && rec.used >= FREE_DAILY_LIMIT)
    return { ok: false, reason: pick(ROAST.limit) };
  rec.used += 1;
  rec.totalUsed = (rec.totalUsed || 0) + 1;
  await sSet(`k:${apikey}`, rec);
  return { ok: true, rec, plan: rec.plan };
}

// ---------- Payment gateway (QRIS otomatis) ----------
const PAY_BASE = "https://api.sairibot.my.id";
const PAY_KEY = process.env.PAY_API_KEY || "SKY_39575737d3d744d8";
const OWNER_WA = process.env.OWNER_WA || "6282231669053"; // nomor WA owner (format internasional tanpa +)


// Harga per role: harian ditentukan, total = harga/hari × jumlah hari
const PLANS = {
  premium: {
    label: "PREMIUM PLAN",
    tagline: "Unlimited request + custom API key",
    perDay: 500, minDays: 7,
    feats: [
      "Unlimited request / hari (bebas limit)",
      "Ganti API Key sendiri (custom key)",
      "Akses SEMUA endpoint FREE & Premium",
      "Downloader 50+ situs (TikTok, YT, IG, FB)",
      "AI Chat + AI Gambar unlimited",
      "HD Enhance foto & video",
      "Maker: brat, QC, fake chat",
      "Support via owner WhatsApp",
    ],
  },
  pro: {
    label: "PRO PLAN",
    tagline: "Prioritas server + semua fitur Premium",
    perDay: 1200, minDays: 7,
    feats: [
      "SEMUA fitur Premium Plan",
      "Priority Queue — server prioritas dulu",
      "Akses endpoint eksklusif (AM Premium bulk, dll)",
      "Rate-limit lebih longgar",
      "Admin support 24 jam prioritas langsung owner",
      "Cocok untuk bot produksi & high traffic",
    ],
  },
};
const planTotal = (p, days) => ({ days, amount: p.perDay * days, label: days >= 30 ? "BULANAN" : "MINGGUAN" });

async function payInvoice(amount) {
  const r = await fetch(`${PAY_BASE}/api/invoice?apikey=${encodeURIComponent(PAY_KEY)}&amount=${amount}`);
  return r.json();
}
async function payStatus(invoiceId) {
  const r = await fetch(`${PAY_BASE}/api/invoice/status?apikey=${encodeURIComponent(PAY_KEY)}&invoice_id=${encodeURIComponent(invoiceId)}`);
  return r.json();
}

// ---------- Pesan "toxic" otomatis (sindiran) ----------
const ROAST = {
  fakekey: [
    "Maling API 😂 Key-nya aja palsu. Daftar dulu sana, jangan ngintil!",
    "Key ngasal detected 🤡 Miskin API, gembel mode: ON. Daftar gratis kok, capek-curangnya!",
    "Pakai key bohongan? Busuk dah 😹 Nggak bayar nggak apa-apa, daftar gratis ada — malah curang.",
  ],
  limit: [
    "Limit habis masih maksa aja 😂 Sabar dikit, gembel! Upgrade premium tuh murah, kok ngotot gratisan 💀",
    "Kuota free-nya udah kelar, masih dikasih 100 req/hari masih ngeluh 🤡 Miskin mode: verified ✅",
    "Maksa terus... kentang banget 😹 Free udah dikasih 100/hari itu beneran banyak, bos. Bayar dikit gak ngaruh!",
  ],
  premiumonly: [
    "Fitur premium dilarang masuk buat akun miskin 😂 Upgrade dulu sana, jangan sok kuasa!",
    "Eh gembel, ini khusus premium 💀 Jangan maksa, malu dikit sok 😹",
  ],
  unpaid: [
    "QRIS udah disodorkan masih blom dibayar 🤡 Miskin bgt sampe nunda-nunda, cepek deh!",
    "Belum dibayar? Ngarep premium gratisan dasar busuk 😹 Scan dulu sana!",
  ],
  spam: [
    "Spam error terus, udah kejelas errornya masih diulang 😂 Tenangin dulu dirimu!",
    "Bengong? Error diulang terus 🤡 Pikir dulu, jangan maksa server-ku capek!",
  ],
  banned: [
    "LU KENA BLOKIR GOBLOK 😂 Miskin + meresahkan + nyusahin = babar bolak-balik! Jangan balik-balik sana! 💀",
    "DIBLOKIR OWNER, DASAR BEGO 😹 Udah dikasih gratisan masih bandel? BEROTAK KENTANG, MISKIN BUSUK, GEMBEL PARAH! Jangan nuhun lagi sana! 🤡",
    "Waduh yang diblokir datang lagi 🗿 Kepala botak mikirnya juga bolong? LU TELAH DIHAPUS DARI PERADABAN INI! Gembel tolol, jangan ganggu server orang! 💀🔥",
  ],
};
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
// hitung request gagal beruntun utk deteksi spam/maksa
const failStreak = new Map();
const authFails = new Map(); // rate limit login/register per IP
function authTooMany(ip) {
  const rec = authFails.get(ip) || { n: 0, t: Date.now() };
  if (Date.now() - rec.t > 15 * 60 * 1000) { rec.n = 0; rec.t = Date.now(); }
  authFails.set(ip, rec);
  return rec.n >= 8; // maks 8 percobaan gagal / 15 menit
}
function authFail(ip) { const r = authFails.get(ip); if (r) r.n++; }
const getIp = (req) => (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "local";

// ---------- Handler ----------
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  const url = new URL(req.url, "http://x");
  const qp = url.searchParams;
  const ep = qp.get("_ep");
  let route;
  if (ep) route = ep;
  else {
    const parts = url.pathname.split("/").filter(Boolean);
    route = parts.slice(1).join("/");
  }

  const readBody = () => {
    if (req.body && typeof req.body === "object") return req.body;
    try { return JSON.parse(req.body || "{}"); } catch { return {}; }
  };

  try {
    // ============ AUTH & ACCOUNT ============
    if (route === "auth") {
      const body = readBody();
      const action = body.action || qp.get("action");

      // akun owner demo (username: owner / password: HAOMI) — API key = OWNER_KEY agar owner panel terbuka
      if (!await sGet("u:owner")) {
        const ownerUser = { username: "owner", pass: hash("HAOMI"), plan: "premium", used: 0, usedDate: today(), created: new Date().toISOString(), apikey: OWNER_KEY, wa: OWNER_WA };
        await sSet("u:owner", ownerUser);
        await sSet(`k:${OWNER_KEY}`, ownerUser);
      }

      if (action === "register") {
        if (authTooMany(getIp(req))) return sendJson(res, 429, { success: false, message: "Terlalu banyak percobaan. Tunggu 15 menit, jangan maksa 💀" });
        const { username, password } = body;
        if (!username || !password || String(password).length < 4)
          return sendJson(res, 400, { success: false, message: "username & password (min 4 char) wajib" });
        const uname = String(username).toLowerCase().replace(/[^a-z0-9_]/g, "");
        if (uname.length < 3) return sendJson(res, 400, { success: false, message: "username min 3 char (huruf/angka/underscore)" });
        if (String(password).length > 72) return sendJson(res, 400, { success: false, message: "password maks 72 karakter" });
        if (await sGet(`u:${uname}`)) return sendJson(res, 409, { success: false, message: "username sudah terdaftar" });
        const apikey = newKey();
        const waNum = String(body.wa || "").replace(/[^0-9]/g, "");
        const user = { username: uname, pass: hash(password), plan: "free", used: 0, usedDate: today(), created: new Date().toISOString(), apikey, wa: waNum || null };
        await sSet(`u:${uname}`, user);
        await sSet(`k:${apikey}`, user);
        return sendJson(res, 200, { success: true, message: `Selamat datang, ${uname}!`, username: uname, plan: "free", apikey });
      }

      if (action === "login") {
        if (authTooMany(getIp(req))) return sendJson(res, 429, { success: false, message: "Terlalu banyak percobaan login. Tunggu 15 menit, gembel sabar 💀" });
        const { username, password } = body;
        const uname = String(username || "").toLowerCase();
        const user = await sGet(`u:${uname}`);
        if (!user || !verifyPw(password || "", user.pass)) authFail(getIp(req));
        if (user && user.banned && verifyPw(password || "", user.pass))
          return sendJson(res, 403, { success: false, banned: true, message: pick(ROAST.banned) });
        if (!user || !verifyPw(password || "", user.pass))
          return sendJson(res, 401, { success: false, message: "username atau password salah" });
        const token = randTok();
        await sSet(`s:${token}`, { username: uname, exp: Date.now() + 7 * 864e5 }); // sesi 7 hari
        return sendJson(res, 200, { success: true, token, username: uname, plan: user.plan, apikey: user.apikey });
      }

      if (action === "profile") {
        const auth = qp.get("token") || body.token;
        const sess = await sGet(`s:${auth}`);
        if (!sess || (sess.exp && sess.exp < Date.now())) { await sDel(`s:${auth}`); return sendJson(res, 401, { success: false, message: "sesi habis — login lagi" }); }
        const user = await sGet(`u:${sess.username}`);
        if (!user) return sendJson(res, 404, { success: false, message: "user tidak ditemukan" });
        return sendJson(res, 200, {
          success: true,
          username: user.username, plan: user.plan, apikey: user.apikey,
          used_today: user.usedDate === today() ? user.used : 0,
          total_used: user.totalUsed || user.used || 0,
          limit: user.plan === "free" ? FREE_DAILY_LIMIT : "unlimited",
          paid_until: user.paidUntil || null,
          created: user.created,
          history: user.history || [],
          owner: user.apikey === OWNER_KEY,
        });
      }

      // kirim bukti TF manual → diteruskan ke WA owner + masuk antrean ACC
      if (action === "submitproof") {
        const sess = await sGet(`s:${body.token}`);
        if (!sess) return sendJson(res, 401, { success: false, message: "sesi habis — login lagi" });
        const meta = await sGet(`inv:${body.invoice_id}`);
        if (!meta || meta.username !== sess.username) return sendJson(res, 404, { success: false, message: "invoice tidak ditemukan" });
        const nominal = parseInt(body.nominal);
        if (!nominal || nominal < 1000) return sendJson(res, 400, { success: false, message: "Nominal tidak valid" });
        if (!body.proof || String(body.proof).length < 20) return sendJson(res, 400, { success: false, message: "Bukti transfer wajib (screenshot)" });
        const user = await sGet(`u:${sess.username}`);
        const proofRec = {
          invoice_id: body.invoice_id, username: sess.username, plan: meta.plan, days: meta.days,
          nominal, proof: String(body.proof).slice(0, 300000),
          userkey: user ? user.apikey : "-", created: new Date().toISOString(), status: "menunggu",
        };
        await sSet(`pr:${body.invoice_id}`, proofRec);
        // kirim notif lengkap ke WA owner via gateway notif (best-effort)
        const waText = encodeURIComponent(
          `🔔 *BUKTI TF MASUK — HAOMI API Tools*\n\n` +
          `👤 User: ${proofRec.username}\n` +
          `🔑 Key: ${proofRec.userkey}\n` +
          `💎 Plan: ${meta.plan.toUpperCase()} (${meta.days} hari)\n` +
          `💵 Nominal diklaim: Rp ${nominal.toLocaleString('id-ID')}\n` +
          `🧾 Invoice: ${body.invoice_id}\n` +
          `🕐 Waktu: ${proofRec.created}\n\n` +
          `Bukti TF: ${body.proofUrl || '(screenshot terlampir di dashboard owner)'}\n\n` +
          `✅ ACC manual di web: bagian OWNER PANEL → Verifikasi Pembayaran`
        );
        let waSent = false;
        try {
          const wr = await fetch(`${PAY_BASE}/api/wa/send?apikey=${encodeURIComponent(PAY_KEY)}&target=${OWNER_WA}&message=${waText}`);
          waSent = wr.ok;
        } catch { waSent = false; }
        return sendJson(res, 200, { success: true, wa_sent: waSent, message: "Bukti terkirim! Menunggu ACC owner — kamu akan diaktifkan setelah diverifikasi ✅" });
      }

      // OWNER: daftar bukti TF menunggu ACC
      if (action === "owner_proofs") {
        if (body.adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        const all = [...mem.sessions.keys()].filter(k => k.startsWith("pr:"));
        const proofs = [];
        for (const k of all) { const p = await sGet(k); if (p && p.status === "menunggu") proofs.push(p); }
        return sendJson(res, 200, { success: true, proofs });
      }

      // OWNER: ACC / tolak bukti TF
      if (action === "owner_verify") {
        const { adminkey, invoice_id, approve } = body;
        if (adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        const p = await sGet(`pr:${invoice_id}`);
        if (!p) return sendJson(res, 404, { success: false, message: "bukti tidak ditemukan" });
        const user = await sGet(`u:${p.username}`);
        if (approve) {
          if (user) {
            user.plan = "premium";
            user.paidUntil = Date.now() + p.days * 864e5;
            await sSet(`u:${p.username}`, user);
            await sSet(`k:${user.apikey}`, user);
          }
          p.status = "disetujui";
        } else {
          p.status = "ditolak";
        }
        await sSet(`pr:${invoice_id}`, p);
        // notif hasil ke WA owner
        try {
          const waText = encodeURIComponent(approve
            ? `✅ ACC: ${p.username} → ${p.plan.toUpperCase()} ${p.days} hari (Rp ${p.nominal.toLocaleString('id-ID')})`
            : `❌ DITOLAK: bukti TF ${p.username} (Rp ${p.nominal.toLocaleString('id-ID')})`);
          await fetch(`${PAY_BASE}/api/wa/send?apikey=${encodeURIComponent(PAY_KEY)}&target=${OWNER_WA}&message=${waText}`);
        } catch {}
        return sendJson(res, 200, { success: true, message: approve ? `✅ ${p.username} diaktifkan (${p.plan} ${p.days} hari)` : `❌ Bukti ${p.username} ditolak` });
      }

// ---------- Voucher ----------
// kode: { potongan: Rp, maxPakai: n, terpakai: n, dibuat: ts, aktif: true }
async function vSet(code, val) { return sSet(`v:${code}`, val); }
async function vGet(code) { return sGet(`v:${code}`); }

// OWNER: buat voucher (potongan Rp, batas pemakaian)
      if (action === "owner_voucher") {
        const { adminkey, code, potongan, maxpakai } = body;
        if (adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        const kode = String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
        if (kode.length < 4) return sendJson(res, 400, { success: false, message: "Kode voucher min 4 huruf/angka" });
        const pot = parseInt(potongan);
        if (!pot || pot < 500) return sendJson(res, 400, { success: false, message: "Potongan min Rp 500" });
        const max = parseInt(maxpakai) || 1;
        if (await vGet(kode)) return sendJson(res, 409, { success: false, message: "Kode voucher sudah ada" });
        await vSet(kode, { potongan: pot, maxPakai: max, terpakai: 0, dibuat: new Date().toISOString(), aktif: true });
        return sendJson(res, 200, { success: true, message: `Voucher ${kode} dibuat — potongan Rp ${pot.toLocaleString("id-ID")}, batas ${max}x pemakaian` });
      }

      // OWNER: daftar voucher
      if (action === "owner_vouchers") {
        if (body.adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        const all = [...mem.sessions.keys()].filter(k => k.startsWith("v:"));
        const vouchers = [];
        for (const k of all) { const v = await sGet(k); if (v) vouchers.push({ kode: k.slice(2), ...v }); }
        return sendJson(res, 200, { success: true, vouchers });
      }

      // OWNER: hapus voucher
      if (action === "owner_vdel") {
        if (body.adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        const kode = String(body.code || "").toUpperCase();
        if (!(await vGet(kode))) return sendJson(res, 404, { success: false, message: "Voucher tidak ada" });
        await sDel(`v:${kode}`);
        return sendJson(res, 200, { success: true, message: `Voucher ${kode} dihapus` });
      }

      // PUBLIC: daftar voucher aktif (untuk ditampilkan ke semua user)
      if (action === "public_vouchers") {
        const all = [];
        for (const [k, v] of mem.sessions) {
          if (k.startsWith("v:")) {
            const vv = v;
            if (vv && vv.aktif && vv.terpakai < vv.maxPakai) all.push({ kode: k.slice(2), potongan: vv.potongan, sisa: vv.maxPakai - vv.terpakai });
          }
        }
        return sendJson(res, 200, { success: true, vouchers: all });
      }

      // USER: pakai voucher saat beli → dapatkan potongan
      if (action === "checkvoucher") {
        const kode = String(body.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
        const v = await vGet(kode);
        if (!v || !v.aktif) return sendJson(res, 404, { success: false, message: "Voucher tidak valid / kedaluwarsa" });
        if (v.terpakai >= v.maxPakai) return sendJson(res, 410, { success: false, message: "Voucher sudah habis dipakai orang 😂 kecewa berat" });
        return sendJson(res, 200, { success: true, kode, potongan: v.potongan, sisa: v.maxPakai - v.terpakai });
      }

      // OWNER: blokir user (ban)
      if (action === "owner_ban") {
        if (body.adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        const uname = String(body.username || "").toLowerCase();
        const user = await sGet(`u:${uname}`);
        if (!user) return sendJson(res, 404, { success: false, message: "user tidak ditemukan" });
        user.banned = true;
        await sSet(`u:${uname}`, user);
        await sSet(`k:${user.apikey}`, user);
        return sendJson(res, 200, { success: true, message: `🚫 ${uname} diblokir — RIP bolos 😈` });
      }

      // OWNER: unban
      if (action === "owner_unban") {
        if (body.adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        const uname = String(body.username || "").toLowerCase();
        const user = await sGet(`u:${uname}`);
        if (!user) return sendJson(res, 404, { success: false, message: "user tidak ditemukan" });
        user.banned = false;
        await sSet(`u:${uname}`, user);
        await sSet(`k:${user.apikey}`, user);
        return sendJson(res, 200, { success: true, message: `✅ ${uname} di-unban. Kasih kesempatan terakhir ya!` });
      }

      // OWNER: kirim broadcast info ke semua user (teks + gambar opsional)
      if (action === "owner_broadcast") {
        if (body.adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        const text = String(body.text || "").trim();
        const img = String(body.image || "");
        if (text.length < 3 && !img) return sendJson(res, 400, { success: false, message: "Tulis pesan atau sertakan gambar" });
        const bc = { text: text.slice(0, 1000), image: img.startsWith("data:image/") ? img.slice(0, 500000) : null, time: new Date().toISOString() };
        await sSet("bc:latest", bc);
        return sendJson(res, 200, { success: true, message: bc.image ? "📣 Broadcast (teks + gambar) terkirim ke semua user!" : "📣 Broadcast terkirim ke semua user!" });
      }

      // USER: ambil notif terakhir dari owner
      if (action === "notif") {
        const bc = await sGet("bc:latest");
        if (!bc) return sendJson(res, 200, { success: true, notif: null });
        return sendJson(res, 200, { success: true, notif: bc });
      }

      // lupa password: user minta reset (username + password baru) → ACC owner
      if (action === "forgot") {
        const uname = String(body.username || "").toLowerCase().replace(/[^a-z0-9_]/g, "");
        const np = String(body.newpass || "");
        if (!uname || np.length < 4) return sendJson(res, 400, { success: false, message: "username & password baru (min 4) wajib" });
        const user = await sGet(`u:${uname}`);
        if (!user) return sendJson(res, 404, { success: false, message: "username tidak terdaftar" });
        const reqId = "fr" + crypto.randomBytes(6).toString("hex");
        await sSet(`fp:${reqId}`, { username: uname, newpass: hash(np), waktu: new Date().toISOString() });
        // kirim WA owner
        try {
          await fetch(`${PAY_BASE}/api/wa/send?apikey=${PAY_KEY}&target=${OWNER_WA}&message=${encodeURIComponent("🔐 PERMINTAAN RESET PASSWORD HAOMI\n\nUser: " + uname + "\nID: " + reqId + "\n\nACC di Owner Panel web")}`);
        } catch (e) {}
        return sendJson(res, 200, { success: true, message: "Permintaan reset dikirim. Tunggu ACC owner (cek WA owner).", req_id: reqId });
      }

      // OWNER: daftar & ACC/tolak reset password
      if (action === "owner_forgot") {
        if (body.adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        const all = [];
        for (const [k, v] of mem.sessions) if (k.startsWith("fp:")) all.push({ id: k.slice(3), ...v });
        return sendJson(res, 200, { success: true, requests: all });
      }
      if (action === "owner_forgot_acc") {
        if (body.adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        const rec = await sGet(`fp:${body.id}`);
        if (!rec) return sendJson(res, 404, { success: false, message: "Permintaan tidak ada" });
        const user = await sGet(`u:${rec.username}`);
        if (user) { user.pass = rec.newpass; await sSet(`u:${rec.username}`, user); }
        await sDel(`fp:${body.id}`);
        return sendJson(res, 200, { success: true, message: `Password ${rec.username} direset ✓` });
      }
      if (action === "owner_forgot_del") {
        if (body.adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        await sDel(`fp:${body.id}`);
        return sendJson(res, 200, { success: true, message: "Permintaan ditolak & dihapus" });
      }

      if (action === "logout") {
        await sDel(`s:${body.token || qp.get("token")}`);
        return sendJson(res, 200, { success: true, message: "logout OK" });
      }

      // ====== PEMBAYARAN (QRIS otomatis) ======
      // lihat daftar role + harga
      if (action === "plans") {
        return sendJson(res, 200, { success: true, plans: Object.entries(PLANS).map(([id, p]) => ({
          id, label: p.label, tagline: p.tagline, perDay: p.perDay, minDays: p.minDays, feats: p.feats,
          weekly: p.perDay * 7, monthly: p.perDay * 30,
        })) });
      }

      // buat invoice QRIS untuk upgrade role (days: 7 mingguan / 30 bulanan / custom min 3)
      if (action === "buy") {
        const sess = await sGet(`s:${body.token}`);
        if (!sess) return sendJson(res, 401, { success: false, message: "sesi habis — login lagi" });
        const plan = PLANS[body.plan];
        if (!plan) return sendJson(res, 400, { success: false, message: "role tidak ada" });
        let days = parseInt(body.days) || 30;
        if (days < 3) days = 3;
        if (days > 365) days = 365;
        const total0 = plan.perDay * days;
        // voucher opsional: potongan harga
        let total = total0, vcode = null;
        if (body.voucher) {
          const kode = String(body.voucher).toUpperCase().replace(/[^A-Z0-9]/g, "");
          const v = await vGet(kode);
          if (v && v.aktif && v.terpakai < v.maxPakai) {
            total = Math.max(1000, total0 - v.potongan);
            vcode = kode;
            v.terpakai += 1;
            await vSet(kode, v);
          } else {
            return sendJson(res, 400, { success: false, message: "Voucher tidak valid / habis — jangan ngasal 🤡" });
          }
        }
        let inv;
        try { inv = await payInvoice(total); } catch { inv = null; }
        // gateway gangguan → fallback QRIS manual statis + alur bukti TF
        if (!inv || !inv.invoice_id) {
          const manualId = "MANUAL-" + Date.now().toString(36).toUpperCase();
          await sSet(`inv:${manualId}`, { username: sess.username, plan: body.plan, days, manual: true, created: Date.now(), total });
          const rm = await sGet(`u:${sess.username}`);
          if (rm) { rm.history = rm.history || []; rm.history.unshift({ t: Date.now(), jenis: "manual", plan: body.plan, days, total, id: manualId }); rm.history = rm.history.slice(0, 20); await sSet(`u:${sess.username}`, rm); }
          return sendJson(res, 200, {
            success: true, manual: true, invoice_id: manualId, plan: body.plan, days,
            total: total,
            message: "Sistem pembayaran otomatis sedang gangguan 🙏 Silakan bayar MANUAL pakai QRIS statis di bawah, lalu upload bukti TF + nominal.",
            qris_image: "/qris-manual.jpg",
          });
        }
        await sSet(`inv:${inv.invoice_id}`, { username: sess.username, plan: body.plan, days, created: Date.now(), total: inv.total, voucher: vcode });
        // catat riwayat transaksi user
        const ru = await sGet(`u:${sess.username}`);
        if (ru) { ru.history = ru.history || []; ru.history.unshift({ t: Date.now(), jenis: "invoice", plan: body.plan, days, total: inv.total, voucher: vcode, id: inv.invoice_id }); ru.history = ru.history.slice(0, 20); await sSet(`u:${sess.username}`, ru); }
        return sendJson(res, 200, { success: true, invoice_id: inv.invoice_id, amount: inv.amount, fee: inv.fee, total: inv.total, qris_image: inv.qris_image, expired_at: inv.expired_at, plan: body.plan, days });
      }

      // cek status bayar — kalau paid, role otomatis aktif
      if (action === "checkpay") {
        const sess = await sGet(`s:${body.token}`);
        if (!sess) return sendJson(res, 401, { success: false, message: "sesi habis — login lagi" });
        const meta = await sGet(`inv:${body.invoice_id}`);
        if (!meta || meta.username !== sess.username) return sendJson(res, 404, { success: false, message: "invoice tidak ditemukan" });
        const st = await payStatus(body.invoice_id);
        if (st && st.status === "paid") {
          const plan = PLANS[meta.plan];
          const user = await sGet(`u:${meta.username}`);
          if (user) {
            user.plan = "premium"; user.paidUntil = Date.now() + meta.days * 864e5;
            await sSet(`u:${meta.username}`, user);
            await sSet(`k:${user.apikey}`, user);
            // notif WA ke user (jika terdaftar nomornya)
            if (user.wa) {
              try { await fetch(`${PAY_BASE}/api/wa/send?apikey=${PAY_KEY}&target=${user.wa}&message=${encodeURIComponent("✅ HAOMI — Pembayaran diterima!\n\nAkun " + user.username + " sekarang PREMIUM selama " + meta.days + " hari. Unlimited request aktif 🚀")}`); } catch (e) {}
            }
          }
          await sDel(`inv:${body.invoice_id}`);
          return sendJson(res, 200, { success: true, status: "paid", message: `Pembayaran diterima! Role ${plan.label} aktif ${plan.days} hari 🎉` });
        }
        return sendJson(res, 200, { success: true, status: st ? st.status : "pending", message: st && st.status === "paid" ? "" : pick(ROAST.unpaid) });
      }

      // ganti apikey (premium only)
      if (action === "customkey") {
        const sess = await sGet(`s:${body.token}`);
        if (!sess) return sendJson(res, 401, { success: false, message: "sesi habis" });
        const user = await sGet(`u:${sess.username}`);
        if (!user) return sendJson(res, 404, { success: false, message: "user tidak ada" });
        if (user.plan !== "premium")
          return sendJson(res, 403, { success: false, message: pick(ROAST.premiumonly) });
        const newK = String(body.newkey || "");
        if (!KEY_RE.test(newK)) return sendJson(res, 400, { success: false, message: "Format: Hao-xxx-xxx-xxx (huruf kecil/angka)" });
        if (await sGet(`k:${newK}`)) return sendJson(res, 409, { success: false, message: "Key sudah dipakai" });
        await sDel(`k:${user.apikey}`);
        user.apikey = newK;
        await sSet(`u:${sess.username}`, user);
        await sSet(`k:${newK}`, user);
        return sendJson(res, 200, { success: true, message: "API key berhasil diganti!", apikey: newK });
      }

      // upgrade (owner)
      if (action === "upgrade") {
        const { adminkey, username, plan } = body;
        if (adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        const uname = String(username || "").toLowerCase();
        const user = await sGet(`u:${uname}`);
        if (!user) return sendJson(res, 404, { success: false, message: "user tidak ditemukan" });
        user.plan = plan === "free" ? "free" : "premium";
        await sSet(`u:${uname}`, user);
        await sSet(`k:${user.apikey}`, user);
        return sendJson(res, 200, { success: true, message: `${uname} → ${user.plan.toUpperCase()}` });
      }

      // ============ OWNER PANEL ============
      // OWNER: export semua user ke CSV
      if (action === "owner_export") {
        if (body.adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        const users = [];
        for (const [k, u] of mem.users) if (k.startsWith("u:")) users.push(u);
        let csv = "username,plan,used_today,created,apikey\n";
        for (const u of users) csv += `${u.username},${u.plan},${u.usedDate === today() ? u.used : 0},${u.created},${u.apikey}\n`;
        return sendJson(res, 200, { success: true, csv });
      }

      // OWNER: edit harga plan (perDay) langsung dari panel
      if (action === "owner_setprice") {
        if (body.adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        const planId = body.plan;
        const perDay = parseInt(body.perDay);
        if (!PLANS[planId] || !perDay || perDay < 100) return sendJson(res, 400, { success: false, message: "plan/perDay tidak valid (min 100)" });
        PLANS[planId].perDay = perDay;
        await sSet("cfg:prices", Object.fromEntries(Object.entries(PLANS).map(([k, v]) => [k, v.perDay])));
        return sendJson(res, 200, { success: true, message: `Harga ${planId} → Rp ${perDay}/hari ✓` });
      }

      // OWNER: total pendapatan (dari riwayat invoice semua user)
      if (action === "owner_revenue") {
        if (body.adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        let totalAll = 0, hariIni = 0;
        for (const [k, u] of mem.users) {
          if (!k.startsWith("u:") || !u.history) continue;
          for (const h of u.history) {
            if (h.jenis === "manual" || h.total) {
              totalAll += h.total || 0;
              if (new Date(h.t).toISOString().slice(0, 10) === today()) hariIni += h.total || 0;
            }
          }
        }
        return sendJson(res, 200, { success: true, total_semua: totalAll, hari_ini: hariIni });
      }

      if (action === "owner_stats") {
        if (body.adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        // kumpulkan semua user (Redis: SCAN; memory: iterate)
        const users = [];
        if (USE_REDIS) {
          let cursor = "0";
          do {
            const [nc, keys] = await redis("SCAN", cursor, "MATCH", "u:*", "COUNT", 100);
            cursor = nc;
            for (const k of keys) {
              const raw = await redis("GET", k);
              if (raw) { const u = JSON.parse(raw); users.push({ username: u.username, plan: u.plan, used: u.used, usedDate: u.usedDate, created: u.created, apikey: u.apikey }); }
            }
          } while (cursor !== "0");
        } else {
          for (const [k, u] of mem.users) {
            if (k.startsWith("u:")) users.push({ username: u.username, plan: u.plan, used: u.used, usedDate: u.usedDate, created: u.created, apikey: u.apikey });
          }
        }
        const freeCount = users.filter(u => u.plan === "free").length;
        const premCount = users.filter(u => u.plan === "premium").length;
        const totalReq = users.reduce((a, u) => a + (u.usedDate === today() ? u.used : 0), 0);
        return sendJson(res, 200, {
          success: true,
          stats: {
            total_users: users.length,
            free_users: freeCount,
            premium_users: premCount,
            total_req_hari_ini: totalReq,
            free_limit: FREE_DAILY_LIMIT,
            storage: USE_REDIS ? "redis" : "memory-demo",
          },
          users: users.sort((a, b) => b.used - a.used),
        });
      }

      if (action === "owner_delete") {
        if (body.adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        const uname = String(body.username || "").toLowerCase();
        const user = await sGet(`u:${uname}`);
        if (!user) return sendJson(res, 404, { success: false, message: "user tidak ditemukan" });
        await sDel(`u:${uname}`);
        await sDel(`k:${user.apikey}`);
        return sendJson(res, 200, { success: true, message: `user ${uname} dihapus` });
      }

      if (action === "owner_setlimit") {
        if (body.adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        const uname = String(body.username || "").toLowerCase();
        const user = await sGet(`u:${uname}`);
        if (!user) return sendJson(res, 404, { success: false, message: "user tidak ditemukan" });
        user.customLimit = body.limit === null || body.limit === "unlimited" ? null : parseInt(body.limit);
        await sSet(`u:${uname}`, user);
        await sSet(`k:${user.apikey}`, user);
        return sendJson(res, 200, { success: true, message: `limit ${uname} = ${user.customLimit ?? "default"}` });
      }

      if (action === "owner_reset") {
        if (body.adminkey !== OWNER_KEY) return sendJson(res, 403, { success: false, message: "adminkey tidak valid" });
        const uname = String(body.username || "").toLowerCase();
        const user = await sGet(`u:${uname}`);
        if (!user) return sendJson(res, 404, { success: false, message: "user tidak ditemukan" });
        user.used = 0; user.usedDate = today();
        await sSet(`u:${uname}`, user);
        await sSet(`k:${user.apikey}`, user);
        return sendJson(res, 200, { success: true, message: `usage ${uname} direset` });
      }

      return sendJson(res, 400, { success: false, message: "action tidak dikenal" });
    }

    // ============ STATUS PAGE (public) ============
    if (route === "status") {
      let upstreamOk = false, ms = 0;
      const t0 = Date.now();
      try {
        const r = await fetch(`${BASE_URL}/api/search/cuaca?query=jakarta`, { signal: AbortSignal.timeout(5000) });
        upstreamOk = r.status < 500; ms = Date.now() - t0;
      } catch (e) { ms = Date.now() - t0; }
      return sendJson(res, 200, {
        success: true,
        web: "operational",
        auth: "operational",
        payment_gateway: "operational", // dicek saat buy
        upstream: upstreamOk ? "operational" : "degraded",
        upstream_ms: ms,
        storage: USE_REDIS ? "redis (persistent)" : "memory (demo)",
        time: new Date().toISOString(),
      });
    }

    // ============ PUBLIC INFO ============
    if (route === "" || route === "info") {
      return sendJson(res, 200, {
        success: true,
        service: "HAOMI API Tools",
        version: "3.0",
        plans: { free: `${FREE_DAILY_LIMIT} req/hari`, premium: "unlimited + custom key" },
        owner_contact: "wa.me/6282231669053",
        endpoints_count: 406,
        storage: USE_REDIS ? "redis (persistent)" : "memory (demo — data hilang saat redeploy)",
      });
    }

    // ============ API PROXY (perlu apikey) ============
    const userKey = qp.get("apikey")
      || (req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : null)
      || (req.method === "POST" ? readBody().apikey : null);
    const v = await validateAndCount(userKey);
    if (!v.ok) {
      // user banned → langsung roast pedes, tanpa counter
      if (v.banned) return sendJson(res, 403, { success: false, banned: true, message: v.reason });
      const fk = "f:" + (req.headers["x-forwarded-for"] || "anon");
      failStreak.set(fk, (failStreak.get(fk) || 0) + 1);
      const n = failStreak.get(fk);
      return sendJson(res, 401, { success: false, message: n >= 5 ? pick(ROAST.spam) : v.reason });
    }
    failStreak.delete("f:" + (req.headers["x-forwarded-for"] || "anon"));

    const upstreamPath = `/api/${route}`;
    const method = req.method;
    const params = Object.fromEntries(qp.entries());
    delete params.apikey;
    delete params._ep;

    res.setHeader("X-Plan", v.plan);
    res.setHeader("X-RateLimit-Limit", v.plan === "free" ? String(FREE_DAILY_LIMIT) : "unlimited");
    res.setHeader("X-RateLimit-Used", String(v.rec.used));

    if (method === "POST") {
      const ctype = req.headers["content-type"] || "";
      if (ctype.includes("multipart/form-data")) {
        const chunks = [];
        for await (const c of req) chunks.push(c);
        const fd = new FormData();
        const blob = new Blob([Buffer.concat(chunks)], { type: ctype });
        fd.append("file", blob, "upload");
        for (const [k, val] of Object.entries(params)) fd.append(k, val);
        return res.status(200).json(await proxyUpstream(upstreamPath, null, "POST", null, fd));
      }
      const body = readBody();
      delete body.apikey;
      return res.status(200).json(await proxyUpstream(upstreamPath, params, "POST", body));
    }

    return res.status(200).json(await proxyUpstream(upstreamPath, params, "GET"));

  } catch (err) {
    return sendJson(res, 500, { success: false, message: err.message });
  }
};

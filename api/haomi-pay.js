/**
 * haomi-pay.js — Modul pembayaran HAOMI (QRIS otomatis + fallback manual + voucher)
 * Diambil utuh dari HAOMI API Tools v3.5 (dipertahankan untuk project top-up game).
 * Env override: PAY_API_KEY, OWNER_WA, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 */

// ---------- Storage dual-mode (memory / Upstash Redis) ----------
const UP_URL = process.env.UPSTASH_REDIS_REST_URL;
const UP_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const mem = { kv: new Map() };

async function sGet(key) {
  if (UP_URL) {
    const r = await fetch(`${UP_URL}/get/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${UP_TOKEN}` } });
    const j = await r.json();
    return j.result ? JSON.parse(j.result) : null;
  }
  return mem.kv.get(key) || null;
}
async function sSet(key, val) {
  if (UP_URL) {
    await fetch(`${UP_URL}/set/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${UP_TOKEN}`, "Content-Type": "text/plain" },
      body: JSON.stringify(val),
    });
    return;
  }
  mem.kv.set(key, val);
}
async function sDel(key) {
  if (UP_URL) {
    await fetch(`${UP_URL}/del/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${UP_TOKEN}` } });
    return;
  }
  mem.kv.delete(key);
}

// ---------- Payment gateway (QRIS otomatis via sairi) ----------
const PAY_BASE = "https://api.sairibot.my.id";
const PAY_KEY = process.env.PAY_API_KEY || "SKY_39575737d3d744d8";
const OWNER_WA = process.env.OWNER_WA || "6282231669053"; // format internasional tanpa +

async function payInvoice(amount) {
  const r = await fetch(`${PAY_BASE}/api/invoice?apikey=${encodeURIComponent(PAY_KEY)}&amount=${encodeURIComponent(amount)}`);
  return r.json();
}
async function payStatus(invoiceId) {
  const r = await fetch(`${PAY_BASE}/api/invoice/status?apikey=${encodeURIComponent(PAY_KEY)}&invoice_id=${encodeURIComponent(invoiceId)}`);
  return r.json();
}
// kirim notif WA via gateway (dipakai untuk konfirmasi topup / info owner)
async function payWaSend(target, message) {
  try {
    await fetch(`${PAY_BASE}/api/wa/send?apikey=${encodeURIComponent(PAY_KEY)}&target=${encodeURIComponent(target)}&message=${encodeURIComponent(message)}`);
  } catch (e) { /* diam — notif tidak boleh bikin transaksi gagal */ }
}

// ---------- Voucher ----------
const vGet = (kode) => sGet(`v:${kode}`);
const vSet = (kode, v) => sSet(`v:${kode}`, v);
const vDel = (kode) => sDel(`v:${kode}`);

// terapkan voucher ke total; return { total, vcode } atau throw pesan error
async function applyVoucher(total0, rawCode) {
  if (!rawCode) return { total: total0, vcode: null };
  const kode = String(rawCode).toUpperCase().replace(/[^A-Z0-9]/g, "");
  const v = await vGet(kode);
  if (!v || !v.aktif || v.terpakai >= v.maxPakai) throw new Error("Voucher tidak valid / habis");
  const total = Math.max(1000, total0 - v.potongan);
  v.terpakai += 1;
  await vSet(kode, v);
  return { total, vcode: kode };
}

module.exports = { sGet, sSet, sDel, payInvoice, payStatus, payWaSend, PAY_BASE, PAY_KEY, OWNER_WA, applyVoucher, vGet, vSet, vDel };

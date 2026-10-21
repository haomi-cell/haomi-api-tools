// bot.js — Bot Telegram HAOMI (versi UI keren: inline buttons + menu)
// Jalankan: TELEGRAM_BOT_TOKEN=xxx node bot.js
// Dependensi: TIDAK ADA (Node 18+).

"use strict";

const https = require("https");

const API_BASE = "https://api.jerexd.my.id";
const API_KEY = process.env.UPSTREAM_API_KEY || "";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OWNER_CONTACT = "6282231669053"; // format internasional (62...), tanpa + dan tanpa 0 di depan

if (!BOT_TOKEN) {
  console.error("Error: TELEGRAM_BOT_TOKEN belum diisi.");
  console.error("Cara pakai: TELEGRAM_BOT_TOKEN=123:ABC node bot.js");
  process.exit(1);
}

// ---------- Model AI ----------
const MODELS = {
  "gpt4o":    { label: "⚡ GPT-4o", api: "openai/gpt-4o" },
  "gpt4om":   { label: "🌱 GPT-4o Mini", api: "openai/gpt-4o-mini" },
  "gpt5":     { label: "🧠 GPT-5", api: "openai/gpt-5" },
  "claude":   { label: "🎭 Claude Haiku", api: "anthropic/claude-haiku-4.5" },
  "sonnet":   { label: "🎭 Claude Sonnet", api: "anthropic/claude-sonnet-4.6" },
  "gemini":   { label: "✨ Gemini Pro", api: "google/gemini-3.1-pro-preview" },
  "deepseek": { label: "🐋 DeepSeek V4", api: "deepseek/deepseek-v4-pro" },
  "grok":     { label: "🚀 Grok 4.1", api: "xai/grok-4.1-fast-non-reasoning" },
  "qwen":     { label: "🔮 Qwen3 Max", api: "alibaba/qwen3-max" },
};
const DEFAULT_MODEL_KEY = "gpt4om";

const WELCOME =
  "✨ <b>HALO! AKU HAOMI 🤖</b>\n\n" +
  "Asisten AI pribadimu di Telegram — siap jawab apa aja, 24/7.\n\n" +
  "💬 <i>Langsung ketik pertanyaanmu di bawah ini…</i>\n\n" +
  "⬇️ <b>Pilih menu:</b>";

// ---------- State ----------
const histories = new Map(); // chatId -> { modelKey, messages }
const MAX_HISTORY = 20;
const MAX_TEXT_LEN = 3800;

function getChat(chatId) {
  if (!histories.has(chatId)) {
    histories.set(chatId, { modelKey: DEFAULT_MODEL_KEY, messages: [] });
  }
  return histories.get(chatId);
}

// ---------- Util ----------
function apiFetch(path, params, { timeoutMs = 55000 } = {}) {
  const url = new URL(path, API_BASE);
  url.searchParams.set("apikey", API_KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: timeoutMs }, (res) => {
      let body = "";
      res.on("data", (c) => { body += c; });
      res.on("end", () => {
        if (res.statusCode >= 400) return reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 200)}`));
        try { resolve(JSON.parse(body)); } catch { reject(new Error("Respon API bukan JSON")); }
      });
    });
    req.on("timeout", () => req.destroy(new Error("Timeout API")));
    req.on("error", reject);
  });
}

function extractText(data) {
  if (typeof data === "string") return data;
  const candidates = [
    data?.data?.message, data?.data?.content, data?.data?.reply,
    data?.data?.result, data?.message, data?.content, data?.result, data?.reply,
  ];
  for (const c of candidates) if (typeof c === "string" && c.trim()) return c;
  try { return JSON.stringify(data, null, 2).slice(0, 2000); }
  catch { return "Respon API tidak dikenali."; }
}

function chunkText(text, size = MAX_TEXT_LEN) {
  if (text.length <= size) return [text];
  const parts = [];
  for (let i = 0; i < text.length; i += size) parts.push(text.slice(i, i + size));
  return parts;
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function fmtAnswer(text) {
  return "🤖 <b>HAOMI</b>\n━━━━━━━━━━━━━━\n" + escapeHtml(text) + "\n━━━━━━━━━━━━━━";
}

// ---------- Telegram API ----------
function tgCall(method, payload, timeoutMs = 70000) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = https.request(
      {
        hostname: "api.telegram.org",
        path: `/bot${BOT_TOKEN}/${method}`,
        method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
        timeout: timeoutMs,
      },
      (res) => {
        let data = "";
        res.on("data", (c) => { data += c; });
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.ok) resolve(parsed.result);
            else reject(new Error(parsed.description || `Telegram ${res.statusCode}`));
          } catch (e) { reject(e); }
        });
      }
    );
    req.on("timeout", () => req.destroy(new Error("Timeout Telegram")));
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ---------- Keyboards ----------
const mainMenuKeyboard = {
  inline_keyboard: [
    [
      { text: "🧠 Ganti Model AI", callback_data: "menu:model" },
      { text: "🗑️ Reset Chat", callback_data: "action:reset" },
    ],
    [
      { text: "💡 Contoh Prompt", callback_data: "menu:examples" },
      { text: "ℹ️ Tentang", callback_data: "menu:about" },
    ],
    [
      { text: "👑 Owner", url: `https://t.me/+${OWNER_CONTACT}` },
    ],
  ],
};

const modelKeyboard = (activeKey) => ({
  inline_keyboard: [
    ...Object.entries(MODELS).map(([key, m]) => [
      { text: (key === activeKey ? "✅ " : "") + m.label, callback_data: `setmodel:${key}` },
    ]),
    [{ text: "⬅️ Kembali", callback_data: "menu:main" }],
  ],
});

const examplesKeyboard = {
  inline_keyboard: [
    [{ text: "✍️ Buat caption IG", callback_data: "ex:caption" }],
    [{ text: "💻 Jelaskan kode Python", callback_data: "ex:kode" }],
    [{ text: "📝 Ringkas paragraf", callback_data: "ex:ringkas" }],
    [{ text: "🎯 Ide konten TikTok", callback_data: "ex:tiktok" }],
    [{ text: "⬅️ Kembali", callback_data: "menu:main" }],
  ],
};

const EXAMPLES = {
  caption: "Buatkan 5 caption Instagram estetik tentang sore di pantai",
  kode: "Jelaskan apa itu list comprehension di Python, beri contoh singkat",
  ringkas: "Ringkas paragraf ini jadi 2 kalimat: Teknologi AI berkembang sangat pesat dalam dekade terakhir dan mengubah cara kita bekerja, belajar, dan berkomunikasi secara fundamental di berbagai sektor kehidupan modern.",
  tiktok: "Beri 5 ide konten TikTok yang cocok untuk akhir minggu",
};

const backToMain = { inline_keyboard: [[{ text: "⬅️ Menu Utama", callback_data: "menu:main" }]] };

// ---------- AI ----------
async function askAI(chatId, prompt) {
  const chat = getChat(chatId);
  chat.messages.push({ role: "user", content: prompt });
  if (chat.messages.length > MAX_HISTORY) chat.messages.splice(0, chat.messages.length - MAX_HISTORY);

  const modelApi = MODELS[chat.modelKey].api;
  let data;
  try {
    data = await apiFetch("/api/ai/chat", {
      model: modelApi,
      messages: JSON.stringify(chat.messages),
    });
  } catch {
    data = await apiFetch("/api/ai/chatdayai", { text: prompt });
  }
  const text = extractText(data);
  chat.messages.push({ role: "assistant", content: text });
  if (chat.messages.length > MAX_HISTORY) chat.messages.splice(0, chat.messages.length - MAX_HISTORY);
  return text;
}

// ---------- Menu Views ----------
async function showMainMenu(chatId, messageId = null) {
  const chat = getChat(chatId);
  const model = MODELS[chat.modelKey];
  const text =
    "🏠 <b>MENU UTAMA — HAOMI</b>\n" +
    "━━━━━━━━━━━━━━\n\n" +
    `🧠 Model aktif: <b>${model.label}</b>\n` +
    `💬 Chat tersimpan: <b>${chat.messages.length}</b> pesan\n\n` +
    "<i>Ketik pertanyaanmu langsung, atau pilih tombol di bawah 👇</i>";
  const payload = { chat_id: chatId, text, parse_mode: "HTML", reply_markup: mainMenuKeyboard };
  if (messageId) {
    payload.message_id = messageId;
    await tgCall("editMessageText", payload).catch(() => {});
  } else {
    await tgCall("sendMessage", payload);
  }
}

async function showModelMenu(chatId, messageId) {
  const chat = getChat(chatId);
  await tgCall("editMessageText", {
    chat_id: chatId, message_id: messageId,
    text: "🧠 <b>PILIH MODEL AI</b>\n━━━━━━━━━━━━━━\n\n<i>Model aktif ditandai ✅ — klik untuk ganti. Chat berikutnya langsung pakai model baru.</i>",
    parse_mode: "HTML", reply_markup: modelKeyboard(chat.modelKey),
  }).catch(() => {});
}

async function showExamples(chatId, messageId) {
  await tgCall("editMessageText", {
    chat_id: chatId, message_id: messageId,
    text: "💡 <b>CONTOH PROMPT</b>\n━━━━━━━━━━━━━━\n\n<i>Klik salah satu untuk langsung dicoba:</i>",
    parse_mode: "HTML", reply_markup: examplesKeyboard,
  }).catch(() => {});
}

async function showAbout(chatId, messageId) {
  await tgCall("editMessageText", {
    chat_id: chatId, message_id: messageId,
    text:
      "ℹ️ <b>TENTANG HAOMI BOT</b>\n━━━━━━━━━━━━━━\n\n" +
      "🤖 Asisten AI Telegram multi-model\n" +
      "🧠 9 model: GPT, Claude, Gemini, DeepSeek, Grok, Qwen\n" +
      "💬 Konteks percakapan tersimpan per chat\n" +
      "⚡ Cepat & gratis\n\n" +
      `👑 Owner: <a href="https://wa.me/6282231669053">+62 822-3166-9053</a> (WhatsApp/Telegram)\n\n` +
      "<i>Dibuat dengan ❤️ oleh HAOMI.AI</i>",
    parse_mode: "HTML", reply_markup: backToMain,
  }).catch(() => {});
}

// ---------- Handlers ----------
async function handleCommand(msg) {
  const chatId = msg.chat.id;
  switch ((msg.text || "").split("@")[0]) {
    case "/start":
      await tgCall("sendMessage", {
        chat_id: chatId, text: WELCOME, parse_mode: "HTML",
        reply_markup: mainMenuKeyboard,
      });
      break;
    case "/menu":
      await showMainMenu(chatId);
      break;
    case "/owner":
      await tgCall("sendMessage", {
        chat_id: chatId,
        text:
          "👑 <b>OWNER HAOMI BOT</b>\n━━━━━━━━━━━━━━\n\n" +
          "📱 WhatsApp: <a href=\"https://wa.me/6282231669053\">+62 822-3166-9053</a>\n" +
          "💬 Telegram: <a href=\"https://t.me/+6282231669053\">+62 822-3166-9053</a>\n\n" +
          "<i>Hubungi owner untuk pertanyaan, laporan bug, atau kerja sama.</i>",
        parse_mode: "HTML", reply_markup: backToMain,
      });
      break;
    case "/reset":
      histories.delete(chatId);
      await tgCall("sendMessage", {
        chat_id: chatId,
        text: "🧹 <b>Riwayat dihapus!</b>\n\n<i>Konteks obrolan sudah dibersihkan.</i>",
        parse_mode: "HTML", reply_markup: backToMain,
      });
      break;
    default:
      await tgCall("sendMessage", {
        chat_id: chatId,
        text: "❓ Perintah tidak dikenal. Ketik /start untuk buka menu.",
      });
  }
}

async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();
  if (!text) return;
  // Indikator "sedang mengetik" selama AI memproses.
  const typingTimer = setInterval(() => {
    tgCall("sendChatAction", { chat_id: chatId, action: "typing" }).catch(() => {});
  }, 4000);
  tgCall("sendChatAction", { chat_id: chatId, action: "typing" }).catch(() => {});

  try {
    const answer = await askAI(chatId, text);
    clearInterval(typingTimer);
    await sendAnswer(chatId, fmtAnswer(answer), msg.message_id);
  } catch (err) {
    clearInterval(typingTimer);
    console.error("Gagal memproses:", err.message);
    await tgCall("sendMessage", {
      chat_id: chatId, parse_mode: "HTML",
      text: `⚠️ <b>Ups, ada kendala.</b>\n\n<code>${escapeHtml(err.message)}</code>\n\n<i>Coba lagi atau ganti model lewat /start</i>`,
      reply_markup: backToMain,
    }).catch(() => {});
  }
}

async function sendAnswer(chatId, formatted, replyTo) {
  const parts = chunkText(formatted);
  for (let i = 0; i < parts.length; i++) {
    await tgCall("sendMessage", {
      chat_id: chatId, text: parts[i], parse_mode: "HTML",
      reply_to_message_id: i === 0 ? replyTo : undefined,
      disable_web_page_preview: true,
      reply_markup: i === parts.length - 1 ? { inline_keyboard: [[
        { text: "🏠 Menu", callback_data: "menu:main" },
        { text: "🧠 Model", callback_data: "menu:model" },
        { text: "🧹 Reset", callback_data: "action:reset" },
      ]] } : undefined,
    });
  }
}

async function handleCallback(query) {
  const chatId = query.message?.chat?.id;
  const messageId = query.message?.message_id;
  const data = query.data || "";
  if (!chatId || !messageId) return;
  await tgCall("answerCallbackQuery", { callback_query_id: query.id }).catch(() => {});

  if (data === "menu:main") return showMainMenu(chatId, messageId);
  if (data === "menu:model") return showModelMenu(chatId, messageId);
  if (data === "menu:examples") return showExamples(chatId, messageId);
  if (data === "menu:about") return showAbout(chatId, messageId);

  if (data.startsWith("setmodel:")) {
    const key = data.slice(9);
    if (MODELS[key]) {
      getChat(chatId).modelKey = key;
      await tgCall("answerCallbackQuery", {
        callback_query_id: query.id,
        text: `✅ Model: ${MODELS[key].label}`,
      }).catch(() => {});
      return showModelMenu(chatId, messageId);
    }
  }

  if (data.startsWith("ex:")) {
    const prompt = EXAMPLES[data.slice(3)];
    if (prompt) {
      try {
        const answer = await askAI(chatId, prompt);
        await sendAnswer(chatId, fmtAnswer(answer), null);
      } catch (err) {
        await tgCall("sendMessage", { chat_id: chatId, text: `⚠️ ${escapeHtml(err.message)}` }).catch(() => {});
      }
    }
    return;
  }

  if (data === "action:reset") {
    histories.delete(chatId);
    await tgCall("answerCallbackQuery", { callback_query_id: query.id, text: "🧹 Riwayat dihapus!" }).catch(() => {});
    return showMainMenu(chatId, messageId);
  }
}

// ---------- Long polling ----------
let offset = 0;

async function poll() {
  const updates = await tgCall("getUpdates", { offset, timeout: 50 });
  for (const u of updates) {
    offset = u.update_id + 1;
    if (u.callback_query) {
      handleCallback(u.callback_query).catch((e) => console.error("Callback error:", e.message));
    } else if (u.message) {
      const msg = u.message;
      const isCmd = msg.text && msg.text.startsWith("/");
      (isCmd ? handleCommand(msg) : handleMessage(msg))
        .catch((e) => console.error("Handler error:", e.message));
    }
  }
}

(async function main() {
  const me = await tgCall("getMe", {}, 15000);
  console.log(`✅ Bot aktif: @${me.username}`);
  await tgCall("setMyCommands", {
    commands: [
      { command: "start", description: "🏠 Buka menu utama" },
      { command: "menu", description: "📋 Tampilkan menu" },
      { command: "reset", description: "🧹 Hapus riwayat obrolan" },
    ],
  }).catch((e) => console.error("Gagal set commands:", e.message));
  console.log("Menu perintah terdaftar.");
  for (;;) {
    try { await poll(); }
    catch (err) {
      console.error("Polling error:", err.message);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
})();

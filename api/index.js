// HAOMI.AI Backend Gateway — Menggunakan WHATWG URL & Native Fetch (Bebas DeprecationWarning url.parse / DEP0169)

const BASE_URL = "https://api.jerexd.my.id";

// API key utama JERE API
const API_KEY =
  process.env.JEREXD_API_KEY || "jere_sTl9OLzPIyMn";

const GEMINI_DIRECT_MODELS = [
  "gemini-2.0-pro",
  "gemini-pro",
  "gemini-flash",
  "gemini-2.0-flash",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
];

const COPILOT_MODELS = [
  "microsoft/copilot",
  "copilot",
];

const ALLOWED_MODELS = [
  "chatday/ai-chat",
  "openai/gpt-5.6-terra",
  "openai/gpt-5.5",
  "openai/gpt-5.4",
  "openai/gpt-5.3-chat",
  "openai/gpt-5.1-instant",
  "openai/gpt-5",
  "openai/gpt-4o",
  "openai/gpt-4o-mini",
  "xai/grok-4.1-fast-non-reasoning",
  "anthropic/claude-haiku-4.5",
  "anthropic/claude-sonnet-5",
  "anthropic/claude-sonnet-4.6",
  "anthropic/claude-opus-4.5",
  "anthropic/claude-opus-4.6",
  "anthropic/claude-opus-4.7",
  "anthropic/claude-opus-4.8",
  "deepseek/deepseek-v4-pro",
  "deepseek/deepseek-v4-flash",
  "deepseek/deepseek-v3.2-thinking",
  "google/gemini-3.1-pro-preview",
  "google/gemini-3-pro-preview",
  "google/gemini-3.1-flash-lite",
  "gemini-2.0-pro",
  "gemini-pro",
  "gemini-flash",
  "microsoft/copilot",
  "alibaba/qwen3-max",
  "meta/llama-4-maverick",
  "moonshotai/kimi-k2.6",
];

const CITY_KNOWLEDGE_BASE = {
  jombang:
    "Ini adalah deskripsi tentang Jombang: Kabupaten Jombang adalah sebuah wilayah kabupaten strategis di bagian tengah Provinsi Jawa Timur, Indonesia. Ibu kotanya berada di Kecamatan Jombang. Wilayah ini dikenal luas dengan julukan 'Kota Santri' karena banyaknya pondok pesantren besar bersejarah (seperti Tebuireng, Bahrul Ulum Tambakberas, Darul Ulum Rejoso, dan Denanyar) serta menjadi tempat kelahiran banyak tokoh besar nasional.",
  surabaya:
    "Ini adalah deskripsi tentang Surabaya: Kota Surabaya adalah ibu kota Provinsi Jawa Timur sekaligus kota metropolitan terbesar kedua di Indonesia setelah Jakarta. Dikenal sebagai 'Kota Pahlawan', Surabaya merupakan pusat perdagangan, industri, maritim, dan pendidikan utama di kawasan Indonesia Timur.",
  malang:
    "Ini adalah deskripsi tentang Malang: Kota Malang adalah sebuah kota di Provinsi Jawa Timur yang terletak di dataran tinggi yang sejuk. Dikenal sebagai 'Kota Pendidikan' dan 'Kota Bunga', Malang menjadi salah satu destinasi pariwisata dan pusat perguruan tinggi terkemuka di Indonesia.",
  jakarta:
    "Ini adalah deskripsi tentang Jakarta: Jakarta (DKI Jakarta) adalah pusat perekonomian, bisnis, diplomasi, dan pemerintahan berskala megapolitan di Indonesia yang terletak di pesisir barat laut Pulau Jawa.",
  bandung:
    "Ini adalah deskripsi tentang Bandung: Kota Bandung adalah ibu kota Provinsi Jawa Barat yang dikelilingi pegunungan sejuk. Dikenal dengan julukan 'Kota Kembang' dan 'Paris van Java', Bandung merupakan pusat industri kreatif, pendidikan tinggi, dan kuliner populer.",
  yogyakarta:
    "Ini adalah deskripsi tentang Yogyakarta: Kota Yogyakarta adalah ibu kota Daerah Istimewa Yogyakarta yang dikenal sebagai 'Kota Pelajar', pusat kebudayaan Jawa klasik, keraton bersejarah, serta tujuan wisata unggulan di Indonesia.",
  semarang:
    "Ini adalah deskripsi tentang Semarang: Kota Semarang adalah ibu kota Provinsi Jawa Tengah sekaligus kota pelabuhan, perdagangan, dan industri utama di jalur pantai utara (Pantura) Pulau Jawa yang terkenal dengan kawasan bersejarah Kota Lama.",
};

let cachedGeminiModels = null;

function sendJson(res, statusCode, data) {
  return res.status(statusCode).json(data);
}

function getInput(req, key, fallback = "") {
  const body = req.body && typeof req.body === "object"
    ? req.body
    : {};

  const query = req.query && typeof req.query === "object"
    ? req.query
    : {};

  const value = body[key] ?? query[key] ?? fallback;

  return typeof value === "string" ? value.trim() : value;
}

function requireString(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    const error = new Error(`${label} wajib diisi.`);
    error.statusCode = 400;
    throw error;
  }

  return value.trim();
}

function requireEmail(value) {
  const email = requireString(value, "Email");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const error = new Error("Format email tidak valid.");
    error.statusCode = 400;
    throw error;
  }

  return email;
}

function requireHttpUrl(value, label = "URL") {
  const raw = requireString(value, label);

  let parsed;

  try {
    parsed = new URL(raw);
  } catch {
    const error = new Error(`${label} tidak valid.`);
    error.statusCode = 400;
    throw error;
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    const error = new Error(`${label} harus menggunakan HTTP atau HTTPS.`);
    error.statusCode = 400;
    throw error;
  }

  return parsed.toString();
}

function getApiError(error) {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data.trim().slice(0, 1500);
  }

  if (data && typeof data === "object") {
    return (
      data.message ||
      data.error ||
      data.result ||
      JSON.stringify(data)
    ).toString().slice(0, 1500);
  }

  if (error?.name === "AbortError" || error?.code === "ECONNABORTED") {
    return "Permintaan ke layanan API terlalu lama. Silakan coba lagi.";
  }

  return error?.message || "Terjadi kesalahan pada layanan API.";
}

function buildMultipartPayload(fields = {}, filePart = null) {
  const boundary = `----HaomiFormBoundary${Date.now().toString(16)}${Math.random().toString(16).slice(2, 8)}`;
  const chunks = [];

  for (const [key, val] of Object.entries(fields)) {
    if (val === undefined || val === null) continue;
    chunks.push(
      Buffer.from(
        `--${boundary}\r\n` +
          `Content-Disposition: form-data; name="${key}"\r\n\r\n` +
          `${String(val)}\r\n`,
        "utf-8"
      )
    );
  }

  if (filePart && filePart.buffer) {
    const fieldName = filePart.fieldName || "file";
    const fileName = (filePart.fileName || "icon.png").replace(/"/g, "");
    const mimeType = filePart.mimeType || "application/octet-stream";
    chunks.push(
      Buffer.from(
        `--${boundary}\r\n` +
          `Content-Disposition: form-data; name="${fieldName}"; filename="${fileName}"\r\n` +
          `Content-Type: ${mimeType}\r\n\r\n`,
        "utf-8"
      )
    );
    chunks.push(filePart.buffer);
    chunks.push(Buffer.from("\r\n", "utf-8"));
  }

  chunks.push(Buffer.from(`--${boundary}--\r\n`, "utf-8"));
  return {
    boundary,
    buffer: Buffer.concat(chunks),
  };
}

async function callJerexd(endpoint, params = {}, timeoutMs = 45000) {
  const targetUrl = new URL(endpoint, BASE_URL);
  targetUrl.searchParams.set("apikey", API_KEY);

  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== "") {
      targetUrl.searchParams.set(key, String(val));
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    const rawText = await response.text();
    try {
      return JSON.parse(rawText);
    } catch {
      return {
        status: response.ok,
        statusCode: response.status,
        result: rawText,
      };
    }
  } finally {
    clearTimeout(timer);
  }
}

async function postJerexdMultipart(endpoint, params = {}, bodyBuffer, boundary, timeoutMs = 150000) {
  const targetUrl = new URL(endpoint, BASE_URL);
  targetUrl.searchParams.set("apikey", API_KEY);

  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== "") {
      targetUrl.searchParams.set(key, String(val));
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(targetUrl.toString(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": String(bodyBuffer.length),
      },
      body: bodyBuffer,
      signal: controller.signal,
    });

    const rawText = await response.text();
    try {
      return JSON.parse(rawText);
    } catch {
      return {
        status: response.ok,
        statusCode: response.status,
        result: rawText,
      };
    }
  } finally {
    clearTimeout(timer);
  }
}

function cleanCopilotEdgePreamble(text) {
  if (typeof text !== "string" || !text.trim()) return "";
  let out = text.trim();

  if (/membuka sebuah tab di Edge|judul dan URL halaman tersebut tidak memberikan informasi/i.test(out)) {
    return "Halo! 👋 Saya siap membantu kamu. Silakan tulis pertanyaan, topik yang ingin dibahas, atau kode program yang ingin dibuat!";
  }

  // Bersihkan kalimat pembuka bahasa Mandarin dari UnlimitedAI jika terselip di awal jawaban
  out = out.replace(
    /^你好，我是\s*UnlimitedAI\.Chat[^。！\n]*[。！]\s*(?:很高興能為你提供[^。！\n]*[。！]\s*)?/i,
    "Halo! "
  );

  return out;
}

function extractAiAnswer(data) {
  if (typeof data === "string") return cleanCopilotEdgePreamble(data.trim());
  if (!data || typeof data !== "object") return "";

  const candidates = [
    data.answer,
    data.result,
    data.response,
    data.reply,
    data.output,
    data.text,
    data.content,
    data.data,
    data.message,
  ];

  for (const item of candidates) {
    if (typeof item === "string" && item.trim()) {
      return cleanCopilotEdgePreamble(item.trim());
    }
    if (item && typeof item === "object" && !Array.isArray(item)) {
      const nested =
        item.answer ??
        item.result ??
        item.response ??
        item.reply ??
        item.output ??
        item.text ??
        item.content ??
        item.message;
      if (typeof nested === "string" && nested.trim()) {
        return cleanCopilotEdgePreamble(nested.trim());
      }
      if (nested && typeof nested === "object" && !Array.isArray(nested)) {
        const deep =
          nested.answer ??
          nested.result ??
          nested.response ??
          nested.text ??
          nested.content ??
          nested.message;
        if (typeof deep === "string" && deep.trim()) {
          return cleanCopilotEdgePreamble(deep.trim());
        }
      }
    }
  }

  return "";
}

function isTechnicalIssueAnswer(text) {
  if (typeof text !== "string" || !text.trim()) return true;
  return (
    /sorry,\s*ai\s*service\s*encountered\s*a\s*technical\s*issue/i.test(text) ||
    /maaf,\s*layanan\s*ai\s*mengalami\s*masalah\s*teknis/i.test(text) ||
    /please\s*try\s*again\s*later/i.test(text)
  );
}

// Deteksi apakah balasan AI malah keluar bahasa Mandarin/Cina padahal user tidak meminta bahasa Mandarin
function isUnwantedChineseAnswer(text, userPrompt = "") {
  if (typeof text !== "string" || !text.trim()) return false;
  if (/mandarin|chinese|china|cina|hanzi|漢字|汉字|[\u4e00-\u9fff]/i.test(String(userPrompt || ""))) {
    return false;
  }
  const cjkMatches = text.match(/[\u4e00-\u9fff]/g);
  return Boolean(cjkMatches && cjkMatches.length >= 6);
}

function isUsableAiResponse(data, userPrompt = "") {
  if (!data || typeof data !== "object") return false;
  if (data.status === false || data.success === false) return false;
  const ans = extractAiAnswer(data);
  if (!ans || isTechnicalIssueAnswer(ans) || isUnwantedChineseAnswer(ans, userPrompt)) return false;
  return true;
}

// Tambahkan akhiran kalimat singkat tanpa kurung siku agar UnlimitedAI.Chat tidak membalas pakai bahasa Mandarin
function buildIndonesianPrompt(rawPrompt) {
  const clean = String(rawPrompt || "").trim();
  if (/bahasa indonesia|in english|mandarin|jepang/i.test(clean)) {
    return clean;
  }
  return `${clean} (Jawab menggunakan Bahasa Indonesia)`;
}

function resolveBestGeminiModel(requestedModel, availableModels = []) {
  if (!Array.isArray(availableModels) || !availableModels.length) {
    return requestedModel || "gemini-2.0-flash";
  }
  const cleanReq = String(requestedModel || "").toLowerCase();
  if (availableModels.includes(cleanReq)) return cleanReq;

  if (cleanReq.includes("flash")) {
    const flashMatch = availableModels.find((m) =>
      String(m).toLowerCase().includes("flash")
    );
    if (flashMatch) return flashMatch;
  }

  if (cleanReq.includes("pro")) {
    const proMatch = availableModels.find((m) =>
      String(m).toLowerCase().includes("pro")
    );
    if (proMatch) return proMatch;
  }

  return availableModels[0];
}

async function callGeminiSmart(promptText, requestedModel = "gemini-2.0-pro", chatId = "HAOMI_XML") {
  const cleanChatId = String(chatId || "HAOMI_XML").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24) || "HAOMI_XML";
  const promptIndo = buildIndonesianPrompt(promptText);

  let modelToUse = cachedGeminiModels?.length
    ? resolveBestGeminiModel(requestedModel, cachedGeminiModels)
    : requestedModel;

  let data = await callJerexd("/api/ai/gemini", {
    prompt: promptIndo,
    model: modelToUse,
    chatId: cleanChatId,
  }, 25000);

  if (!isUsableAiResponse(data, promptText) && Array.isArray(data?.models) && data.models.length > 0) {
    cachedGeminiModels = data.models;
    const validModel = resolveBestGeminiModel(requestedModel, data.models);
    data = await callJerexd("/api/ai/gemini", {
      prompt: promptIndo,
      model: validModel,
      chatId: cleanChatId,
    }, 25000);
  }

  if (!isUsableAiResponse(data, promptText) && !cachedGeminiModels) {
    const listData = await callJerexd("/api/ai/gemini", {
      prompt: "Halo",
      model: "list",
      chatId: cleanChatId,
    }, 15000);
    if (Array.isArray(listData?.models) && listData.models.length > 0) {
      cachedGeminiModels = listData.models;
      const validModel = resolveBestGeminiModel(requestedModel, listData.models);
      data = await callJerexd("/api/ai/gemini", {
        prompt: promptIndo,
        model: validModel,
        chatId: cleanChatId,
      }, 25000);
    }
  }

  return data;
}

async function callCopilotSmart(promptText) {
  const clean = String(promptText || "").trim();
  const isShortGreeting = /^(halo|hai|hi|hello|hali|tes|test|ping|p|pagi|siang|sore|malam|assalamualaikum)[\s!?.]*$/i.test(clean);
  const queryToSend = isShortGreeting
    ? `${clean}! Jawab sapaan ini dengan ramah dalam bahasa Indonesia dan tanyakan apa yang bisa dibantu.`
    : buildIndonesianPrompt(clean);

  return await callJerexd("/api/ai/copilot", {
    query: queryToSend,
  }, 25000);
}

async function handleGeminiModels(req, res) {
  const chatId = getInput(req, "chatId", getInput(req, "session_id", "HAOMI_XML"));
  const data = await callJerexd("/api/ai/gemini", {
    prompt: "Halo",
    model: "list",
    chatId,
  });

  if (Array.isArray(data?.models) && data.models.length > 0) {
    cachedGeminiModels = data.models;
  }

  return sendJson(res, 200, {
    success: true,
    models: Array.isArray(data?.models) ? data.models : GEMINI_DIRECT_MODELS,
    raw: data,
  });
}

async function handleChat(req, res) {
  const rawInputPrompt = requireString(
    getInput(
      req,
      "raw_prompt",
      getInput(req, "prompt", getInput(req, "query", getInput(req, "question")))
    ),
    "Pesan"
  );

  const prompt =
    rawInputPrompt
      .replace(/^\[[\s\S]*?\]\s*/g, "")
      .replace(/^Pesan pengguna:\s*/i, "")
      .trim() || rawInputPrompt.trim();

  const promptIndo = buildIndonesianPrompt(prompt);

  const requestedModel = getInput(
    req,
    "model",
    "openai/gpt-4o"
  );

  let model = requestedModel;
  if (requestedModel === "GPT-4o") {
    model = "openai/gpt-4o";
  } else if (COPILOT_MODELS.includes(requestedModel.toLowerCase())) {
    model = "microsoft/copilot";
  }

  const isGeminiDirect =
    GEMINI_DIRECT_MODELS.includes(model) ||
    model.startsWith("gemini-");
  const isCopilot = model === "microsoft/copilot";

  if (!ALLOWED_MODELS.includes(model) && !isGeminiDirect && !isCopilot) {
    return sendJson(res, 400, {
      success: false,
      message: "Model tidak tersedia.",
      availableModels: ALLOWED_MODELS,
    });
  }

  const sessionId =
    getInput(req, "session_id") ||
    `haomi-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  // 1. Jika user memilih Microsoft Copilot (/api/ai/copilot)
  if (isCopilot) {
    let data = await callCopilotSmart(prompt);

    if (!isUsableAiResponse(data, prompt)) {
      data = await callGeminiSmart(prompt, "gemini-2.0-pro", "HAOMI_XML");
    }

    if (!isUsableAiResponse(data, prompt)) {
      return sendJson(res, 502, {
        success: false,
        message: "Layanan AI sedang sibuk, silakan coba kirim ulang.",
        session_id: sessionId,
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: "Berhasil mendapatkan jawaban.",
      session_id: sessionId,
      model: "microsoft/copilot",
      answer: extractAiAnswer(data),
      raw: data,
    });
  }

  // 2. Jika user memilih Gemini Direct (/api/ai/gemini)
  if (isGeminiDirect) {
    const chatId = getInput(req, "chatId", "HAOMI_XML") || "HAOMI_XML";
    let data = await callGeminiSmart(prompt, model, chatId);

    if (!isUsableAiResponse(data, prompt)) {
      data = await callCopilotSmart(prompt);
    }

    if (!isUsableAiResponse(data, prompt)) {
      return sendJson(res, 502, {
        success: false,
        message: "Layanan Gemini AI sedang sibuk, silakan coba lagi.",
        session_id: chatId,
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: "Berhasil mendapatkan jawaban.",
      session_id: data?.chatId || data?.session_id || chatId,
      model,
      answer: extractAiAnswer(data),
      raw: data,
    });
  }

  // 3. Jalur Utama /api/ai/aichat JERE API (dengan akhiran Bahasa Indonesia agar tidak membalas pakai bahasa Mandarin)
  let data = null;
  try {
    data = await callJerexd("/api/ai/aichat", {
      prompt: promptIndo,
      model,
      session_id: sessionId,
      ...(getInput(req, "reset") === "true" ? { reset: "true" } : {}),
    }, 20000);
  } catch {
    data = { status: false };
  }

  // Jika balasan masih berbahasa Mandarin atau technical issue, coba ulangi dengan sesi baru & penegasan Bahasa Indonesia
  if (!isUsableAiResponse(data, prompt)) {
    try {
      const retryIndo = await callJerexd("/api/ai/aichat", {
        prompt: `Tolong jelaskan dalam Bahasa Indonesia: ${prompt}`,
        model: model === "openai/gpt-4o" ? "anthropic/claude-opus-4.5" : "openai/gpt-4o",
        session_id: `haomi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      }, 16000);
      if (isUsableAiResponse(retryIndo, prompt)) {
        data = retryIndo;
      }
    } catch {}
  }

  // Cadangan 1: Endpoint /api/ai/gemini Jere API
  if (!isUsableAiResponse(data, prompt)) {
    try {
      const gemData = await callGeminiSmart(prompt, "gemini-2.0-pro", "HAOMI_XML");
      if (isUsableAiResponse(gemData, prompt)) {
        data = gemData;
      }
    } catch {}
  }

  // Cadangan 2: Endpoint /api/ai/copilot Jere API
  if (!isUsableAiResponse(data, prompt)) {
    try {
      const copData = await callCopilotSmart(prompt);
      if (isUsableAiResponse(copData, prompt)) {
        data = copData;
      }
    } catch {}
  }

  if (!isUsableAiResponse(data, prompt)) {
    return sendJson(res, 502, {
      success: false,
      message: "Server AI sedang padat, silakan coba kirim ulang pesanmu.",
      details: data,
      session_id: sessionId,
    });
  }

  return sendJson(res, 200, {
    success: true,
    message: "Berhasil mendapatkan jawaban.",
    session_id: data?.session_id || sessionId,
    model,
    answer: extractAiAnswer(data),
    history_count: data?.history_count,
    raw: data,
  });
}

async function handleAlightMotionSend(req, res) {
  const email = requireEmail(getInput(req, "email"));

  const data = await callJerexd("/api/am/send", {
    email,
  });

  return sendJson(res, 200, {
    success: data?.status !== false,
    message:
      data?.message ||
      (data?.status === false
        ? "Permintaan Alight Motion gagal."
        : "Selamat! Akun Alight Motion Anda berhasil diproses menjadi Premium (Durasi 1 Tahun)."),
    result: data,
  });
}

async function handleAlightMotionVerify(req, res) {
  const email = requireEmail(getInput(req, "email"));
  const link = requireHttpUrl(
    getInput(req, "link"),
    "Tautan verifikasi"
  );

  const data = await callJerexd("/api/am/verif", {
    email,
    link,
  });

  return sendJson(res, 200, {
    success: data?.status !== false,
    message:
      data?.message ||
      (data?.status === false
        ? "Verifikasi Alight Motion gagal."
        : "Selamat! Akun Alight Motion Anda berhasil diverifikasi menjadi Premium (Durasi 1 Tahun)."),
    result: data,
  });
}

async function handleUrlScan(req, res) {
  const url = requireHttpUrl(getInput(req, "url"));

  const data = await callJerexd("/api/tools/urlscan", {
    url,
  });

  return sendJson(res, 200, {
    success: data?.status !== false,
    message:
      data?.message ||
      (data?.status === false
        ? "Pemindaian URL gagal."
        : "Pemindaian keamanan URL selesai."),
    result: data,
  });
}

async function handleWhatsAppReact(req, res) {
  const url = requireHttpUrl(
    getInput(req, "url"),
    "URL WhatsApp"
  );

  const reactionInput = getInput(
    req,
    "reaction",
    "❤️"
  );

  const reactions = Array.isArray(reactionInput)
    ? reactionInput.join(",")
    : String(reactionInput)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .join(",");

  if (!reactions) {
    const error = new Error("Reaction wajib diisi.");
    error.statusCode = 400;
    throw error;
  }

  const data = await callJerexd("/api/whatsapp/reactch", {
    url,
    reaction: reactions,
  });

  return sendJson(res, 200, {
    success: data?.status !== false,
    message:
      data?.message ||
      (data?.status === false
        ? "Reaksi WhatsApp gagal."
        : "Selamat! Reaksi emoji saluran WhatsApp berhasil dikirim."),
    result: data,
  });
}

// 1. Viu Premium (/api/movie/viuprem)
async function handleViuPrem(req, res) {
  const extraParams = {};
  const query = getInput(req, "query", "");
  if (query) extraParams.query = query;

  const data = await callJerexd("/api/movie/viuprem", extraParams);

  return sendJson(res, 200, {
    success: data?.status !== false,
    message:
      data?.message ||
      (data?.status === false
        ? "Gagal mengambil data Viu Premium."
        : "Selamat! Akses akun Viu Premium VIP berhasil diambil."),
    result: data,
  });
}

// 2. Info Kota (/api/search/infokota)
async function handleInfoKota(req, res) {
  const kota = requireString(
    getInput(req, "kota", getInput(req, "city", "Jombang")),
    "Nama kota"
  );

  const data = await callJerexd("/api/search/infokota", {
    kota,
  });

  if (data && typeof data === "object") {
    const target = data.result && typeof data.result === "object" ? data.result : data;
    const rawDesc = String(target.deskripsi || target.description || "").trim();
    const isMissingDesc =
      !rawDesc ||
      /tidak ada deskripsi|no description|-|null/i.test(rawDesc);

    const namaWilayah = target.nama || target.kota || kota;
    const prov = target.provinsi || "Indonesia";
    const negara = target.negara || "Indonesia";
    const pimpinan = target.bupati || target.walikota || target.wali_kota || target.gubernur || "";
    const keyLower = String(namaWilayah).toLowerCase().replace(/^(kabupaten|kota)\s+/i, "").trim();

    if (isMissingDesc) {
      if (CITY_KNOWLEDGE_BASE[keyLower]) {
        target.deskripsi = CITY_KNOWLEDGE_BASE[keyLower] + (pimpinan ? ` Saat ini wilayah ${namaWilayah} dipimpin oleh ${pimpinan}.` : "");
      } else {
        target.deskripsi =
          `Ini adalah deskripsi tentang ${namaWilayah}: ${namaWilayah} merupakan salah satu daerah otonom yang terletak di Provinsi ${prov}, ${negara}.` +
          (pimpinan ? ` Pemerintahan daerah ${namaWilayah} dipimpin oleh ${pimpinan}.` : "") +
          (target.url ? ` Informasi profil wilayah dan ensiklopedia resmi dapat diakses melalui ${target.url}.` : "");
      }
    } else if (!/^ini adalah deskripsi tentang/i.test(rawDesc)) {
      target.deskripsi = `Ini adalah deskripsi tentang ${namaWilayah}: ${rawDesc}`;
    }
  }

  return sendJson(res, 200, {
    success: data?.status !== false,
    message:
      data?.message ||
      (data?.status === false
        ? `Pencarian info kota ${kota} gagal.`
        : `Informasi lengkap wilayah ${kota} berhasil ditemukan.`),
    result: data,
  });
}

// 3. Tmp Files (/api/tools/tmpfiles)
async function handleTmpFiles(req, res) {
  const url = getInput(req, "url", "");
  const text = getInput(req, "text", "");
  const fileBase64 = getInput(req, "file_base64", "");
  const fileName = getInput(req, "file_name", "upload.bin");
  const fileMime = getInput(req, "file_mime", "application/octet-stream");

  if (fileBase64) {
    try {
      const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(cleanBase64, "base64");
      const { boundary, buffer: bodyBuffer } = buildMultipartPayload(
        { apikey: API_KEY, ...(url ? { url } : {}) },
        { fieldName: "file", fileName, mimeType: fileMime, buffer }
      );

      const postData = await postJerexdMultipart("/api/tools/tmpfiles", {}, bodyBuffer, boundary, 90000);
      if (postData && postData.status !== false) {
        return sendJson(res, 200, {
          success: true,
          message: postData.message || "Selamat! File Anda berhasil diunggah ke TmpFiles Cloud.",
          result: postData,
        });
      }
    } catch {
      // Fallback di bawah
    }
  }

  const params = {};
  if (url) params.url = url;
  if (text) params.text = text;

  const data = await callJerexd("/api/tools/tmpfiles", params);

  return sendJson(res, 200, {
    success: data?.status !== false,
    message:
      data?.message ||
      (data?.status === false
        ? "Permintaan TmpFiles gagal."
        : "Selamat! File berhasil diproses ke penyimpanan sementara TmpFiles."),
    result: data,
  });
}

// 4. Web2APK (/api/tools/web2apk)
async function handleWeb2Apk(req, res) {
  const url = requireHttpUrl(
    getInput(req, "url", "https://hao-ai-kappa.vercel.app/"),
    "URL Website"
  );
  const name = requireString(
    getInput(req, "name", "Ai Haomi"),
    "Nama Aplikasi"
  );
  const fileBase64 = getInput(req, "file_base64", "");
  const fileName = getInput(req, "file_name", "icon.png");
  const fileMime = getInput(req, "file_mime", "image/png");

  let filePart = null;
  if (fileBase64) {
    const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, "");
    filePart = {
      fieldName: "file",
      fileName,
      mimeType: fileMime,
      buffer: Buffer.from(cleanBase64, "base64"),
    };
  }

  let data = null;

  try {
    const { boundary, buffer: bodyBuffer } = buildMultipartPayload(
      { url, name, apikey: API_KEY },
      filePart
    );

    data = await postJerexdMultipart("/api/tools/web2apk", { url, name }, bodyBuffer, boundary, 180000);
  } catch (postErr) {
    try {
      data = await callJerexd("/api/tools/web2apk", { url, name }, 180000);
    } catch {
      throw postErr;
    }
  }

  return sendJson(res, 200, {
    success: data?.status !== false,
    message:
      data?.message ||
      (data?.status === false
        ? "Pembuatan Web2APK gagal."
        : `Selamat! Aplikasi Android ${name} (.apk) berhasil dibangun.`),
    result: data,
  });
}

// 5. Cek Banned WA (/api/whatsapp/checkban)
async function handleWhatsAppCheckBan(req, res) {
  const rawNumber = requireString(
    getInput(req, "number", getInput(req, "nomor", "")),
    "Nomor WhatsApp"
  );
  const number = rawNumber.replace(/[^0-9]/g, "");

  if (!number || number.length < 7) {
    const error = new Error("Masukkan nomor WhatsApp yang valid (contoh: 081249309278).");
    error.statusCode = 400;
    throw error;
  }

  const data = await callJerexd("/api/whatsapp/checkban", {
    number,
  });

  return sendJson(res, 200, {
    success: data?.status !== false,
    message:
      data?.message ||
      (data?.status === false
        ? "Pengecekan status nomor WA gagal."
        : `Pengecekan status nomor WhatsApp ${number} selesai.`),
    result: data,
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST, OPTIONS");

    return sendJson(res, 405, {
      success: false,
      message: "Metode HTTP tidak didukung.",
    });
  }

  if (!API_KEY) {
    return sendJson(res, 500, {
      success: false,
      message: "API key belum tersedia di backend.",
    });
  }

  const action = String(
    getInput(req, "action", "chat")
  ).toLowerCase();

  try {
    switch (action) {
      case "chat":
      case "gemini":
      case "copilot":
        if (action === "copilot" && !getInput(req, "model")) {
          req.body = { ...(req.body || {}), model: "microsoft/copilot" };
        } else if (action === "gemini" && !getInput(req, "model")) {
          req.body = { ...(req.body || {}), model: "gemini-2.0-pro" };
        }
        return await handleChat(req, res);

      case "gemini-models":
        return await handleGeminiModels(req, res);

      case "am-send":
        return await handleAlightMotionSend(req, res);

      case "am-verify":
      case "am-verif":
        return await handleAlightMotionVerify(req, res);

      case "urlscan":
        return await handleUrlScan(req, res);

      case "whatsapp-react":
      case "reactch":
        return await handleWhatsAppReact(req, res);

      case "viuprem":
      case "viu":
        return await handleViuPrem(req, res);

      case "infokota":
      case "kota":
        return await handleInfoKota(req, res);

      case "tmpfiles":
      case "tmpfile":
        return await handleTmpFiles(req, res);

      case "web2apk":
        return await handleWeb2Apk(req, res);

      case "checkban":
      case "wa-checkban":
        return await handleWhatsAppCheckBan(req, res);

      case "models":
        return sendJson(res, 200, {
          success: true,
          models: ALLOWED_MODELS,
        });

      default:
        return sendJson(res, 400, {
          success: false,
          message: "Action tidak dikenal.",
          availableActions: [
            "chat",
            "gemini",
            "gemini-models",
            "copilot",
            "models",
            "am-send",
            "am-verify",
            "urlscan",
            "whatsapp-react",
            "viuprem",
            "infokota",
            "tmpfiles",
            "web2apk",
            "checkban",
          ],
        });
    }
  } catch (error) {
    const statusCode =
      error.statusCode ||
      error.response?.status ||
      500;

    return sendJson(res, statusCode, {
      success: false,
      message: getApiError(error),
      ...(error.response?.data
        ? { details: error.response.data }
        : {}),
    });
  }
};

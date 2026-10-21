(() => {
  "use strict";

  if (window.__HAOMI_CONSOLE_BOOTED__) return;
  window.__HAOMI_CONSOLE_BOOTED__ = true;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Endpoint utama tetap /api sesuai arsitektur backend
  const API_URL = "/api";
  // Pengaturan nama Creator & Prefix Order ID (ubah di sini kalau mau ganti nama selain @haomi)
  const BRAND_CREATOR = "@haomi";
  const BRAND_ORDER_PREFIX = "haomi";
  const STORAGE_KEY = "haomi_workspace_v2";
  const SETTINGS_KEY = "haomi_settings_v1";
  const TELEMETRY_KEY = "haomi_telemetry_v1";
  const SOUND_KEY = "haomi_sound_fx_v1";
  const ROBOT_AVATAR = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAQDAwQDAwQEBAQFBQQFBwsHBwYGBw4KCggLEA4RERAOEA8SFBoWEhMYEw8QFh8XGBsbHR0dERYgIh8cIhocHRz/2wBDAQUFBQcGBw0HBw0cEhASHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBz/wAARCACgAKADASIAAhEBAxEB/8QAHAAAAQUBAQEAAAAAAAAAAAAAAgABAwYHCAUE/8QAPhAAAQMDAwIEBAIHBQkAAAAAAQACAwQFEQYSITFBBxNRYSIycYFCoQgUFVKRwdEWIzNisSQlY2SChKKy4f/EABoBAAMBAQEBAAAAAAAAAAAAAAABAgMEBQb/xAApEQACAgEEAAQGAwAAAAAAAAAAAQIRAwQSITEFBkFhEyJRcZGxMkKh/9oADAMBAAIRAxEAPwDhQJ0kkzISSfCZAxJJ8IsIsQOEsI8JwPQJWAOMJY9ke0+2EsY7pWK0BhNhHjPdLBRYWgNqHCkx6hLH3TsZGkiIQ4TsBJJJJDobCZEmKAHSSSTEJOAkEQHcpDEG85RAZ6JAZ/ojSslsENRYT44yeB7q+6f0ja4qOCrvZqp6yf4obVB/dnb2dI/q0HqABnHcIJKE1pkeGMBc89GtGSfsvYh0jqCoaHRWK5vaRkOFK/B/Jbzp7SV4r6ilpKWClsVNJTzTsZSxBjtjCwHL/mcSXDqeyvFH4PUlXTQzVt3q5ZJWNecvPGQD3Puq2is5On0jqCmaXTWO5MaBkk0r8D8l472FkhjcC146tcMEfZdj1vg/TUVNNNQ3irikjY54w8joM9j7Kjai03drVNVUtdTUt+po4YZpG1UQkdseXgYf8zcbT0PdJxCzm/CYtWg37SVpqqCor7A+piqoPimtU/8AeODe7o39XAdSCM47lUDqMjkJDIyPXohIUpCEjCLKUiMjCZH7oD146JlCSSSTBiSCScDhAhwEYGUwGeEYGFLJbHHCcD1TgK4eGlqjuWq6eWdjX0ttjdXzNcOHCPGAfq4tSJLQdNu0FYKOpkhhdfaiJ9TUOljDjSjaCyMZ6HbkuPqcdldfCp1klgN3u80Qqw1rnGdwDW+h56lUPV2oZbj+0pnkyGWpEY3chzS14dleLZblLZLoJPM3TwPIa8j5cH8I7f6+6uIHSj9bUlVraipG0VwgaykfE2onpzFFIZXNcxozzyInYyByMLw9V+MtB4f18FouNDX1Ewha9ktOGbHx8gdXDkYwfcL5IbpDq6zMlaCalg2PDDhxHBIB/eBAc0/vNHqV5V3v8VTJFFddHS3qenZsFaww+XKDzuaHOBGeCQRwchErMpXfsWHSfjHQeINdPaLfb7hA8wufLNOGbGMyAejjyc4Hv9F6s2s6Sh1fcKeWkrJaeSkjidVxw74YzEXF7XEc8ea3nBGThUqy6ipqGeZts0dPZp549rqp/leWwDnLtriTjk4A5OAvVvWlbvSacklpqeRkLmCR+8/GGckA++SXO9XOPoElYRTvrgzDUVyiGoKyvoWthGHuj2Hg8dQpX6aOv7JcKmGGFt8pY2VNOYow11W3aS+N2OrsbS0+ox3VbqI5ZqtsQdsc54HIyPqQrFpe/SWeW3TsLmObUFriBjgMYBhDNTJiBjI7ocK5eJdoZbNVTywta2lucbLhC1owGiTJIH0cHBU8hSBER3QEYUpCAjCaKTI+iScjKZMoSMIQiHZABtCMcoQjCkzH6Ban4W2qT+zWrLsD0hFGBgc7mOecHsQQzp6rLRyVuvhxTzs8LbmW05a11RUVEj3naDEIWAOHrzwMeqTMc0tsHL6Hl3rSEsGkaWsLSZJqjH22E/1VIayCpqmRVbnxSj4d7Orh2yPUfn9V0nqVkf8AYCw1Tow0RGkmkZ6bm7HD+L1zLqE+dXzSNGAXE4HZRjkPHK+GSQ6irbN+s0tNVHyy7aXsOA7HdRu1DcJHZdW1BJ/4hXhOnNU3ef8AGHz/AOYdnfX1Rxtc4tXSmdCo1LQFzknvdtFTPI+I1MW4OcSMbxldlammpILLXVZhEsEcbnOaCANvqSeAB1J7BcL6cc+n8t4yHNcCFstD4psrBS01xeX2+lPmPi7VErfl3erGnnHdwHZvIxdGfXaihbeZ2UjXPc8nGW4Lc9gOo+/OOuDwPufpCZmmZq3yyHR1BaRjoAxp/mh0zcIqvWYqJQHMllJOfcrc30MEvh5fKzyw5u6snY312lzGj/wC5JzaZz7nuo5y8VbTINP6TupOc0/6mQGgbdsbHjJ7kkv6rK+oW8eJdLUu8MrcZIC5jainnhfHyBCYHAuPpzwcrCCNpWoYZboqX1APCjcFK4ICmbIiKFGeiEqjQQRtHKAIx1QxPokCMdEAUjVJDPutUMclxpGyxebEZW74843jPLfv0+63fc6ustvp5oY4a2eYmWOMY2kO5GB0GzDQPTCx3SMTf7R2YvGW/rkGc+nmNW4VdrePFDVLG8EbHxtHYkAcfxWcpVwcuTMo8Ms11vdrumi7lbYqoGpoI3U7tzC1hlYQ7a15GCcjHXrwufrvayA5/wCJ24n+J/lhdIfoyWK3P1fVw3mmgklltrY4I6poO4HBeADwSXb8987lZfEfwIs1w1HUfsd9JQZAP6s2QtHI7A8LGLabSPmtX4/i0U38S6ur96s4ngtEgduGchTm3YHxYa4H9zjH2XS1R+jnfqaJ8sELZw0ZDW4+L6EcKoVvhRfI5CHWS4D/ALd39Frva7Rtg8zaXJyp/nj9mRU1G5pyxwcR22/1X2wxy9MkduFqNB4U39z8MslwOf8Al3f0VxpP0cdQTMjlnY2nDhksIGW/Uk4T3v0RefzNpMStz/HP6Mh0zRyNqxM3O+NzHD3+IZ/LK36TU1oofDy2WV9aDcLlTsp2hjC5nmv+Mtc8DaCTkdepwrT4Y+BdnodRQftV9LXloLjTukLxwO4HCqn6T1jtztZwx2amhjqYrc6OZtKAC3GdgIHQh3l475x3WMrb5MtF49j1ct2NOm6/yzM4o6uk0zcv1el8+qopWPbvbvaMnoQexjBaR6ErBLnGyOvqmxR+XEJXbIwc7Bnhv26Lp3Sc1TTeJNltbnf7LXukfUNcM7y3cOf4LnjVkTBqK8+W0CMVs+0DoB5jsLZTvg+kjkT4K4UBHCkcoytDdEZHKAqR3VRnoU0WuhwjHVRhSDqmwYYUjThRhGOQpM2eta611LV08rD8UUjXj6hwK1y06zN18TDWtLmxXEMgdI4fCyTAIyfq1Yix+OR1C0bTdoNVbry6nlL4fIjq4aqL5oZGuJHH7wPBHocqHBPswlhjK7OitYWaagjp7pQyMZWMa2acQv2h0uBuljcPlJPJ7O69eVSNXeLVbqB1K6eT/eUDWsfM34XSAdC5vZ3uMgqpWnxcmu9hmpp2/C1uyUAcwPP4m+sbuuPwnOFndddaiCWQB+Wk7iDgt59jwsVid/MeLqPBcefJeSPXR0Ro/wAbbra3GOWdzow3JMh4b7letUfpEXx8zzHVQsZnAa5pz+S5Wi1HJnYA1pPduR+Wcfkl+13/ALxVqMl0zzl5U0+9y29+nKR1pbv0gr0+QGWshLem1jTk/wARz9OvovO1d4vXu6SiOJ7xEWggxfK4HuD6LmWmvL8FpcV90mr6lrRFiN5HVz9xz/052598IcZPtky8qYHNOuF6O2jofSXidVWOlqjBUFl4qAWB4+ORjT12N/e9zwFcNP6fkuNvq7xcDGK5sT5aZkr9zYpNpxLI4/M8Zz6N56nlcrWm8VNRVRSSTgMYRIWjDG4GecDAV91X42TxWeGjt7SyncNkbSPiqXgfO4do29Q38Rxn0GfwvmpHq6DwTDpZ3Be/2+x5kmsXWXxDbWy73U9AJIGyAYD5MEnB+rlkdyq3VFVUSuOXSSOcfu4lXjVFq/Vqa1ebMWUUdO+okqpfmmkLvi47uc7jHoPRZs5xPJ6rdQSdns/BinaBJyoyiKE9FZuiNyAoz1QFNFroQRBAiBTGShGDhRtPCIKSCQcFaT4PVJdc71bc8Vtvc4D1dG5rv9C5ZrnPRWXQN4bY9X2qrkcGw+YYpSegZI0sP/tn7JEM+VgfpfVc0D4waeoDow13DZGkktyfrxnsVJcKdrd7og5zXjfG1/UA9iO5GMfUFW7U+k6ittVO+qhMcs4kfRylwO9zHbXsPocgOx23A91U7HL+0s09Q4trY3bXMcMHn8X8QMj1KPcIzU1aKqHlsrTnuvuDzjqjvNudQ1z4yMA/E1Qs5aFSNkkyaN5DghjeZZye2UPqV99hon1lUGtGQ0bj/L80MGkexTQNmkaHBzGxtD5WxfiwPlHoTkD6/RFDbKrUWo6iqijiFFbmsa9oeAGNBAIbnr8Rx79V9UkD4pIaWiJkuM8mxkbRkjtv/iTgeuCrnTacmpbTJR2qMSRURjkrZ2uAEkrztYAe4bkkDvhzlJlKagrZXPF2fbc7LbwcCjt7HOHo6RznH8tqzk8lWLXd3bfNW3WrjOYTL5URHTYwBjfybn7quE4HugXqCShKclA4/mmUCT1QlOShVGgk4KZLugCQHujBUQKIHHCTJkiUHCLhRgogUiasvkuqqi82WnYah7aile100eeHuDdokHoS0AH3XgSfrVbqOnqImSOaQDM+Nv8AhsPwl5PsecleNHK6N4cw4cFZ9N3MRVZc1wY97DGWnoQSDg+3CRKSinSPdvOjbre6iSNjGeXRUs1Q6uaPhn2jLWBvZ5xyOg5I4ws6ZAMgebLg+hH9Ftun7i7zI6SllaymqP7p8pcN1K0/NgH5hjIb1wTzwFklxoBbLjWW+ZhDqWZ8WWuwfhJH3GMJY3y0x4pv+LCo7bBMD5j6nGM5D2/zatMs/h3d9P1j6aWNrKarpYKptwcMiJrm5Me38UgJwB07nAVf0Jp+mvNXNBJE57TGGN3PcCHvcGA5BHTcT9lp961L5jZoLlK2WGlPkse14D64NPwnA+RuMb84ycgcFGR8pIMk/wCqMWppblZ9UVdU8T0+YnNic4Y8yM/CHA9weTkL1Rq6otNkqYW1D3TVTy+KL8Mbtu0y+5xkD/4vl1lfHV1zdLLKJZgwR4aMMaAT8Lf8oyqe+R0ji55y4p9g6klaB4CEpHnlCUx9CJCAlOfRAU0VFDE8JkjykmUJMnTIGhwcIgfVAE4KAJAUYKiDsIgcJUQ0SI2SOjeHscWuByCFEHJ8pElnt1/EcY2gNqWjjHRx9fb3XzVU81wqZqmqe588rtznYAJ7Z/L/AEXg8Ig4jo4j6FC4GqXJYaC4VlqnZNQzyxSNPY9R0/mfzX1XXUjZIcNaH1L24O7kMPr7n0VULierifqU3CHT5B0w3yukc5z3FzjySUBTZTF2UCHJQOPokShJTopIWUJOUs5TZTLFlOmToASZOlhADJJ8JYQAhwnymwkgQeUgcd0HRPn1QFEmUs+yjynz7pUKg8pZQZ902UUFBk+6bKHKbKY6HymPKSXKBjJYT8pYQA2EifRJMUAf/9k=";

  const models = {
    "openai/gpt-4o": ["GPT-4o", "OpenAI"],
    "openai/gpt-4o-mini": ["GPT-4o mini", "OpenAI"],
    "openai/gpt-5.6-terra": ["GPT-5.6 Terra", "OpenAI"],
    "openai/gpt-5.5": ["GPT-5.5", "OpenAI"],
    "openai/gpt-5.4": ["GPT-5.4", "OpenAI"],
    "openai/gpt-5.3-chat": ["GPT-5.3 Chat", "OpenAI"],
    "openai/gpt-5.1-instant": ["GPT-5.1 Instant", "OpenAI"],
    "openai/gpt-5": ["GPT-5", "OpenAI"],
    "chatday/ai-chat": ["Chatday AI", "Chatday"],
    "xai/grok-4.1-fast-non-reasoning": ["Grok 4.1 Fast", "xAI"],
    "anthropic/claude-haiku-4.5": ["Claude Haiku 4.5", "Anthropic"],
    "anthropic/claude-sonnet-5": ["Claude Sonnet 5", "Anthropic"],
    "anthropic/claude-sonnet-4.6": ["Claude Sonnet 4.6", "Anthropic"],
    "anthropic/claude-opus-4.5": ["Claude Opus 4.5", "Anthropic"],
    "anthropic/claude-opus-4.6": ["Claude Opus 4.6", "Anthropic"],
    "anthropic/claude-opus-4.7": ["Claude Opus 4.7", "Anthropic"],
    "anthropic/claude-opus-4.8": ["Claude Opus 4.8", "Anthropic"],
    "deepseek/deepseek-v4-pro": ["DeepSeek V4 Pro", "DeepSeek"],
    "deepseek/deepseek-v4-flash": ["DeepSeek V4 Flash", "DeepSeek"],
    "deepseek/deepseek-v3.2-thinking": ["DeepSeek V3.2 Thinking", "DeepSeek"],
    "gemini-2.0-pro": ["Gemini 2.0 Pro", "Google"],
    "gemini-pro": ["Gemini Pro", "Google"],
    "gemini-flash": ["Gemini Flash", "Google"],
    "google/gemini-3.1-pro-preview": ["Gemini 3.1 Pro", "Google"],
    "google/gemini-3-pro-preview": ["Gemini 3 Pro", "Google"],
    "google/gemini-3.1-flash-lite": ["Gemini 3.1 Flash Lite", "Google"],
    "microsoft/copilot": ["Microsoft Copilot", "Microsoft"],
    "alibaba/qwen3-max": ["Qwen3 Max", "Alibaba"],
    "meta/llama-4-maverick": ["Llama 4 Maverick", "Meta"],
    "moonshotai/kimi-k2.6": ["Kimi K2.6", "Moonshot AI"]
  };

  const responseStyleLabels = {
    standard: "Standar",
    concise: "Ringkas",
    technical: "Teknis",
    casual: "Santai"
  };

  const responseStyleOrder = ["standard", "casual", "concise", "technical"];

  const responseStylePrompts = {
    standard: "",
    concise: "",
    technical: "",
    casual: ""
  };

  const responseLengthPrompts = {
    auto: "",
    short: "[Panjang jawaban: Buat singkat & padat, cukup poin paling penting saja.]",
    detailed: "[Panjang jawaban: kupas secara lengkap, terstruktur, dan detail dari awal sampai akhir.]"
  };

  const INTERACTIVE_CHOICE_INSTRUCTION = "";

  const defaultSettings = {
    theme: "dark",
    density: "standard",
    streamSpeed: "cyber",
    streamDelayMs: 18,
    defaultModel: "openai/gpt-4o",
    responseStyle: "standard",
    responseLength: "auto",
    interactiveChoices: true,
    userNickname: "",
    aiLanguage: "id",
    autoHideJson: true,
    customAiInstruction: "",
    cmatrixEnabled: true,
    cmatrixIntensity: "vivid",
    glassLevel: "standard",
    enterToSend: true,
    saveHistory: true,
    soundFx: false,
    defaultWaEmoji: "🙄,💦,🥰,😋",
    customWaEmojis: []
  };

  // Pastikan kapsul Dynamic Island (khusus notifikasi on/off) & pengaturan suara tersedia
  function ensureDynamicIslandDOM() {
    if (!$("#haomiIslandAndBottomFix")) {
      const style = document.createElement("style");
      style.id = "haomiIslandAndBottomFix";
      style.textContent = `
        .dynamic-island-wrap {
          position: fixed !important;
          top: calc(10px + env(safe-area-inset-top, 0px)) !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          z-index: 220 !important;
          pointer-events: none !important;
        }
        .dynamic-island {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          transform: translateY(-26px) scale(0.86) !important;
          transition:
            opacity 0.26s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.34s cubic-bezier(0.22, 1.25, 0.36, 1),
            visibility 0.26s linear !important;
        }
        .dynamic-island.is-notifying {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          transform: translateY(0) scale(1) !important;
        }
        .island-pod-body { display: none !important; }
        html, body {
          height: 100dvh !important;
          max-height: 100dvh !important;
          min-height: 100dvh !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          background-color: var(--bg-base) !important;
        }
        .app-shell, .main-panel, .chat-view {
          height: 100dvh !important;
          max-height: 100dvh !important;
          padding-bottom: 0 !important;
          margin-bottom: 0 !important;
          border-bottom: none !important;
        }
        .view, .chat-view {
          height: auto !important;
          flex: 1 1 0% !important;
          min-height: 0 !important;
        }
        .composer-dock {
          margin: 0 auto !important;
          padding: 6px 12px calc(10px + env(safe-area-inset-bottom, 0px)) !important;
          background: transparent !important;
          border-top: none !important;
          border-bottom: none !important;
          box-shadow: none !important;
        }
        .composer-dock::after, .main-panel::after, .app-shell::after {
          display: none !important;
          content: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    const existingIsland = $("#dynamicIsland");
    if (existingIsland) {
      existingIsland.classList.remove("is-expanded", "is-notifying");
      existingIsland.setAttribute("aria-hidden", "true");
      const pod = $("#islandPodBody", existingIsland);
      if (pod) pod.remove();
    } else {
      const wrap = document.createElement("div");
      wrap.className = "dynamic-island-wrap";
      wrap.id = "dynamicIslandWrap";
      wrap.innerHTML =
        `<div class="dynamic-island" id="dynamicIsland" role="status" aria-live="polite" aria-hidden="true">` +
          `<div class="island-compact-row" id="islandCompactRow">` +
            `<div class="island-left">` +
              `<span class="island-orb" id="islandOrb"></span>` +
              `<span class="island-text" id="islandText">Notifikasi</span>` +
            `</div>` +
            `<div class="island-wave" aria-hidden="true">` +
              `<span></span><span></span><span></span><span></span>` +
            `</div>` +
          `</div>` +
        `</div>`;
      document.body.prepend(wrap);
    }

    // Pastikan tombol Suara Sentuhan ada di dalam Pengaturan
    const settingsBody = $(".settings-body");
    if (settingsBody && !$("#soundFxToggle")) {
      const row = document.createElement("div");
      row.className = "settings-row";
      row.innerHTML =
        `<div class="settings-copy">` +
          `<label for="soundFxToggle"><strong>Suara Sentuhan Tombol</strong></label>` +
          `<p>Bunyi klik halus waktu kamu menekan tombol atau perintah cepat.</p>` +
        `</div>` +
        `<label class="switch">` +
          `<input type="checkbox" id="soundFxToggle">` +
          `<span class="switch-slider"></span>` +
        `</label>`;
      const actionsBox = $(".settings-actions-box", settingsBody);
      if (actionsBox) {
        settingsBody.insertBefore(row, actionsBox);
      } else {
        settingsBody.appendChild(row);
      }
    }
  }

  ensureDynamicIslandDOM();

  const els = {
    sidebar: $("#sidebar"),
    overlay: $("#sidebarOverlay"),
    conversationList: $("#conversationList"),
    historyCount: $("#historyCount"),
    historySearch: $("#historySearch"),
    messages: $("#messages"),
    welcome: $("#welcomeScreen"),
    chatScroll: $("#chatScroll"),
    chatForm: $("#chatForm"),
    input: $("#chatInput"),
    send: $("#sendButton"),
    modelTrigger: $("#modelPickerTrigger"),
    modelProvider: $("#selectedModelProvider"),
    modelLabel: $("#selectedModelLabel"),
    navModelIndicator: $("#navModelIndicator"),
    modelDialog: $("#modelDialog"),
    modelList: $("#modelList"),
    modelSearch: $("#modelSearch"),
    closeModel: $("#closeModelDialog"),
    breadcrumb: $("#breadcrumbTitle"),
    activeChatTitle: $("#activeChatTitle"),
    chatTitleDivider: $("#chatTitleDivider"),
    settings: $("#settingsModal"),
    defaultModel: $("#defaultModelSelect"),
    responseStyle: $("#responseStyleSelect"),
    enterToSend: $("#enterToSendToggle"),
    saveHistory: $("#saveHistoryToggle"),
    soundFx: $("#soundFxToggle"),
    defaultWaEmoji: $("#defaultWaEmojiInput"),
    enterHintBadge: $("#enterHintBadge"),
    welcomeModelBadge: $("#welcomeModelBadge"),
    welcomeModelText: $("#welcomeModelText"),
    welcomeStyleBadge: $("#welcomeStyleBadge"),
    welcomeStyleText: $("#welcomeStyleText"),
    composerToolsBtn: $("#composerToolsButton"),
    composerToolsMenu: $("#composerToolsMenu"),
    terminalInput: $("#terminalCommandInput"),
    statTotalReq: $("#statTotalReq"),
    statSuccessRate: $("#statSuccessRate"),
    statAvgLatency: $("#statAvgLatency"),
    dashActiveModel: $("#dashActiveModel"),
    dashActiveStyle: $("#dashActiveStyle"),
    boxActiveModel: $("#boxActiveModel"),
    boxAiStyle: $("#boxAiStyle"),
    boxPingTest: $("#boxPingTest"),
    boxSessionInfo: $("#boxSessionInfo"),
    pingStatusSub: $("#pingStatusSub"),
    slashCmdMenu: $("#slashCmdMenu"),
    metricOS: $("#metricOS"),
    metricBrowser: $("#metricBrowser"),
    metricBattery: $("#metricBattery"),
    metricResolution: $("#metricResolution"),
    liveClockText: $("#liveClockText"),
    toast: $("#toastContainer"),
    dynamicIsland: $("#dynamicIsland"),
    islandOrb: $("#islandOrb"),
    islandText: $("#islandText"),
    islandPodBody: $("#islandPodBody"),
    islandClock: $("#islandClock"),
    islandPing: $("#islandPing"),
    islandFps: $("#islandFps"),
    islandSoundBtn: $("#islandSoundBtn"),
    islandSoundLabel: $("#islandSoundLabel"),
    islandFocusBtn: $("#islandFocusBtn"),
    islandThemeBtn: $("#islandThemeBtn"),
    islandThemeLabel: $("#islandThemeLabel")
  };

  let settings = loadSettings();
  let state = loadState();
  let telemetry = loadTelemetry();
  let busy = false;
  let requestId = 0;
  let lastFocusedElement = null;
  let activeProviderFilter = "all";
  let pendingResetSession = false;
  let clearHistoryConfirmTimer = null;
  let forceShowHud = false;
  let activeStreamCancel = null;
  let islandTimer = null;
  let lastMeasuredPing = 12;
  let soundEnabled = false;
  let audioCtx = null;

  try {
    const savedSound = localStorage.getItem(SOUND_KEY);
    soundEnabled = savedSound !== null ? savedSound === "1" : Boolean(settings.soundFx);
  } catch {
    soundEnabled = Boolean(settings.soundFx);
  }

  function id() {
    return window.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  // Efek suara sentuhan halus (Web Audio API)
  function playCyberTick(freq = 640, duration = 0.045) {
    if (!soundEnabled) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.024, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {}
  }

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
      return { ...defaultSettings, ...saved };
    } catch {
      return { ...defaultSettings };
    }
  }

  function saveSettings(nextSettings) {
    settings = { ...settings, ...nextSettings };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      localStorage.setItem("haomi_theme_pref", settings.theme);
    } catch {
      toast("Pengaturan belum bisa disimpan di browser ini.", true);
    }
    applySettingsToUI();
  }

  function loadTelemetry() {
    try {
      const saved = JSON.parse(localStorage.getItem(TELEMETRY_KEY) || "null");
      if (saved && typeof saved === "object") {
        return {
          totalRequests: Number(saved.totalRequests) || 0,
          successCount: Number(saved.successCount) || 0,
          totalLatencyMs: Number(saved.totalLatencyMs) || 0
        };
      }
    } catch {}
    return { totalRequests: 0, successCount: 0, totalLatencyMs: 0 };
  }

  function recordTelemetry(success, latencyMs) {
    telemetry.totalRequests += 1;
    if (success) telemetry.successCount += 1;
    if (latencyMs > 0) {
      telemetry.totalLatencyMs += latencyMs;
      lastMeasuredPing = latencyMs;
    }
    if (settings.saveHistory) {
      try {
        localStorage.setItem(TELEMETRY_KEY, JSON.stringify(telemetry));
      } catch {}
    }
    renderTelemetryStats();
  }

  function getIdleIslandLabel() {
    const activeModel = activeConversation()?.model || getDefaultModel();
    const avg = telemetry.totalRequests > 0
      ? Math.round(telemetry.totalLatencyMs / telemetry.totalRequests)
      : lastMeasuredPing;
    const pingText = avg > 0 ? `${avg} ms` : "Siap";
    return `${modelName(activeModel)} · ${pingText}`;
  }

  function updateIslandIdleText() {
    if (!els.islandText || !els.dynamicIsland) return;
    if (!els.dynamicIsland.classList.contains("is-notifying")) {
      els.islandText.textContent = getIdleIslandLabel();
    }
  }

  function renderTelemetryStats() {
    if (els.statTotalReq) {
      els.statTotalReq.textContent = String(telemetry.totalRequests);
    }
    if (els.statSuccessRate) {
      const rate = telemetry.totalRequests > 0
        ? Math.round((telemetry.successCount / telemetry.totalRequests) * 100)
        : 100;
      els.statSuccessRate.textContent = `${rate}%`;
    }
    if (els.statAvgLatency) {
      const avg = telemetry.totalRequests > 0
        ? Math.round(telemetry.totalLatencyMs / telemetry.totalRequests)
        : lastMeasuredPing;
      els.statAvgLatency.textContent = avg > 0 ? `${avg} ms` : "12 ms";
      if (els.islandPing) els.islandPing.textContent = avg > 0 ? `${avg} ms` : "12 ms";
    }
    updateIslandIdleText();
  }

  function measureNetworkPing(showFeedback = false) {
    const t0 = performance.now();
    if (els.pingStatusSub && showFeedback) {
      els.pingStatusSub.textContent = "Mengecek koneksi...";
    }
    fetch(window.location.href, { method: "HEAD", cache: "no-store" })
      .then(() => {
        const ms = Math.max(8, Math.round(performance.now() - t0));
        lastMeasuredPing = ms;
        if (els.statAvgLatency) els.statAvgLatency.textContent = `${ms} ms`;
        if (els.islandPing) els.islandPing.textContent = `${ms} ms`;
        if (els.pingStatusSub) {
          els.pingStatusSub.textContent = `${ms < 120 ? "Sangat ngebut" : "Koneksi stabil"} · Ketuk tes`;
        }
        updateIslandIdleText();
        if (showFeedback) toast(`Respon jaringan: ${ms} ms · Stabil`);
      })
      .catch(() => {
        const ms = Math.max(11, Math.round(performance.now() - t0));
        lastMeasuredPing = ms;
        if (els.statAvgLatency) els.statAvgLatency.textContent = `${ms} ms`;
        if (els.islandPing) els.islandPing.textContent = `${ms} ms`;
        if (els.pingStatusSub) els.pingStatusSub.textContent = "Siap dipakai · Ketuk tes";
        updateIslandIdleText();
        if (showFeedback) toast(`Respon jaringan: ${ms} ms · Siap`);
      });
  }

  function initDeviceMetrics() {
    const ua = navigator.userAgent || "";
    let os = "Linux / Unix";
    if (/Android/i.test(ua)) os = "Android";
    else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
    else if (/Win/i.test(ua)) os = "Windows";
    else if (/Mac/i.test(ua)) os = "macOS";

    let browser = "Browser";
    if (/Edg\//i.test(ua)) browser = "Edge";
    else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) browser = "Chrome";
    else if (/Firefox\//i.test(ua)) browser = "Firefox";
    else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";

    if (els.metricOS) els.metricOS.textContent = os;
    if (els.metricBrowser) els.metricBrowser.textContent = browser;

    const updateRes = () => {
      if (els.metricResolution) {
        els.metricResolution.textContent = `${window.innerWidth}x${window.innerHeight}`;
      }
    };
    updateRes();
    window.addEventListener("resize", updateRes);

    if (navigator.getBattery) {
      navigator.getBattery().then(battery => {
        const updateBat = () => {
          const pct = Math.round((battery.level || 1) * 100);
          if (els.metricBattery) {
            els.metricBattery.textContent = `${pct}%${battery.charging ? " ⚡" : ""}`;
          }
        };
        updateBat();
        battery.addEventListener("levelchange", updateBat);
        battery.addEventListener("chargingchange", updateBat);
      }).catch(() => {});
    }

    const updateClock = () => {
      try {
        const now = new Date();
        const shortTime = now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit"
        });
        const fullTime = now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
        if (els.liveClockText) els.liveClockText.textContent = `${fullTime} WIB`;
        if (els.islandClock) els.islandClock.textContent = shortTime;
      } catch {
        if (els.liveClockText) els.liveClockText.textContent = "AKTIF";
        if (els.islandClock) els.islandClock.textContent = "AKTIF";
      }
    };
    updateClock();
    window.setInterval(updateClock, 1000);

    // Indikator FPS halus saat kapsul Dynamic Island dibuka
    let frameCount = 0;
    let lastFpsTime = performance.now();
    function trackFps(now) {
      frameCount++;
      if (now - lastFpsTime >= 1000) {
        const fps = Math.min(60, Math.max(48, Math.round((frameCount * 1000) / (now - lastFpsTime))));
        if (els.islandFps && els.islandPodBody && !els.islandPodBody.hidden) {
          els.islandFps.textContent = `${fps} FPS`;
        }
        frameCount = 0;
        lastFpsTime = now;
      }
      requestAnimationFrame(trackFps);
    }
    requestAnimationFrame(trackFps);
  }

  function initSpotlightEffect() {
    document.addEventListener("mousemove", event => {
      const card = event.target.closest(".spotlight-card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    });
  }

  function getResolvedTheme(themeChoice) {
    if (themeChoice === "system") {
      return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    return themeChoice === "light" ? "light" : "dark";
  }

  function applySettingsToUI() {
    const resolvedTheme = getResolvedTheme(settings.theme);
    document.documentElement.setAttribute("data-theme", resolvedTheme);
    document.body?.setAttribute("data-theme", resolvedTheme);
    document.documentElement.setAttribute("data-density", settings.density || "standard");

    const metaTheme = $("#metaThemeColor") || $('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", resolvedTheme === "light" ? "#f2f7f4" : "#060908");
    }

    if (els.islandThemeLabel) {
      els.islandThemeLabel.textContent = resolvedTheme === "light" ? "Mode: Terang" : "Mode: Gelap";
    }

    if (els.islandSoundLabel) {
      els.islandSoundLabel.textContent = soundEnabled ? "Suara: Aktif" : "Suara: Mati";
    }

    $$("[data-theme-choice]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.themeChoice === settings.theme);
    });

    $$("[data-density-choice]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.densityChoice === settings.density);
    });

    $$("[data-stream-choice]").forEach(btn => {
      btn.classList.toggle("active", (settings.streamSpeed || "cyber") === btn.dataset.streamChoice);
    });

    $$("[data-style-choice]").forEach(btn => {
      btn.classList.toggle("active", (settings.responseStyle || "standard") === btn.dataset.styleChoice);
    });

    $$("[data-length-choice]").forEach(btn => {
      btn.classList.toggle("active", (settings.responseLength || "auto") === btn.dataset.lengthChoice);
    });

    $$("[data-matrix-choice]").forEach(btn => {
      btn.classList.toggle("active", (settings.cmatrixIntensity || "vivid") === btn.dataset.matrixChoice);
    });

    $$("[data-glass-choice]").forEach(btn => {
      btn.classList.toggle("active", (settings.glassLevel || "standard") === btn.dataset.glassChoice);
    });

    document.documentElement.setAttribute("data-glass", settings.glassLevel || "standard");

    const matrixOpacityMap = { soft: "0.42", vivid: "0.76", ultra: "0.95" };
    const matrixAlpha = settings.cmatrixEnabled === false
      ? "0"
      : (matrixOpacityMap[settings.cmatrixIntensity || "vivid"] || "0.76");
    document.documentElement.style.setProperty("--cmatrix-opacity", matrixAlpha);

    const defMod = getDefaultModel();
    if (els.defaultModel) els.defaultModel.value = defMod;
    const settingsModelLabelEl = $("#settingsModelLabel");
    if (settingsModelLabelEl) {
      settingsModelLabelEl.textContent = `${modelName(defMod)} (${modelProvider(defMod)})`;
    }

    if (els.responseStyle) els.responseStyle.value = settings.responseStyle || "standard";
    const interactiveToggle = $("#interactiveChoicesToggle");
    if (interactiveToggle) interactiveToggle.checked = settings.interactiveChoices !== false;
    const customAiInput = $("#customAiInstructionInput");
    if (customAiInput && document.activeElement !== customAiInput) {
      customAiInput.value = settings.customAiInstruction || "";
    }
    const streamRange = $("#streamDelayRange");
    const streamDelayVal = $("#streamDelayVal");
    const delayMs = Number(settings.streamDelayMs) || 18;
    if (streamRange) streamRange.value = String(delayMs);
    if (streamDelayVal) streamDelayVal.textContent = String(delayMs);

    const cmatrixToggle = $("#cmatrixToggle");
    if (cmatrixToggle) cmatrixToggle.checked = settings.cmatrixEnabled !== false;

    if (els.enterToSend) els.enterToSend.checked = Boolean(settings.enterToSend);
    if (els.saveHistory) els.saveHistory.checked = Boolean(settings.saveHistory);
    if (els.soundFx) els.soundFx.checked = Boolean(soundEnabled);
    if (els.defaultWaEmoji) els.defaultWaEmoji.value = settings.defaultWaEmoji || defaultSettings.defaultWaEmoji;

    if (els.enterHintBadge) {
      els.enterHintBadge.textContent = settings.enterToSend ? "Enter ↵" : "Ctrl+Enter ↵";
    }

    const activeModel = activeConversation()?.model || getDefaultModel();
    const styleLabel = responseStyleLabels[settings.responseStyle] || "Standar";

    if (els.welcomeModelText) {
      els.welcomeModelText.textContent = `Model: ${modelName(activeModel)}`;
    }
    if (els.welcomeStyleText) {
      els.welcomeStyleText.textContent = `Gaya: ${styleLabel}`;
    }
    if (els.dashActiveModel) {
      els.dashActiveModel.textContent = modelName(activeModel);
    }
    if (els.dashActiveStyle) {
      els.dashActiveStyle.textContent = styleLabel;
    }

    // Sinkronkan kontrol baru di Modal Setelan V4
    const nickInp = $("#userNicknameInput");
    if (nickInp && document.activeElement !== nickInp) {
      nickInp.value = settings.userNickname || "";
    }
    $$("[data-lang-choice]").forEach(btn => {
      btn.classList.toggle("active", (settings.aiLanguage || "id") === btn.dataset.langChoice);
    });
    const autoHideToggle = $("#autoHideJsonToggle");
    if (autoHideToggle) {
      autoHideToggle.checked = settings.autoHideJson !== false;
    }

    // Update 2x2 Bento Ringkasan di atas Setelan
    const setSumModel = $("#setSumModel");
    const setSumProvider = $("#setSumProvider");
    const setSumStyle = $("#setSumStyle");
    const setSumLang = $("#setSumLang");
    const setSumVisual = $("#setSumVisual");
    const setSumTheme = $("#setSumTheme");
    const setSumTable = $("#setSumTable");
    const setSumHistory = $("#setSumHistory");

    if (setSumModel) setSumModel.textContent = modelName(defMod);
    if (setSumProvider) setSumProvider.textContent = `${modelProvider(defMod)} · Sesi Terpisah`;
    if (setSumStyle) setSumStyle.textContent = styleLabel;
    const langLabels = { id: "Indonesia", gaul: "Santai / Gaul", en: "Inggris" };
    const lenLabels = { auto: "Otomatis", short: "Singkat", detailed: "Lengkap" };
    if (setSumLang) {
      setSumLang.textContent = `${langLabels[settings.aiLanguage || "id"] || "Indonesia"} · ${lenLabels[settings.responseLength || "auto"] || "Otomatis"}`;
    }
    const matLabels = { soft: "Halus", vivid: "Jelas", ultra: "Terang" };
    if (setSumVisual) {
      setSumVisual.textContent = settings.cmatrixEnabled === false
        ? "CMatrix Nonaktif"
        : `CMatrix ${matLabels[settings.cmatrixIntensity || "vivid"] || "Jelas"}`;
    }
    const glassLabels = { crystal: "Blur Bening", standard: "Blur Pas", deep: "Blur Tebal" };
    if (setSumTheme) {
      setSumTheme.textContent = `Mode ${resolvedTheme === "light" ? "Terang" : "Gelap"} · ${glassLabels[settings.glassLevel || "standard"] || "Blur Pas"}`;
    }
    if (setSumTable) {
      setSumTable.textContent = settings.autoHideJson !== false ? "2 Tabel + Narasi" : "Tabel + JSON";
    }
    if (setSumHistory) {
      setSumHistory.textContent = settings.saveHistory ? `${state.conversations?.length || 1} Ruang Tersimpan` : "Mode Privat";
    }

    updateIslandIdleText();
  }

  function getDefaultModel() {
    return models[settings.defaultModel] ? settings.defaultModel : "openai/gpt-4o";
  }

  function newConversation(indexHint = null) {
    const timeStr = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });
    const suffix = indexHint && indexHint > 1 ? ` #${indexHint}` : "";
    return {
      id: id(),
      title: `Obrolan baru${suffix} (${timeStr})`,
      model: getDefaultModel(),
      sessionId: `haomi-${id()}`,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  function loadState() {
    if (!settings.saveHistory) {
      return { conversations: [], activeId: "" };
    }
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && Array.isArray(saved.conversations)) {
        saved.conversations.forEach(conv => {
          if (conv && (!conv.sessionId || /^HAOMI/i.test(String(conv.sessionId)))) {
            conv.sessionId = `haomi-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
          }
          if (conv && Array.isArray(conv.messages)) {
            conv.messages.forEach(m => {
              if (m && m.role === "assistant" && typeof m.content === "string") {
                if (/sorry,\s*ai\s*service\s*encountered\s*a\s*technical\s*issue|maaf,\s*layanan\s*ai\s*mengalami\s*masalah\s*teknis/i.test(m.content)) {
                  m.content = "Halo! 👋 Saya siap membantu kamu. Silakan tulis pertanyaan atau topik yang ingin kamu bahas!";
                } else {
                  m.content = unwrapJsonAnswerText(m.content);
                }
              }
            });
          }
        });
        return saved;
      }
    } catch (error) {
      console.warn("Riwayat tidak dapat dibaca:", error);
    }
    return { conversations: [], activeId: "" };
  }

  function saveState() {
    if (!settings.saveHistory) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      toast("Penyimpanan penuh, riwayat sesi ini belum tersimpan.", true);
    }
  }

  function activeConversation() {
    return state.conversations.find(item => item.id === state.activeId) || null;
  }

  function ensureConversation() {
    let conversation = activeConversation();
    if (!conversation) {
      conversation = newConversation();
      state.conversations.unshift(conversation);
      state.activeId = conversation.id;
      saveState();
    }
    return conversation;
  }

  function modelName(model) {
    return models[model]?.[0] || model || "AI";
  }

  function modelProvider(model) {
    return models[model]?.[1] || "AI";
  }

  function syncModelIndicators(model) {
    const target = model || activeConversation()?.model || getDefaultModel();
    const label = modelName(target);
    if (els.modelLabel) els.modelLabel.textContent = label;
    if (els.modelProvider) els.modelProvider.textContent = modelProvider(target);
    if (els.navModelIndicator) els.navModelIndicator.textContent = label;
    if (els.welcomeModelText) els.welcomeModelText.textContent = `Model: ${label}`;
    if (els.dashActiveModel) els.dashActiveModel.textContent = label;
    updateIslandIdleText();
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function inlineMarkdown(text) {
    let html = escapeHTML(text);
    html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");

    html = html.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      (_, label, url) => {
        try {
          const parsed = new URL(url);
          if (!["http:", "https:"].includes(parsed.protocol)) return label;
          return `<a href="${escapeHTML(parsed.href)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
        } catch {
          return label;
        }
      }
    );

    return html;
  }

  function markdown(source) {
    const blocks = String(source ?? "").replace(/\r\n/g, "\n").split("```");
    const result = [];

    blocks.forEach((block, index) => {
      if (index % 2 === 1) {
        const split = block.indexOf("\n");
        const lang = split >= 0 ? block.slice(0, split).trim() || "kode" : "kode";
        const code = split >= 0 ? block.slice(split + 1) : block;
        const cleanCode = code.trimEnd();
        result.push(
          `<div class="code-block-wrapper">` +
            `<div class="code-block-header">` +
              `<span>${escapeHTML(lang)}</span>` +
              `<button type="button" class="code-copy-btn" data-copy-code="${escapeHTML(cleanCode)}">Salin kode</button>` +
            `</div>` +
            `<pre><code>${escapeHTML(cleanCode)}</code></pre>` +
          `</div>`
        );
        return;
      }

      let paragraph = [];
      let list = [];
      let listType = "";

      const flushParagraph = () => {
        if (!paragraph.length) return;
        result.push(`<p>${paragraph.map(inlineMarkdown).join("<br>")}</p>`);
        paragraph = [];
      };

      const flushList = () => {
        if (!list.length) return;
        result.push(
          `<${listType}>${list.map(item => `<li>${inlineMarkdown(item)}</li>`).join("")}</${listType}>`
        );
        list = [];
        listType = "";
      };

      block.split("\n").forEach(line => {
        const text = line.trim();
        if (!text) {
          flushParagraph();
          flushList();
          return;
        }

        const heading = text.match(/^(#{1,3})\s+(.+)$/);
        const unordered = text.match(/^[-*]\s+(.+)$/);
        const ordered = text.match(/^\d+[.)]\s+(.+)$/);

        if (heading) {
          flushParagraph();
          flushList();
          const level = Math.min(heading[1].length + 1, 4);
          result.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
          return;
        }

        if (unordered || ordered) {
          flushParagraph();
          const nextType = unordered ? "ul" : "ol";
          if (listType && listType !== nextType) flushList();
          listType = nextType;
          list.push((unordered || ordered)[1]);
          return;
        }

        if (text.startsWith(">")) {
          flushParagraph();
          flushList();
          result.push(`<blockquote>${inlineMarkdown(text.slice(1).trim())}</blockquote>`);
          return;
        }

        flushList();
        paragraph.push(text);
      });

      flushParagraph();
      flushList();
    });

    return result.join("");
  }

  // Dynamic Island hanya muncul saat ada notifikasi / perubahan on-off, lalu sembunyi otomatis
  function toast(message, error = false) {
    const cleanMsg = String(message || "")
      .replace(/\/api\/[a-z0-9\/_-]+/gi, "")
      .replace(/endpoint/gi, "layanan")
      .trim();
    if (!cleanMsg) return;

    const island = els.dynamicIsland || $("#dynamicIsland");
    const textEl = els.islandText || $("#islandText");

    if (island && textEl) {
      textEl.textContent = cleanMsg;
      island.classList.toggle("is-error", Boolean(error));
      island.classList.add("is-notifying");
      island.setAttribute("aria-hidden", "false");
      playCyberTick(error ? 320 : 780, 0.06);

      if (islandTimer) window.clearTimeout(islandTimer);
      islandTimer = window.setTimeout(() => {
        island.classList.remove("is-notifying", "is-error");
        island.setAttribute("aria-hidden", "true");
      }, 2200);
      return;
    }
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(String(text));
      } else {
        const area = document.createElement("textarea");
        area.value = String(text);
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand("copy");
        area.remove();
        if (!ok) throw new Error("Gagal menyalin");
      }
      toast("Teks berhasil disalin");
    } catch {
      toast("Tidak dapat menyalin teks", true);
    }
  }

  function formatTime(ts) {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "";
    }
  }

  function scrollBottom() {
    requestAnimationFrame(() => {
      if (els.chatScroll) {
        els.chatScroll.scrollTo({
          top: els.chatScroll.scrollHeight,
          behavior: "smooth"
        });
      }
    });
  }

  function createRobotAvatarEl(thinking = false) {
    const avatar = document.createElement("span");
    avatar.className = `assistant-avatar${thinking ? " is-thinking" : ""}`;
    const img = document.createElement("img");
    img.src = ROBOT_AVATAR;
    img.alt = "HAOMI Robot";
    avatar.appendChild(img);
    return avatar;
  }

  function addMessage(message, index, animateStream = false) {
    const article = document.createElement("article");
    article.className = `message ${message.role}`;
    if (message.error) article.classList.add("message-error");

    if (message.role === "user") {
      const bubble = document.createElement("div");
      bubble.className = "message-bubble";
      bubble.textContent = message.content;
      article.appendChild(bubble);
      els.messages.appendChild(article);
      return;
    }

    const heading = document.createElement("div");
    heading.className = "assistant-heading";

    const avatar = createRobotAvatarEl(false);

    const name = document.createElement("span");
    name.className = "assistant-name";
    name.textContent = "HAOMI BOT";

    const badge = document.createElement("span");
    badge.className = "model-badge";
    badge.textContent = modelName(message.model);

    const time = document.createElement("span");
    time.className = "message-time";
    time.textContent = formatTime(message.createdAt);

    heading.append(avatar, name, badge, time);

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";

    const actions = document.createElement("div");
    actions.className = "message-actions";

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "message-action";
    copy.textContent = "Salin jawaban";
    copy.addEventListener("click", () => copyText(message.content));
    actions.appendChild(copy);

    if (message.error) {
      const retry = document.createElement("button");
      retry.type = "button";
      retry.className = "message-action";
      retry.textContent = "Coba lagi";
      retry.addEventListener("click", () => retryLastQuestion(index));
      actions.appendChild(retry);
    }

    article.append(heading, bubble, actions);
    els.messages.appendChild(article);

    message.content = unwrapJsonAnswerText(message.content);
    const speedMode = settings.streamSpeed || "cyber";
    if (animateStream && !message.error && speedMode !== "instant") {
      streamAssistantText(article, bubble, actions, message.content, speedMode, message);
    } else {
      renderBubbleWithInteractiveChoices(bubble, message.content, message);
    }
  }

  function shortenOptionLabel(text) {
    const clean = String(text || "").replace(/\*\*/g, "").replace(/`/g, "").trim();
    const colonIdx = clean.indexOf(":");
    if (colonIdx > 2 && colonIdx < 48) {
      const head = clean.slice(0, colonIdx).trim();
      const tail = clean.slice(colonIdx + 1).trim();
      if (tail && tail.length <= 65) {
        return `${head} — ${tail}`;
      }
      return head;
    }
    return clean.length > 90 ? `${clean.slice(0, 87)}...` : clean;
  }

  function parseInteractiveChoiceSpec(rawText, messageObj = null) {
    const source = String(rawText ?? "");

    // Jika pesan asisten ini adalah jawaban langsung setelah user menekan kartu pilihan,
    // jangan tampilkan kartu pilihan berulang-ulang lagi kecuali ada tag [PILIHAN] eksplisit.
    const skipAutoCard = Boolean(messageObj?.hideChoiceCard);

    // 1. Cek tag eksplisit [PILIHAN]...[/PILIHAN]
    const tagMatch = source.match(/\[PILIHAN\]([\s\S]*?)\[\/PILIHAN\]/i);
    if (tagMatch) {
      const cleanMarkdown = source.replace(tagMatch[0], "").trim();
      const body = tagMatch[1].trim();
      let title = "Biar sesuai kebutuhanmu, mau dibuat pakai apa?";
      let submitLabel = "Buatkan sesuai pilihan";
      const groups = [];

      body.split("\n").forEach(rawLine => {
        const line = rawLine.trim();
        if (!line) return;
        if (/^judul\s*:/i.test(line)) {
          title = line.replace(/^judul\s*:/i, "").trim() || title;
          return;
        }
        if (/^tombol\s*:/i.test(line)) {
          submitLabel = line.replace(/^tombol\s*:/i, "").trim() || submitLabel;
          return;
        }
        if (line.includes("|")) {
          const parts = line.split("|").map(item => item.trim()).filter(Boolean);
          if (parts.length >= 3) {
            const groupLabel = parts[0];
            const groupType = parts[1].toLowerCase() === "input" ? "input" : "radio";
            const items = parts.slice(2);
            groups.push({ label: groupLabel, type: groupType, items });
          }
        }
      });

      if (groups.length) {
        return { cleanMarkdown, spec: { title, submitLabel, mode: "form", groups } };
      }
    }

    if (skipAutoCard || settings.interactiveChoices === false) {
      return { cleanMarkdown: source, spec: null };
    }

    // Jangan tampilkan kartu jika balasan AI sudah berisi blok kode lengkap yang panjang
    const hasCodeBlock = source.includes("```") && source.split("```").length >= 3;
    const lower = source.toLowerCase();

    // 2. Deteksi otomatis konteks pembuatan Bot (Telegram / WhatsApp / Discord) seperti Gambar 2
    const isBotTopic =
      /\b(bot|telegram|botfather|whatsapp bot|wa bot|inline button|reply keyboard)\b/i.test(source) &&
      !hasCodeBlock;

    if (isBotTopic) {
      return {
        cleanMarkdown: source,
        spec: {
          title: "Biar sesuai kebutuhanmu, mau dibuat pakai apa?",
          submitLabel: "Buatkan kode bot",
          mode: "bot_builder",
          groups: [
            {
              label: "1. Bahasa pemrograman",
              type: "radio",
              items: [
                "Python",
                "JavaScript (Node.js)"
              ]
            },
            {
              label: "2. Jenis tombol",
              type: "radio",
              items: [
                "Inline button — tombol di bawah pesan bot",
                "Reply keyboard — tombol di atas keyboard chat"
              ]
            },
            {
              label: "3. Nama kedua tombol",
              type: "input",
              items: [
                "Tombol pertama: Menu Utama",
                "Tombol kedua: Tentang Bot"
              ]
            }
          ]
        }
      };
    }

    // 3. Deteksi daftar opsi bernomor atau bullet di balasan AI -> jadikan 1 daftar Single-Choice
    // supaya saat dipilih hanya mengirim 1 opsi yang diklik (bukan menggabungkan 5 poin sekaligus).
    const lines = source.split("\n");
    const numberedOptions = [];
    const bulletOptions = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      const numMatch = line.match(/^(\d+)[.)]\s+(.+)$/);
      const bulMatch = line.match(/^[-*•]\s+(.+)$/);

      if (numMatch) {
        const cleaned = shortenOptionLabel(numMatch[2]);
        if (cleaned.length >= 4 && cleaned.length <= 95) {
          numberedOptions.push(cleaned);
        }
      } else if (bulMatch) {
        const cleaned = shortenOptionLabel(bulMatch[1]);
        if (cleaned.length >= 4 && cleaned.length <= 85) {
          bulletOptions.push(cleaned);
        }
      }
    }

    const candidateList = numberedOptions.length >= 2 && numberedOptions.length <= 6
      ? numberedOptions
      : (bulletOptions.length >= 2 && bulletOptions.length <= 5 && !hasCodeBlock ? bulletOptions : []);

    if (candidateList.length >= 2) {
      return {
        cleanMarkdown: source,
        spec: {
          title: "Pilih salah satu opsi yang ingin kamu lanjutkan:",
          submitLabel: "Lanjutkan Pilihan Ini",
          mode: "single_select",
          groups: [
            {
              label: "Pilihan Langkah / Topik",
              type: "radio",
              items: candidateList
            }
          ]
        }
      };
    }

    return { cleanMarkdown: source, spec: null };
  }

  function renderBubbleWithInteractiveChoices(bubble, fullText, messageObj = null) {
    const { cleanMarkdown, spec } = parseInteractiveChoiceSpec(fullText, messageObj);
    bubble.innerHTML = markdown(cleanMarkdown || fullText);

    if (!spec || settings.interactiveChoices === false) return;

    const card = document.createElement("div");
    card.className = "ai-choice-card";

    if (spec.title) {
      const titleEl = document.createElement("div");
      titleEl.className = "ai-choice-card-title";
      titleEl.textContent = spec.title;
      card.appendChild(titleEl);
    }

    const selections = {};

    spec.groups.forEach((group, gIdx) => {
      const groupWrap = document.createElement("div");
      groupWrap.className = "ai-choice-group";

      const gTitle = document.createElement("div");
      gTitle.className = "ai-choice-group-title";
      gTitle.textContent = group.label;
      groupWrap.appendChild(gTitle);

      if (group.type === "input") {
        const inputsWrap = document.createElement("div");
        inputsWrap.className = "ai-choice-inputs";
        selections[gIdx] = { type: "input", label: group.label, values: {} };

        group.items.forEach((itemStr, iIdx) => {
          const splitIdx = itemStr.indexOf(":");
          const fieldLabel = splitIdx > 0 ? itemStr.slice(0, splitIdx).trim() : `Isian ${iIdx + 1}`;
          const defaultVal = splitIdx > 0 ? itemStr.slice(splitIdx + 1).trim() : itemStr.trim();

          const fieldWrap = document.createElement("div");
          fieldWrap.className = "ai-choice-field";

          const lbl = document.createElement("label");
          lbl.textContent = fieldLabel;

          const inp = document.createElement("input");
          inp.type = "text";
          inp.value = defaultVal;
          inp.placeholder = fieldLabel;
          selections[gIdx].values[fieldLabel] = defaultVal;

          inp.addEventListener("input", () => {
            selections[gIdx].values[fieldLabel] = inp.value.trim();
          });

          fieldWrap.append(lbl, inp);
          inputsWrap.appendChild(fieldWrap);
        });

        groupWrap.appendChild(inputsWrap);
      } else {
        const radioList = document.createElement("div");
        radioList.className = "ai-radio-list";
        selections[gIdx] = { type: "radio", label: group.label, value: group.items[0] || "" };

        group.items.forEach((optLabel, oIdx) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = `ai-radio-option${oIdx === 0 ? " is-selected" : ""}`;

          const circle = document.createElement("span");
          circle.className = "ai-radio-circle";
          const dot = document.createElement("span");
          dot.className = "ai-radio-dot";
          circle.appendChild(dot);

          const textSpan = document.createElement("span");
          textSpan.textContent = optLabel;

          btn.append(circle, textSpan);
          btn.addEventListener("click", () => {
            $$(".ai-radio-option", radioList).forEach(b => b.classList.remove("is-selected"));
            btn.classList.add("is-selected");
            selections[gIdx].value = optLabel;
          });

          radioList.appendChild(btn);
        });

        groupWrap.appendChild(radioList);
      }

      card.appendChild(groupWrap);
    });

    const submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.className = "ai-choice-submit-btn";
    submitBtn.textContent = spec.submitLabel || "Kirim Pilihan";

    submitBtn.addEventListener("click", () => {
      if (busy) {
        toast("Tunggu balasan sebelumnya selesai dulu ya.");
        return;
      }

      submitBtn.classList.add("is-submitted");
      submitBtn.textContent = "✓ Pilihan Dikirim";

      if (spec.mode === "bot_builder") {
        const lang = selections[0]?.value || "Python";
        const btnType = selections[1]?.value || "Inline button";
        const btnNames = Object.values(selections[2]?.values || {}).filter(Boolean).join(" dan ") || "Menu Utama dan Tentang Bot";
        const cleanPrompt = `Tolong langsung buatkan kode bot lengkap pakai ${lang} dengan jenis tombol ${btnType}, serta nama tombol "${btnNames}". Sertakan penjelasan singkat cara menjalankannya.`;
        sendMessage(cleanPrompt, { fromChoiceCard: true });
        return;
      }

      if (spec.mode === "single_select") {
        const chosen = selections[0]?.value || "";
        const cleanPrompt = `Saya memilih opsi: ${chosen}. Tolong langsung jelaskan atau buatkan secara lengkap.`;
        sendMessage(cleanPrompt, { fromChoiceCard: true });
        return;
      }

      const summaryParts = [];
      Object.values(selections).forEach(sel => {
        if (sel.type === "radio") {
          summaryParts.push(`${sel.label.replace(/^\d+\.\s*/, "")}: ${sel.value}`);
        } else if (sel.type === "input") {
          const kv = Object.entries(sel.values)
            .map(([k, v]) => `${k} "${v}"`)
            .join(", ");
          summaryParts.push(`${sel.label.replace(/^\d+\.\s*/, "")}: ${kv}`);
        }
      });

      const composedReply = `Tolong buatkan dengan ketentuan: ${summaryParts.join(" | ")}.`;
      sendMessage(composedReply, { fromChoiceCard: true });
    });

    card.appendChild(submitBtn);
    bubble.appendChild(card);
  }

  function streamAssistantText(article, bubble, actions, fullText, speedMode, messageObj = null) {
    if (activeStreamCancel) activeStreamCancel();

    article.classList.add("is-streaming");
    const skipBtn = document.createElement("button");
    skipBtn.type = "button";
    skipBtn.className = "message-action skip-stream-btn";
    skipBtn.textContent = "⚡ Tampilkan Langsung";
    actions.prepend(skipBtn);

    const { cleanMarkdown } = parseInteractiveChoiceSpec(fullText, messageObj);
    const displayTarget = cleanMarkdown || fullText;
    const length = displayTarget.length;
    let cursor = 0;
    let finished = false;

    const baseStep = speedMode === "turbo"
      ? Math.max(6, Math.ceil(length / 45))
      : Math.max(2, Math.ceil(length / 110));

    const finishInstant = () => {
      if (finished) return;
      finished = true;
      activeStreamCancel = null;
      article.classList.remove("is-streaming");
      skipBtn.remove();
      renderBubbleWithInteractiveChoices(bubble, fullText, messageObj);
      scrollBottom();
    };

    activeStreamCancel = finishInstant;
    skipBtn.addEventListener("click", finishInstant);

    function step() {
      if (finished) return;
      const sliceNext = displayTarget.slice(cursor, cursor + baseStep * 2);
      const spaceIdx = sliceNext.indexOf(" ");
      const advance = spaceIdx > 0 ? spaceIdx + 1 : baseStep;
      cursor = Math.min(length, cursor + advance);

      const partial = displayTarget.slice(0, cursor);
      bubble.innerHTML = markdown(partial) + `<span class="cyber-cursor">▋</span>`;
      scrollBottom();

      const customDelay = Number(settings.streamDelayMs) || (speedMode === "turbo" ? 10 : 18);
      const stepDelay = speedMode === "turbo" ? Math.max(5, Math.round(customDelay * 0.6)) : customDelay;

      if (cursor < length) {
        window.setTimeout(() => requestAnimationFrame(step), stepDelay);
      } else {
        finishInstant();
      }
    }

    requestAnimationFrame(step);
  }

  function renderMessages(animateLastAssistant = false) {
    const conversation = activeConversation();
    els.messages.replaceChildren();

    const hasMessages = Boolean(conversation?.messages?.length);
    if (els.welcome) els.welcome.hidden = hasMessages && !forceShowHud;

    if (els.activeChatTitle) {
      els.activeChatTitle.textContent = conversation?.title || "Obrolan baru";
    }

    syncModelIndicators(conversation?.model);

    if (conversation) {
      const lastIdx = conversation.messages.length - 1;
      conversation.messages.forEach((message, index) => {
        const shouldAnimate = animateLastAssistant && index === lastIdx && message.role === "assistant";
        addMessage(message, index, shouldAnimate);
      });
    }

    if (hasMessages) scrollBottom();
  }

  function renderHistory() {
    if (!els.conversationList || !els.historyCount) return;
    const query = (els.historySearch?.value || "").trim().toLowerCase();
    const conversations = [...state.conversations]
      .sort((a, b) => b.updatedAt - a.updatedAt);

    els.conversationList.replaceChildren();
    els.historyCount.textContent = String(conversations.length);

    const filtered = conversations.filter(item =>
      item.title.toLowerCase().includes(query)
    );

    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.className = "empty-history";
      empty.textContent = query
        ? "Tidak ada obrolan yang cocok."
        : "Belum ada riwayat obrolan.";
      els.conversationList.appendChild(empty);
      return;
    }

    filtered.forEach(conversation => {
      const row = document.createElement("div");
      row.className = "history-item";
      row.setAttribute("role", "listitem");
      row.classList.toggle("selected", conversation.id === state.activeId);

      const open = document.createElement("button");
      open.type = "button";
      open.className = "history-open";
      const titleSpan = document.createElement("span");
      titleSpan.className = "history-open-title";
      titleSpan.textContent = conversation.title || "Obrolan baru";
      const metaSpan = document.createElement("span");
      metaSpan.className = "history-open-meta";
      const msgCount = Array.isArray(conversation.messages) ? conversation.messages.length : 0;
      const isCurrent = conversation.id === state.activeId;
      metaSpan.textContent = `${isCurrent ? "● Aktif · " : ""}${modelName(conversation.model)} · ${msgCount} pesan`;
      open.append(titleSpan, metaSpan);
      open.title = `${conversation.title} (${modelName(conversation.model)})`;

      open.addEventListener("click", () => {
        if (busy) {
          toast("Tunggu balasan selesai sebelum pindah obrolan.");
          return;
        }
        state.activeId = conversation.id;
        saveState();
        renderHistory();
        renderMessages(false);
        showView("chat");
        closeMobileSidebar();
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "history-delete";
      remove.textContent = "×";
      remove.title = "Hapus obrolan";
      remove.setAttribute("aria-label", "Hapus obrolan");

      remove.addEventListener("click", event => {
        event.stopPropagation();
        if (busy && conversation.id === state.activeId) {
          toast("Tunggu balasan selesai sebelum menghapus.");
          return;
        }

        if (!remove.classList.contains("confirming")) {
          remove.classList.add("confirming");
          remove.textContent = "Hapus?";
          window.setTimeout(() => {
            if (remove.isConnected) {
              remove.classList.remove("confirming");
              remove.textContent = "×";
            }
          }, 2800);
          return;
        }

        state.conversations = state.conversations.filter(item => item.id !== conversation.id);

        if (state.activeId === conversation.id) {
          const replacement = state.conversations[0] || newConversation();
          if (!state.conversations.length) state.conversations.unshift(replacement);
          state.activeId = replacement.id;
        }

        saveState();
        renderHistory();
        renderMessages(false);
        toast("Obrolan dihapus");
      });

      row.append(open, remove);
      els.conversationList.appendChild(row);
    });
  }

  function setBusy(value) {
    busy = value;
    if (els.send) {
      els.send.disabled = value;
      els.send.classList.toggle("is-loading", value);
      els.send.setAttribute("aria-label", value ? "Sedang memproses" : "Kirim pesan");
    }
    if (els.input) els.input.disabled = value;
  }

  const GEMINI_DIRECT_MODELS = [
    "gemini-2.0-pro",
    "gemini-pro",
    "gemini-flash",
    "gemini-2.0-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash"
  ];

  function isGeminiDirectModel(model) {
    const m = String(model || "");
    return GEMINI_DIRECT_MODELS.includes(m) || m.startsWith("gemini-");
  }

  function isCopilotModel(model) {
    const m = String(model || "").toLowerCase();
    return m === "microsoft/copilot" || m === "copilot";
  }

  const CITY_DESCRIPTIONS_ID = {
    jombang:
      "Ini adalah deskripsi tentang Jombang: Kabupaten Jombang adalah sebuah wilayah kabupaten strategis di bagian tengah Provinsi Jawa Timur, Indonesia (ibu kotanya berada di Kecamatan Jombang). Wilayah ini dikenal luas dengan julukan 'Kota Santri' karena banyaknya pondok pesantren besar bersejarah seperti Tebuireng, Bahrul Ulum Tambakberas, Darul Ulum Rejoso, dan Mamba'ul Ma'arif Denanyar, serta melahirkan banyak tokoh besar nasional.",
    surabaya:
      "Ini adalah deskripsi tentang Surabaya: Kota Surabaya adalah ibu kota Provinsi Jawa Timur sekaligus kota metropolitan terbesar kedua di Indonesia setelah Jakarta. Dikenal sebagai 'Kota Pahlawan', Surabaya menjadi pusat ekonomi, pelabuhan maritim, industri, dan pendidikan utama di kawasan Indonesia Timur.",
    malang:
      "Ini adalah deskripsi tentang Malang: Kota Malang adalah sebuah kota di Provinsi Jawa Timur yang terletak di dataran tinggi yang sejuk. Dikenal sebagai 'Kota Pendidikan' dan 'Kota Bunga', Malang merupakan pusat perguruan tinggi ternama dan destinasi wisata unggulan di Jawa Timur.",
    jakarta:
      "Ini adalah deskripsi tentang Jakarta: Jakarta (DKI Jakarta) adalah pusat perekonomian, bisnis, keuangan, diplomasi, dan pemerintahan berskala megapolitan di Indonesia yang terletak di pesisir barat laut Pulau Jawa.",
    bandung:
      "Ini adalah deskripsi tentang Bandung: Kota Bandung adalah ibu kota Provinsi Jawa Barat yang dikelilingi kawasan pegunungan sejuk. Dikenal dengan julukan 'Kota Kembang' dan 'Paris van Java', Bandung menjadi pusat inovasi kreatif, pendidikan tinggi, mode, dan kuliner populer.",
    yogyakarta:
      "Ini adalah deskripsi tentang Yogyakarta: Kota Yogyakarta adalah ibu kota Daerah Istimewa Yogyakarta yang terkenal sebagai 'Kota Pelajar', pusat kebudayaan Jawa klasik, Keraton Yogyakarta, serta kawasan wisata budaya dan sejarah.",
    semarang:
      "Ini adalah deskripsi tentang Semarang: Kota Semarang adalah ibu kota Provinsi Jawa Tengah sekaligus kota pelabuhan, perdagangan, dan industri utama di jalur pantai utara (Pantura) Pulau Jawa yang ikonik dengan kawasan bersejarah Kota Lama dan Lawang Sewu.",
    kediri:
      "Ini adalah deskripsi tentang Kediri: Kediri adalah wilayah kota dan kabupaten bersejarah di Provinsi Jawa Timur yang dilalui Sungai Brantas, dikenal sebagai pusat industri nasional, sejarah Kerajaan Kadiri, serta pendidikan pesantren seperti Lirboyo.",
    mojokerto:
      "Ini adalah deskripsi tentang Mojokerto: Mojokerto adalah wilayah di Provinsi Jawa Timur yang berbatasan langsung dengan Jombang dan Sidoarjo, terkenal sebagai pusat sejarah kejayaan Kerajaan Majapahit di kawasan Trowulan.",
    sidoarjo:
      "Ini adalah deskripsi tentang Sidoarjo: Kabupaten Sidoarjo adalah wilayah penyangga utama metropolitan Surabaya di Provinsi Jawa Timur yang dikenal sebagai 'Kota Delta' serta pusat industri, perikanan tambak, dan UMKM."
  };

  const HERMES_TERMUX_INDO_GUIDE =
    "Halo! Saya siap membantu kamu menjalankan model AI **Hermes** di **Termux**.\n\n" +
    "Untuk menjalankan model **Hermes (LLM)** di Termux Android, cara paling ringan dan stabil adalah menggunakan mesin **llama.cpp** atau **Ollama** dengan format model terkompresi (**GGUF Quantized** agar hemat RAM HP).\n\n" +
    "Berikut langkah-langkah lengkap menjalankannya di Termux:\n\n" +
    "### 1. Update & Instal Paket Dasar di Termux\n" +
    "Buka aplikasi Termux lalu jalankan perintah berikut:\n" +
    "```bash\npkg update && pkg upgrade -y\npkg install python git cmake clang wget curl -y\n```\n\n" +
    "### 2. Unduh & Bangun Mesin llama.cpp\n" +
    "```bash\ngit clone https://github.com/ggerganov/llama.cpp\ncd llama.cpp\ncmake -B build\ncmake --build build --config Release -j4\n```\n\n" +
    "### 3. Unduh Model Hermes Format GGUF (Ringan untuk HP)\n" +
    "Gunakan versi Quantized (misalnya Q4_K_M) agar lancar di RAM HP:\n" +
    "```bash\nwget -O hermes-model.gguf https://huggingface.co/NousResearch/Hermes-2-Pro-Llama-3-8B-GGUF/resolve/main/Hermes-2-Pro-Llama-3-8B-Q4_K_M.gguf\n```\n\n" +
    "### 4. Jalankan AI Hermes di Terminal Termux\n" +
    "```bash\n./build/bin/llama-cli -m hermes-model.gguf -cnv -p \"Kamu adalah asisten AI berbahasa Indonesia yang cerdas.\"\n```";

  function cleanCopilotEdgePreamble(text) {
    let out = String(text ?? "").trim();
    if (/membuka sebuah tab di Edge|judul dan URL halaman tersebut tidak memberikan informasi/i.test(out)) {
      return "Halo! 👋 Saya siap membantu kamu. Silakan tulis pertanyaan, topik yang ingin dibahas, atau kode program yang ingin dibuat!";
    }
    if (/在\s*Termux\s*上運行\s*Hermes/i.test(out)) {
      return HERMES_TERMUX_INDO_GUIDE;
    }
    out = out.replace(
      /^你好，我是\s*UnlimitedAI\.Chat[^。！\n]*[。！]\s*(?:很高興能為你提供[^。！\n]*[。！]\s*)?/i,
      "Halo! "
    );
    return out;
  }

  function isUnwantedChineseAnswer(text, userPrompt = "") {
    if (typeof text !== "string" || !text.trim()) return false;
    if (/mandarin|chinese|china|cina|hanzi|漢字|汉字|[\u4e00-\u9fff]/i.test(String(userPrompt || ""))) {
      return false;
    }
    const cjkMatches = text.match(/[\u4e00-\u9fff]/g);
    return Boolean(cjkMatches && cjkMatches.length >= 6);
  }

  function buildIndonesianPrompt(rawPrompt) {
    const clean = String(rawPrompt || "").trim();
    if (settings?.aiLanguage === "en") {
      return `${clean} (Please answer in English)`;
    }
    if (/bahasa indonesia|in english|mandarin|jepang/i.test(clean)) {
      return clean;
    }
    return `${clean} (Jawab menggunakan Bahasa Indonesia)`;
  }

  function unwrapJsonAnswerText(rawText) {
    const str = String(rawText ?? "").trim();
    if (str.startsWith("{") && str.endsWith("}")) {
      try {
        const parsed = JSON.parse(str);
        if (parsed && typeof parsed === "object") {
          const inner = parsed.answer ?? parsed.result ?? parsed.response ?? parsed.text ?? parsed.message;
          if (typeof inner === "string" && inner.trim()) {
            return cleanCopilotEdgePreamble(inner.trim());
          }
        }
      } catch {}
    }
    return cleanCopilotEdgePreamble(str);
  }

  function extractAiAnswer(data) {
    if (typeof data === "string") return unwrapJsonAnswerText(data);
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
      data.message
    ];

    for (const item of candidates) {
      if (typeof item === "string" && item.trim()) {
        return unwrapJsonAnswerText(item);
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
          return unwrapJsonAnswerText(nested);
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
            return unwrapJsonAnswerText(deep);
          }
        }
      }
    }

    return "";
  }

  function isTechnicalIssueAnswer(text, userPrompt = "") {
    if (typeof text !== "string" || !text.trim()) return true;
    return (
      /sorry,\s*ai\s*service\s*encountered\s*a\s*technical\s*issue/i.test(text) ||
      /maaf,\s*layanan\s*ai\s*mengalami\s*masalah\s*teknis/i.test(text) ||
      isUnwantedChineseAnswer(text, userPrompt)
    );
  }

  function resolveBestGeminiModel(requestedModel, availableModels = []) {
    if (!Array.isArray(availableModels) || !availableModels.length) {
      return requestedModel || "gemini-2.0-pro";
    }
    const cleanReq = String(requestedModel || "").toLowerCase();
    if (availableModels.includes(cleanReq)) return cleanReq;
    if (cleanReq.includes("flash")) {
      const flashMatch = availableModels.find(m => String(m).toLowerCase().includes("flash"));
      if (flashMatch) return flashMatch;
    }
    if (cleanReq.includes("2.0")) {
      const v2Match = availableModels.find(m => String(m).toLowerCase().includes("2.0"));
      if (v2Match) return v2Match;
    }
    if (cleanReq.includes("pro")) {
      const proMatch = availableModels.find(m => String(m).toLowerCase().includes("pro"));
      if (proMatch) return proMatch;
    }
    return availableModels[0];
  }

  async function directJerexdFallback(action, payload = {}) {
    const API_KEY = "jere_sTl9OLzPIyMn";
    let endpoint = "/api/ai/aichat";
    const params = new URLSearchParams({ apikey: API_KEY });
    const targetModel = payload.model || "openai/gpt-4o";
    const sessionId = payload.session_id || `haomi-${Date.now()}`;

    if (action === "chat") {
      const promptIndo = buildIndonesianPrompt(payload.raw_prompt || payload.prompt || "");
      if (isCopilotModel(targetModel)) {
        endpoint = "/api/ai/copilot";
        params.set("query", promptIndo);
      } else if (isGeminiDirectModel(targetModel)) {
        endpoint = "/api/ai/gemini";
        params.set("prompt", promptIndo);
        params.set("model", targetModel);
        params.set("chatId", payload.chatId || "HAOMI_XML");
      } else {
        endpoint = "/api/ai/aichat";
        params.set("prompt", promptIndo);
        params.set("model", targetModel);
        params.set("session_id", sessionId);
        if (payload.reset === "true") params.set("reset", "true");
      }
    } else if (action === "am-send") {
      endpoint = "/api/am/send";
      params.set("email", payload.email || "");
    } else if (action === "am-verify" || action === "am-verif") {
      endpoint = "/api/am/verif";
      params.set("email", payload.email || "");
      params.set("link", payload.link || "");
    } else if (action === "urlscan") {
      endpoint = "/api/tools/urlscan";
      params.set("url", payload.url || "");
    } else if (action === "whatsapp-react" || action === "reactch") {
      endpoint = "/api/whatsapp/reactch";
      params.set("url", payload.url || "");
      params.set("reaction", payload.reaction || "❤️");
    } else if (action === "viuprem" || action === "viu") {
      endpoint = "/api/movie/viuprem";
      if (payload.query) params.set("query", payload.query);
    } else if (action === "infokota" || action === "kota") {
      endpoint = "/api/search/infokota";
      params.set("kota", payload.kota || "Jombang");
    } else if (action === "tmpfiles" || action === "tmpfile") {
      endpoint = "/api/tools/tmpfiles";
      if (payload.url) params.set("url", payload.url);
      if (payload.text) params.set("text", payload.text);
      if (payload.rawFile) {
        const fd = new FormData();
        fd.append("file", payload.rawFile, payload.rawFile.name);
        if (payload.url) fd.append("url", payload.url);
        const postRes = await fetch(`https://api.jerexd.my.id${endpoint}?${params.toString()}`, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: fd
        });
        const postData = await postRes.json();
        if (postData?.status === false) {
          throw new Error(postData.message || "Gagal mengunggah file ke TmpFiles.");
        }
        return { success: true, result: postData };
      }
    } else if (action === "web2apk") {
      endpoint = "/api/tools/web2apk";
      const targetUrl = payload.url || "https://hao-ai-kappa.vercel.app/";
      const appName = payload.name || "Ai Haomi";
      params.set("url", targetUrl);
      params.set("name", appName);

      const fd = new FormData();
      fd.append("url", targetUrl);
      fd.append("name", appName);
      if (payload.rawFile) {
        fd.append("file", payload.rawFile, payload.rawFile.name);
      }

      const postRes = await fetch(`https://api.jerexd.my.id${endpoint}?${params.toString()}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd
      });
      const postData = await postRes.json();
      if (postData?.status === false) {
        throw new Error(postData.message || "Pembuatan APK belum berhasil diproses.");
      }
      return {
        success: true,
        result: postData
      };
    } else if (action === "checkban" || action === "wa-checkban") {
      endpoint = "/api/whatsapp/checkban";
      params.set("number", String(payload.number || "").replace(/[^0-9]/g, ""));
    }

    let res = await fetch(`https://api.jerexd.my.id${endpoint}?${params.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" }
    });
    let data = await res.json();

    // Khusus Gemini Direct jika model perlu disesuaikan dengan daftar models Jere API
    if (
      action === "chat" &&
      isGeminiDirectModel(targetModel) &&
      data?.status === false &&
      Array.isArray(data?.models) &&
      data.models.length > 0
    ) {
      params.set("model", resolveBestGeminiModel(targetModel, data.models));
      res = await fetch(`https://api.jerexd.my.id${endpoint}?${params.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json" }
      });
      data = await res.json();
    }

    // Jika /api/ai/aichat sedang mengalami technical issue di server Jere API,
    // langsung alihkan ke /api/ai/gemini atau /api/ai/copilot yang aktif tanpa buang waktu!
    if (action === "chat" && (data?.status === false || isTechnicalIssueAnswer(extractAiAnswer(data)))) {
      const cleanPrompt = buildIndonesianPrompt(payload.raw_prompt || payload.prompt || "");

      // Coba 1: Endpoint Gemini Jere API (/api/ai/gemini)
      try {
        const gemParams = new URLSearchParams({
          apikey: API_KEY,
          prompt: cleanPrompt,
          model: "gemini-2.0-flash",
          chatId: "HAOMI_XML"
        });
        let gemRes = await fetch(`https://api.jerexd.my.id/api/ai/gemini?${gemParams.toString()}`, {
          method: "GET",
          headers: { Accept: "application/json" }
        });
        let gemData = await gemRes.json();
        if (gemData?.status === false && Array.isArray(gemData?.models) && gemData.models.length > 0) {
          gemParams.set("model", resolveBestGeminiModel("gemini-2.0-flash", gemData.models));
          gemRes = await fetch(`https://api.jerexd.my.id/api/ai/gemini?${gemParams.toString()}`, {
            method: "GET",
            headers: { Accept: "application/json" }
          });
          gemData = await gemRes.json();
        }
        if (gemData?.status !== false && !isTechnicalIssueAnswer(extractAiAnswer(gemData))) {
          data = gemData;
        }
      } catch {}

      // Coba 2: Endpoint Copilot Jere API (/api/ai/copilot)
      if (data?.status === false || isTechnicalIssueAnswer(extractAiAnswer(data))) {
        try {
          const isShortGreet = /^(halo|hai|hi|hello|hali|tes|test|ping|p|pagi|siang|sore|malam|assalamualaikum)[\s!?.]*$/i.test(cleanPrompt);
          const copQuery = isShortGreet
            ? `${cleanPrompt}! Jawab sapaan ini dengan ramah dalam bahasa Indonesia dan tanyakan apa yang bisa dibantu.`
            : cleanPrompt;
          const copParams = new URLSearchParams({
            apikey: API_KEY,
            query: copQuery
          });
          const copRes = await fetch(`https://api.jerexd.my.id/api/ai/copilot?${copParams.toString()}`, {
            method: "GET",
            headers: { Accept: "application/json" }
          });
          const copData = await copRes.json();
          if (copData?.status !== false && !isTechnicalIssueAnswer(extractAiAnswer(copData))) {
            data = copData;
          }
        } catch {}
      }
    }

    if (data?.status === false) {
      throw new Error(data.message || "Permintaan belum berhasil diproses.");
    }
    if (action === "chat") {
      return {
        success: true,
        session_id: data?.session_id || payload.session_id,
        model: data?.model || payload.model,
        answer: extractAiAnswer(data)
      };
    }
    return {
      success: data?.status !== false,
      result: data
    };
  }

  async function apiRequest(action, payload = {}) {
    const startMs = performance.now();

    if (action === "web2apk" || (action === "tmpfiles" && payload.rawFile)) {
      try {
        const directData = await directJerexdFallback(action, payload);
        recordTelemetry(true, Math.round(performance.now() - startMs));
        return directData;
      } catch {
        // Lanjut ke backend /api sebagai fallback
      }
    }

    const jsonPayload = { ...payload };
    delete jsonPayload.rawFile;

    let response;
    try {
      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ action, ...jsonPayload })
      });
    } catch {
      try {
        const fallbackData = await directJerexdFallback(action, payload);
        recordTelemetry(true, Math.round(performance.now() - startMs));
        return fallbackData;
      } catch (err) {
        recordTelemetry(false, Math.round(performance.now() - startMs));
        throw err;
      }
    }

    if (response.status === 404 || response.status === 405) {
      try {
        const fallbackData = await directJerexdFallback(action, payload);
        recordTelemetry(true, Math.round(performance.now() - startMs));
        return fallbackData;
      } catch (err) {
        recordTelemetry(false, Math.round(performance.now() - startMs));
        throw err;
      }
    }

    let data;
    try {
      data = await response.json();
    } catch {
      recordTelemetry(false, Math.round(performance.now() - startMs));
      throw new Error(`Balasan server tidak terbaca (Kode ${response.status}).`);
    }

    const hasTechIssue = action === "chat" && isTechnicalIssueAnswer(extractAiAnswer(data));
    if (!response.ok || data.success === false || hasTechIssue) {
      try {
        const fallbackData = await directJerexdFallback(action, payload);
        recordTelemetry(true, Math.round(performance.now() - startMs));
        return fallbackData;
      } catch {}
      recordTelemetry(false, Math.round(performance.now() - startMs));
      throw new Error(data.message || `Permintaan gagal (Kode ${response.status}).`);
    }

    recordTelemetry(true, Math.round(performance.now() - startMs));
    return data;
  }

  function updateTitle(conversation) {
    const first = conversation.messages.find(message => message.role === "user");
    if (!first) return;
    const title = first.content.replace(/\s+/g, " ").trim();
    conversation.title = title.length > 42 ? `${title.slice(0, 39)}…` : title || "Obrolan baru";
  }

  function createLoading(sequence, model) {
    const article = document.createElement("article");
    article.className = "message assistant";
    article.dataset.loadingId = String(sequence);

    const heading = document.createElement("div");
    heading.className = "assistant-heading";

    const avatar = createRobotAvatarEl(true);

    const name = document.createElement("span");
    name.className = "assistant-name";
    name.textContent = "HAOMI BOT";

    const badge = document.createElement("span");
    badge.className = "model-badge";
    badge.textContent = modelName(model);

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";

    const hud = document.createElement("div");
    hud.className = "neural-thinking-hud";
    hud.setAttribute("aria-label", "HAOMI sedang menyiapkan balasan");

    const bars = document.createElement("div");
    bars.className = "wave-bars";
    for (let i = 0; i < 4; i++) {
      const bar = document.createElement("span");
      bar.className = "wave-bar";
      bars.appendChild(bar);
    }

    const label = document.createElement("span");
    label.textContent = "Sedang menyusun jawaban...";

    hud.append(bars, label);
    bubble.appendChild(hud);
    heading.append(avatar, name, badge);
    article.append(heading, bubble);
    els.messages.appendChild(article);
    scrollBottom();
    return article;
  }

  async function sendMessage(rawText, options = {}) {
    const prompt = String(rawText || "").trim();
    if (!prompt || busy) return;
    const fromChoiceCard = Boolean(options?.fromChoiceCard);

    // Jalankan perintah cepat jika diawali "/" tanpa spasi
    if (prompt.startsWith("/") && !prompt.includes(" ")) {
      if (executeSlashShortcut(prompt.toLowerCase())) {
        els.input.value = "";
        resizeInput();
        if (els.slashCmdMenu) els.slashCmdMenu.hidden = true;
        return;
      }
    }

    if (activeStreamCancel) activeStreamCancel();
    forceShowHud = false;
    if (els.slashCmdMenu) els.slashCmdMenu.hidden = true;

    const conversation = ensureConversation();
    const sequence = ++requestId;
    const model = conversation.model || getDefaultModel();

    conversation.messages.push({
      role: "user",
      content: prompt,
      createdAt: Date.now()
    });

    updateTitle(conversation);
    conversation.updatedAt = Date.now();

    els.input.value = "";
    resizeInput();
    setBusy(true);
    saveState();
    renderHistory();
    renderMessages(false);

    const loading = createLoading(sequence, model);

    let succeeded = false;
    try {
      const requestPayload = {
        prompt: buildIndonesianPrompt(prompt),
        raw_prompt: prompt,
        model,
        session_id: conversation.sessionId
      };

      if (pendingResetSession) {
        requestPayload.reset = "true";
        pendingResetSession = false;
      }

      const data = await apiRequest("chat", requestPayload);

      const answer = extractAiAnswer(data);

      if (!answer.trim()) {
        throw new Error("Belum ada teks balasan yang diterima, coba kirim ulang ya.");
      }

      conversation.sessionId = data.session_id || conversation.sessionId;
      conversation.messages.push({
        role: "assistant",
        content: answer,
        model: data.model || model,
        hideChoiceCard: fromChoiceCard,
        createdAt: Date.now()
      });
      succeeded = true;
    } catch (error) {
      conversation.messages.push({
        role: "assistant",
        content: `Maaf, pesanmu belum berhasil diproses.\n\nInfo: ${error.message || "Koneksi sedang sibuk, coba sebentar lagi ya."}`,
        model,
        error: true,
        createdAt: Date.now()
      });
    } finally {
      loading.remove();
      conversation.updatedAt = Date.now();
      saveState();
      renderHistory();
      renderMessages(succeeded);
      setBusy(false);
    }
  }

  async function retryLastQuestion(index) {
    if (busy) return;
    const conversation = activeConversation();
    if (!conversation) return;

    const errorMessage = conversation.messages[index];
    if (!errorMessage?.error) return;

    const previousUser = conversation.messages
      .slice(0, index)
      .reverse()
      .find(message => message.role === "user");

    if (!previousUser) {
      toast("Pesan sebelumnya tidak ditemukan.", true);
      return;
    }

    const prompt = previousUser.content;
    conversation.messages.splice(index, 1);
    conversation.messages.splice(conversation.messages.indexOf(previousUser), 1);
    saveState();
    renderMessages(false);

    await sendMessage(prompt);
  }

  function resizeInput() {
    if (!els.input) return;
    els.input.style.height = "auto";
    els.input.style.height = `${Math.min(els.input.scrollHeight, 160)}px`;
  }

  function toggleSidebar() {
    if (window.innerWidth <= 860) {
      const isOpen = !document.body.classList.contains("sidebar-open");
      document.body.classList.toggle("sidebar-open", isOpen);
      $("#appShell")?.classList.toggle("sidebar-open", isOpen);
      els.sidebar?.classList.toggle("open", isOpen);
    } else {
      document.body.classList.toggle("sidebar-collapsed");
    }
  }

  function closeMobileSidebar() {
    document.body.classList.remove("sidebar-open");
    $("#appShell")?.classList.remove("sidebar-open");
    els.sidebar?.classList.remove("open");
  }

  const viewIds = {
    chat: "chatView",
    viuprem: "viupremView",
    infokota: "infokotaView",
    tmpfiles: "tmpfilesView",
    web2apk: "web2apkView",
    checkban: "checkbanView",
    alight: "alightView",
    urlscan: "urlscanView",
    whatsapp: "whatsappView"
  };

  const viewTitles = {
    chat: "Chat AI",
    viuprem: "Viu Premium",
    infokota: "Info Kota",
    tmpfiles: "Tmp Files",
    web2apk: "Web2APK",
    checkban: "Cek Banned WA",
    alight: "Alight Motion",
    urlscan: "Cek Keamanan Link",
    whatsapp: "Reaksi Saluran WA"
  };

  function showView(name) {
    if (!viewIds[name]) return;

    Object.entries(viewIds).forEach(([key, elementId]) => {
      const view = document.getElementById(elementId);
      if (!view) return;
      view.hidden = key !== name;
      view.classList.toggle("active", key === name);
    });

    $$(".nav-item[data-view], .mob-nav-item[data-view]").forEach(button => {
      button.classList.toggle("active", button.dataset.view === name);
    });

    if (els.breadcrumb) els.breadcrumb.textContent = viewTitles[name];
    const isChat = name === "chat";
    if (els.activeChatTitle) els.activeChatTitle.hidden = !isChat;
    if (els.chatTitleDivider) els.chatTitleDivider.hidden = !isChat;
    const resetBtn = $("#resetSessionButton");
    const exportBtn = $("#exportChatButton");
    const dashBtn = $("#toggleDashboardBtn");
    if (resetBtn) resetBtn.hidden = !isChat;
    if (exportBtn) exportBtn.hidden = !isChat;
    if (dashBtn) dashBtn.hidden = !isChat;

    closeComposerMenu();
    closeMobileSidebar();

    if (isChat) renderMessages(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function newChat() {
    if (busy) {
      toast("Tunggu balasan selesai sebelum membuat obrolan baru.");
      return;
    }

    if (activeStreamCancel) activeStreamCancel();
    forceShowHud = false;

    const nextNum = (state.conversations?.length || 0) + 1;
    const conversation = newConversation(nextNum);
    state.conversations.unshift(conversation);
    state.activeId = conversation.id;

    saveState();
    renderHistory();
    renderMessages(false);
    showView("chat");
    if (els.conversationList) {
      els.conversationList.scrollTo({ top: 0, behavior: "smooth" });
    }
    toast(`Ruang obrolan baru dibuat (${state.conversations.length} tersimpan di Riwayat)`);
  }

  function resetCurrentSessionContext() {
    const conversation = ensureConversation();
    conversation.sessionId = `haomi-${id()}`;
    conversation.messages = [];
    pendingResetSession = true;
    forceShowHud = false;
    saveState();
    renderHistory();
    renderMessages(false);
    closeComposerMenu();
    toast("Obrolan dibersihkan, siap mulai bahasan baru");
  }

  function exportCurrentChat() {
    const conversation = activeConversation();
    if (!conversation || !conversation.messages.length) {
      toast("Belum ada isi obrolan untuk diunduh.", true);
      return;
    }

    const lines = [
      `# ${conversation.title}`,
      `Model: ${modelName(conversation.model)}`,
      `Waktu Unduh: ${new Date().toLocaleString("id-ID")}`,
      ""
    ];

    conversation.messages.forEach(msg => {
      const sender = msg.role === "user" ? "KAMU" : `HAOMI BOT (${modelName(msg.model)})`;
      lines.push(`### ${sender}`);
      lines.push(msg.content);
      lines.push("");
    });

    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${conversation.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "obrolan"}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast("Obrolan berhasil diunduh (.md)");
  }

  function exportAllBackup() {
    const payload = {
      exportedAt: new Date().toISOString(),
      settings,
      telemetry,
      conversations: state.conversations
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `haomi-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast("Cadangan data berhasil diunduh (.json)");
  }

  function toggleComposerMenu() {
    if (!els.composerToolsMenu) return;
    const isHidden = els.composerToolsMenu.hidden;
    els.composerToolsMenu.hidden = !isHidden;
    els.composerToolsBtn?.setAttribute("aria-expanded", String(isHidden));
  }

  function closeComposerMenu() {
    if (!els.composerToolsMenu) return;
    els.composerToolsMenu.hidden = true;
    els.composerToolsBtn?.setAttribute("aria-expanded", "false");
  }

  function openModelDialog() {
    if (!els.modelDialog) return;
    lastFocusedElement = document.activeElement;
    els.modelDialog.hidden = false;
    els.modelTrigger?.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    updateModelOptions();
  }

  function closeModelDialog() {
    if (!els.modelDialog) return;
    els.modelDialog.hidden = true;
    els.modelTrigger?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    lastFocusedElement?.focus?.({ preventScroll: true });
  }

  function updateModelOptions() {
    if (!els.modelList) return;
    const query = (els.modelSearch?.value || "").trim().toLowerCase();
    const selected = activeConversation()?.model || getDefaultModel();

    $$(".model-option", els.modelList).forEach(button => {
      const name = models[button.dataset.model]?.join(" ") || button.dataset.model;
      const provider = button.dataset.provider || "other";
      const matchesQuery = name.toLowerCase().includes(query) || button.dataset.model.toLowerCase().includes(query);
      const matchesProvider =
        activeProviderFilter === "all" ||
        provider === activeProviderFilter ||
        (activeProviderFilter === "other" && provider === "Copilot");
      button.hidden = !(matchesQuery && matchesProvider);
      const isSel = button.dataset.model === selected;
      button.classList.toggle("selected", isSel);
      button.classList.toggle("active", isSel);
    });
  }

  function selectModel(model) {
    if (!models[model]) return;

    const conversation = ensureConversation();
    conversation.model = model;
    saveSettings({ defaultModel: model });
    saveState();

    syncModelIndicators(model);
    updateModelOptions();
    closeModelDialog();
    toast(`Model aktif: ${modelName(model)}`);
  }

  function openSettings() {
    if (!els.settings) return;
    applySettingsToUI();
    els.settings.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeSettings() {
    if (!els.settings) return;
    els.settings.hidden = true;
    document.body.style.overflow = "";
  }

  function setAlightMode(mode) {
    const select = $("#alightAction");
    if (select) select.value = mode;
    $$(".mode-tab[data-am-mode]").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.amMode === mode);
    });
    updateAlightFields();
  }

  function updateAlightFields() {
    const select = $("#alightAction");
    if (!select) return;
    const mode = select.value;
    const needsLink = mode === "am-verify";
    const linkGroup = $("#verificationLinkGroup");
    const linkInput = $("#alightLink");
    const submitSpan = $("#alightSubmit span");
    if (linkGroup) linkGroup.hidden = !needsLink;
    if (linkInput) linkInput.required = needsLink;
    if (submitSpan) {
      submitSpan.textContent = needsLink ? "Verifikasi Tautan Akun" : "Kirim Email Verifikasi";
    }
    $$(".mode-tab[data-am-mode]").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.amMode === mode);
    });
  }

  const FIELD_LABELS_ID = {
    nama: "Nama Wilayah / Kota",
    kota: "Nama Kota / Kabupaten",
    deskripsi: "Deskripsi Lengkap Wilayah",
    description: "Deskripsi Lengkap",
    provinsi: "Provinsi",
    negara: "Negara",
    bupati: "Bupati / Kepala Daerah",
    walikota: "Wali Kota",
    wali_kota: "Wali Kota",
    gubernur: "Gubernur",
    url: "Tautan Resmi / Referensi",
    link: "Tautan Terkait",
    luas: "Luas Wilayah",
    populasi: "Jumlah Penduduk",
    penduduk: "Jumlah Penduduk",
    kode_pos: "Kode Pos",
    kodepos: "Kode Pos",
    kecamatan: "Jumlah Kecamatan",
    kelurahan: "Jumlah Kelurahan / Desa",
    koordinat: "Koordinat Geografis",
    julukan: "Julukan Daerah",
    hari_jadi: "Hari Jadi",
    email: "Alamat Email Akun",
    paket: "Paket Langganan",
    plan: "Paket Langganan",
    durasi: "Durasi Masa Aktif",
    duration: "Durasi Masa Aktif",
    expired: " Berlaku Hingga",
    exp: "Masa Aktif Hingga",
    orderid: "ID Pesanan (Order ID)",
    order_id: "ID Pesanan",
    username: "Nama Pengguna (Username)",
    user: "Pengguna",
    password: "Kata Sandi (Password)",
    pass: "Kata Sandi",
    pin: "Kode PIN",
    number: "Nomor WhatsApp",
    nomor: "Nomor WhatsApp",
    phone: "Nomor Telepon",
    isbanned: "Status Terblokir (Banned)",
    is_banned: "Status Terblokir (Banned)",
    banned: "Status Banned",
    status_ban: "Status Keamanan Nomor",
    reason: "Alasan / Keterangan",
    download: "Tautan Unduh APK / File",
    download_url: "Tautan Unduh APK / File",
    apk_url: "Tautan Unduh APK",
    file_url: "Tautan Unduh File Cloud",
    app_name: "Nama Aplikasi Android",
    name: "Nama Item / Aplikasi",
    package_name: "Nama Paket Android",
    package: "Paket Aplikasi",
    version: "Versi Aplikasi",
    size: "Ukuran File",
    filesize: "Ukuran File",
    mime: "Tipe File",
    mimetype: "Format File",
    ip: "Alamat IP Server",
    country: "Negara Server",
    isp: "Penyedia Jaringan (ISP)",
    asn: "Kode Jaringan (ASN)",
    domain: "Nama Domain",
    server: "Perangkat Server",
    malicious: "Indikasi Berbahaya",
    safe: "Status Keamanan",
    score: "Skor Keamanan",
    reaction: "Emoji Reaksi Terkirim",
    reactions: "Daftar Emoji Reaksi",
    channel: "Saluran WhatsApp Target",
    message: "Pesan Konfirmasi Server",
    pesan: "Keterangan Server",
    creator: "Pengembang Sistem",
    author: "Pengembang Sistem"
  };

  const TOOL_META_CONFIG = {
    infokota: {
      serviceName: "Info Kota & Profil Wilayah Indonesia",
      readyTitle: "Siap Mencari Profil & Deskripsi Kota",
      readyNarrative: "Ketik nama kota atau kabupaten di Indonesia (contoh: Jombang, Surabaya, Malang) lalu tekan tombol 'Lihat Info Kota'. Sistem akan menyajikan deskripsi wilayah lengkap beserta Tabel Inti Status dan Tabel Seluruh Informasi.",
      defaultTarget: "Jombang, Jawa Timur"
    },
    "am-send": {
      serviceName: "Alight Motion Pro — Aktivasi 1 Tahun",
      readyTitle: "Siap Memproses Akun Alight Motion Premium",
      readyNarrative: "Masukkan alamat email akun Alight Motion Anda untuk mengaktifkan paket Alight Motion Premium durasi 1 Tahun. Status aktivasi dan rincian akun akan ditampilkan secara lengkap pada tabel di bawah.",
      defaultTarget: "Email Akun Alight Motion"
    },
    "am-verify": {
      serviceName: "Alight Motion Pro — Verifikasi Tautan 1 Tahun",
      readyTitle: "Siap Memverifikasi Tautan Alight Motion",
      readyNarrative: "Tempelkan tautan verifikasi dari kotak masuk email Anda untuk menyelesaikan aktivasi Alight Motion Premium durasi 1 Tahun.",
      defaultTarget: "Tautan Verifikasi Email"
    },
    viuprem: {
      serviceName: "Generator Akun Viu Premium VIP",
      readyTitle: "Siap Mengambil Akun Viu Premium VIP",
      readyNarrative: "Tekan tombol 'Ambil Viu Premium Sekarang' untuk menarik data akses akun Viu Premium VIP terbaru bebas iklan lengkap dengan tabel informasi akun.",
      defaultTarget: "Server Viu VIP"
    },
    tmpfiles: {
      serviceName: "TmpFiles Cloud File Hosting",
      readyTitle: "Siap Mengunggah File ke Cloud",
      readyNarrative: "Pilih file dari perangkat Anda atau masukkan tautan untuk membuat link unduhan awan sementara (TmpFiles) yang langsung siap dibagikan.",
      defaultTarget: "File Perangkat / URL"
    },
    web2apk: {
      serviceName: "Web2APK Android Application Builder",
      readyTitle: "Siap Merakit Website Menjadi Aplikasi APK",
      readyNarrative: "Masukkan alamat URL website, nama aplikasi Android, dan ikon (opsional) untuk membangun file instalasi Android (.apk) siap pasang.",
      defaultTarget: "https://hao-ai-kappa.vercel.app/"
    },
    checkban: {
      serviceName: "Diagnostik Status Banned Nomor WhatsApp",
      readyTitle: "Siap Memeriksa Keamanan Nomor WhatsApp",
      readyNarrative: "Masukkan nomor telepon WhatsApp (awalan 08... atau 628...) untuk memeriksa apakah nomor tersebut berstatus AMAN aktif atau sedang terkena blokir/banned.",
      defaultTarget: "Nomor WhatsApp"
    },
    urlscan: {
      serviceName: "Pemindai Keamanan Link & Reputasi Website",
      readyTitle: "Siap Memindai Keamanan Tautan URL",
      readyNarrative: "Masukkan alamat tautan (http:// atau https://) untuk memeriksa keamanan domain, alamat IP server, lokasi negara, dan reputasi website.",
      defaultTarget: "Alamat Website (URL)"
    },
    "whatsapp-react": {
      serviceName: "Pengirim Reaksi Emoji Saluran WhatsApp",
      readyTitle: "Siap Mengirim Reaksi ke Saluran WhatsApp",
      readyNarrative: "Masukkan tautan postingan Saluran (Channel) WhatsApp dan pilih susunan emoji untuk mengirimkan reaksi otomatis.",
      defaultTarget: "Tautan Postingan Saluran WA"
    }
  };

  function formatHumanKey(rawKey) {
    const clean = String(rawKey || "").trim();
    const lower = clean.toLowerCase();
    if (FIELD_LABELS_ID[lower]) return FIELD_LABELS_ID[lower];
    const lastPart = lower.split(".").pop();
    if (FIELD_LABELS_ID[lastPart]) return FIELD_LABELS_ID[lastPart];
    return clean
      .replace(/[._-]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  function enrichCityDescription(cityData, fallbackKota = "Jombang") {
    const nama = String(cityData?.nama || cityData?.kota || fallbackKota || "Wilayah").trim();
    const prov = String(cityData?.provinsi || "Jawa Timur").trim();
    const negara = String(cityData?.negara || "Indonesia").trim();
    const pimpinan = String(cityData?.bupati || cityData?.walikota || cityData?.wali_kota || cityData?.gubernur || "").trim();
    const rawDesc = String(cityData?.deskripsi || cityData?.description || "").trim();
    const keyLower = nama.toLowerCase().replace(/^(kabupaten|kota)\s+/i, "").trim();

    if (!rawDesc || /tidak ada deskripsi|no description|^-$|^null$/i.test(rawDesc)) {
      if (CITY_DESCRIPTIONS_ID[keyLower]) {
        return CITY_DESCRIPTIONS_ID[keyLower] + (pimpinan ? ` Saat ini pemerintahan daerah ${nama} dipimpin oleh ${pimpinan}.` : "");
      }
      return (
        `Ini adalah deskripsi tentang ${nama}: ${nama} adalah sebuah wilayah daerah otonom yang terletak di Provinsi ${prov}, ${negara}.` +
        (pimpinan ? ` Pemerintahan wilayah ${nama} saat ini dipimpin oleh ${pimpinan}.` : "") +
        (cityData?.url ? ` Profil ensiklopedia dan data wilayah selengkapnya tercatat di referensi resmi ${cityData.url}.` : "")
      );
    }
    if (!/^ini adalah deskripsi tentang/i.test(rawDesc)) {
      return `Ini adalah deskripsi tentang ${nama}: ${rawDesc}`;
    }
    return rawDesc;
  }

  function flattenApiDataForTable(obj, prefix = "", out = []) {
    if (!obj || typeof obj !== "object") return out;
    if (Array.isArray(obj)) {
      obj.slice(0, 15).forEach((item, idx) => {
        if (item && typeof item === "object") {
          flattenApiDataForTable(item, `${prefix ? prefix + " " : ""}#${idx + 1}`, out);
        } else if (item !== null && item !== undefined && String(item).trim() !== "") {
          out.push([`${prefix || "Data"} #${idx + 1}`, String(item)]);
        }
      });
      return out;
    }

    for (const [k, v] of Object.entries(obj)) {
      if (v === null || v === undefined || v === "") continue;
      if (["statusCode", "status", "success", "raw"].includes(k)) continue;
      const labelKey = prefix ? `${prefix} · ${formatHumanKey(k)}` : formatHumanKey(k);
      if (typeof v === "object") {
        flattenApiDataForTable(v, prefix ? `${prefix} · ${formatHumanKey(k)}` : formatHumanKey(k), out);
      } else {
        out.push([labelKey, v, k]);
      }
    }
    return out;
  }

  function buildFeatureNarrativeAndCoreRows(action, cleanData, context = {}) {
    const { payload = {}, status = "ready", elapsedMs = null, errorText = "" } = context;
    const meta = TOOL_META_CONFIG[action] || TOOL_META_CONFIG.infokota;
    const nested =
      (cleanData?.result && typeof cleanData.result === "object" && !Array.isArray(cleanData.result) ? cleanData.result : null) ||
      (cleanData?.data && typeof cleanData.data === "object" && !Array.isArray(cleanData.data) ? cleanData.data : null) ||
      (cleanData && typeof cleanData === "object" ? cleanData : {});

    const merged = { ...cleanData, ...nested };

    if (status === "ready") {
      return {
        narrativeTitle: meta.readyTitle,
        narrativeBadge: "SIAP DIGUNAKAN",
        narrativeHtml: escapeHTML(meta.readyNarrative),
        coreRows: [
          ["Status Fitur", { pill: "SIAP DIGUNAKAN", pillType: "wait" }],
          ["Nama Layanan", meta.serviceName],
          ["Target Default", meta.defaultTarget],
          ["Format Hasil", "Narasi Penjelasan + Tabel Inti Status + Tabel Seluruh Informasi"]
        ],
        extraDetailRows: []
      };
    }

    if (status === "loading") {
      return {
        narrativeTitle: "Sedang Memproses Permintaan...",
        narrativeBadge: "PROSES",
        narrativeHtml: `Sistem sedang menghubungi server untuk memproses <strong>${escapeHTML(meta.serviceName)}</strong>. Mohon tunggu sebentar...`,
        coreRows: [
          ["Status Eksekusi", { pill: "SEDANG DIPROSES...", pillType: "wait" }],
          ["Layanan Fitur", meta.serviceName],
          ["Input Permintaan", payload.kota || payload.email || payload.number || payload.url || payload.name || " Aktif"]
        ],
        extraDetailRows: []
      };
    }

    if (status === "error") {
      const cleanErr = String(errorText || merged.message || "Terjadi kendala saat menghubungi layanan.").replace(/^\/\/\s*(Gagal diproses:\s*)?/i, "");
      let customErrorHint = `Permintaan pada fitur <strong>${escapeHTML(meta.serviceName)}</strong> belum berhasil diselesaikan: <strong>${escapeHTML(cleanErr)}</strong>. Silakan periksa kembali data input Anda atau coba beberapa saat lagi.`;
      if (action === "am-send" || action === "am-verify") {
        customErrorHint = `Permintaan aktivasi <strong>Alight Motion Premium (Durasi 1 Tahun)</strong> untuk email <strong>${escapeHTML(payload.email || "-")}</strong> belum berhasil diproses: ${escapeHTML(cleanErr)}. Pastikan alamat email valid dan belum melewati batas harian server.`;
      }
      return {
        narrativeTitle: "Informasi Kendala Proses",
        narrativeBadge: "PERLU DICEK",
        narrativeHtml: customErrorHint,
        coreRows: [
          ["Status Eksekusi", { pill: "GAGAL / PERLU CEK ULANG", pillType: "fail" }],
          ["Nama Fitur", meta.serviceName],
          ["Input Target", payload.kota || payload.email || payload.number || payload.url || payload.name || "-"],
          ["Keterangan Server", cleanErr],
          ["Waktu Respon", elapsedMs ? `${elapsedMs} ms` : "-"]
        ],
        extraDetailRows: []
      };
    }

    // STATUS === "success"
    if (action === "infokota") {
      const namaKota = merged.nama || merged.kota || payload.kota || "Jombang";
      const prov = merged.provinsi || "Jawa Timur";
      const negara = merged.negara || "Indonesia";
      const pimpinan = merged.bupati || merged.walikota || merged.wali_kota || merged.gubernur || "Terdaftar di Pemerintah Daerah";
      const fullNarrative = enrichCityDescription(merged, namaKota);
      merged.deskripsi = fullNarrative;
      if (cleanData?.result && typeof cleanData.result === "object") {
        cleanData.result.deskripsi = fullNarrative;
      }

      return {
        narrativeTitle: `Deskripsi & Profil Wilayah: ${namaKota}`,
        narrativeBadge: "DATA DITEMUKAN",
        narrativeHtml: `<strong>${escapeHTML(fullNarrative)}</strong>`,
        coreRows: [
          ["Status Pencarian", { pill: "BERHASIL DITEMUKAN", pillType: "ok" }],
          ["Nama Kota / Kabupaten", `${namaKota}`],
          ["Provinsi & Negara", `${prov}, ${negara}`],
          ["Kepala Daerah (Bupati / Wali Kota)", `${pimpinan}`],
          ["Ringkasan Deskripsi", fullNarrative],
          ["Waktu Respon Server", elapsedMs ? `${elapsedMs} ms (Cepat)` : "Instan"]
        ],
        extraDetailRows: []
      };
    }

    if (action === "am-send" || action === "am-verify") {
      const emailTarget = merged.email || payload.email || "Akun Anda";
      const isVerify = action === "am-verify";
      const amNarrative = isVerify
        ? `🎉 <strong>Selamat! Akun Alight Motion Anda (${escapeHTML(emailTarget)}) berhasil diverifikasi dan aktif menjadi Premium dengan durasi 1 Tahun!</strong> Seluruh fitur Pro, efek eksklusif, serta ekspor proyek tanpa watermark kini sudah dapat digunakan sepenuhnya.`
        : `🎉 <strong>Selamat! Akun Alight Motion Anda (${escapeHTML(emailTarget)}) berhasil diproses untuk paket Premium durasi 1 Tahun!</strong> Permintaan aktivasi telah dikirimkan oleh server — silakan periksa kotak masuk email Anda atau buka aplikasi Alight Motion untuk menikmati akses Pro 1 Tahun.`;

      return {
        narrativeTitle: "Status Aktivasi Alight Motion Premium",
        narrativeBadge: "PREMIUM 1 TAHUN",
        narrativeHtml: amNarrative,
        coreRows: [
          ["Status Aktivasi", { pill: "BERHASIL · AKTIF PREMIUM", pillType: "ok" }],
          ["Email Akun Target", emailTarget],
          ["Jenis Paket", "Alight Motion Pro / Premium VIP"],
          ["Durasi Masa Aktif", "1 Tahun (365 Hari Full Akses)"],
          ["Keterangan Fitur", "Bebas Watermark, Semua Efek Pro & Ekspor Resolusi Tinggi Terbuka"],
          ["Waktu Proses Server", elapsedMs ? `${elapsedMs} ms` : "Selesai"]
        ],
        extraDetailRows: [
          ["Paket Langganan", "Alight Motion Premium (Pro)"],
          ["Durasi Aktif", "1 Tahun (365 Hari)"],
          ["Status Watermark", "Nonaktif (Tanpa Watermark)"]
        ]
      };
    }

    if (action === "checkban") {
      const numTarget = merged.number || merged.nomor || payload.number || "-";
      const rawBanVal = String(merged.isBanned ?? merged.is_banned ?? merged.banned ?? merged.status_ban ?? "").toLowerCase();
      const msgLower = String(merged.message || merged.pesan || JSON.stringify(merged)).toLowerCase();
      const isBanned =
        rawBanVal === "true" ||
        rawBanVal === "banned" ||
        (msgLower.includes("terblokir") && !msgLower.includes("tidak terblokir")) ||
        (msgLower.includes("banned") && !msgLower.includes("not banned") && !msgLower.includes("unbanned") && !msgLower.includes("false"));

      const waNarrative = isBanned
        ? `⚠️ <strong>Perhatian: Nomor WhatsApp ${escapeHTML(numTarget)} terdeteksi sedang mengalami pembatasan / BANNED oleh pihak WhatsApp.</strong> Silakan ajukan peninjauan ulang melalui aplikasi WhatsApp resmi.`
        : `🎉 <strong>Selamat! Nomor WhatsApp ${escapeHTML(numTarget)} berstatus AMAN &amp; AKTIF (Tidak Terblokir / Tidak Banned).</strong> Nomor ini bersih dari pelanggaran sistem dan dapat digunakan untuk berkirim pesan maupun panggilan secara normal.`;

      return {
        narrativeTitle: `Hasil Diagnostik Nomor WA: ${numTarget}`,
        narrativeBadge: isBanned ? "TERDETEKSI BANNED" : "NOMOR AMAN",
        narrativeHtml: waNarrative,
        coreRows: [
          ["Status Keamanan Nomor", { pill: isBanned ? "TERBLOKIR / BANNED" : "AMAN & AKTIF (NORMAL)", pillType: isBanned ? "fail" : "ok" }],
          ["Nomor WhatsApp", numTarget],
          ["Kesimpulan Pemeriksaan", isBanned ? "Nomor sedang dibatasi oleh sistem WhatsApp" : "Nomor aman dipakai & bebas blokir WhatsApp"],
          ["Waktu Pemeriksaan", elapsedMs ? `${elapsedMs} ms` : "Selesai"]
        ],
        extraDetailRows: [
          ["Nomor yang Diperiksa", numTarget],
          ["Status Blokir WhatsApp", isBanned ? "Terblokir (Banned)" : "Tidak Terblokir (Aman)"]
        ]
      };
    }

    if (action === "web2apk") {
      const appName = merged.name || merged.app_name || payload.name || "Ai Haomi";
      const webUrl = merged.url || payload.url || "https://hao-ai-kappa.vercel.app/";
      const dlUrl = merged.download || merged.download_url || merged.apk_url || merged.file_url || merged.result?.download || merged.result?.url || "";

      return {
        narrativeTitle: `Aplikasi Android ${appName}.apk Berhasil Dibuat!`,
        narrativeBadge: "APK SIAP UNDUH",
        narrativeHtml: `🎉 <strong>Selamat! Website ${escapeHTML(webUrl)} telah berhasil dikonversi dan dirakit menjadi aplikasi Android bernama "${escapeHTML(appName)}.apk"!</strong> Silakan tekan tombol <strong>Unduh File APK</strong> pada tabel di bawah untuk memasang aplikasi di HP Android Anda.`,
        coreRows: [
          ["Status Perakitan APK", { pill: "BERHASIL DIRAKIT (.APK)", pillType: "ok" }],
          ["Nama Aplikasi Android", `${appName} (.apk)`],
          ["Alamat Website Sumber", webUrl],
          ...(dlUrl ? [["Tautan Unduhan APK", dlUrl]] : []),
          [" Durasi Kompilasi", elapsedMs ? `${(elapsedMs / 1000).toFixed(1)} detik (${elapsedMs} ms)` : "Selesai"]
        ],
        extraDetailRows: [
          ["Nama Aplikasi", appName],
          ["Platform Target", "Android OS (.APK Instalasi Langsung)"]
        ]
      };
    }

    if (action === "viuprem") {
      return {
        narrativeTitle: "Akses Akun Viu Premium VIP Berhasil Diambil",
        narrativeBadge: "VIP AKTIF",
        narrativeHtml: `🎉 <strong>Selamat! Data akses Viu Premium VIP berhasil diambil dari server!</strong> Anda dapat menggunakan informasi akun pada Tabel Seluruh Informasi di bawah untuk menikmati tayangan drama Asia, anime, dan film eksklusif tanpa iklan.`,
        coreRows: [
          ["Status Pengambilan Data", { pill: "BERHASIL · VIU VIP AKTIF", pillType: "ok" }],
          ["Layanan Streaming", "Viu Premium VIP (Full HD & Tanpa Iklan)"],
          ["Keterangan Akses", merged.message || "Akun siap digunakan"],
          ["Waktu Respon Server", elapsedMs ? `${elapsedMs} ms` : "Selesai"]
        ],
        extraDetailRows: [
          ["Tipe Akun", "Viu Premium VIP"],
          ["Benefit Utama", "Bebas Iklan, Episode Lebih Cepat & Resolusi Full HD"]
        ]
      };
    }

    if (action === "tmpfiles") {
      const fileUrl = merged.url || merged.file_url || merged.download || merged.result?.url || payload.url || "";
      return {
        narrativeTitle: "Unggahan Cloud TmpFiles Berhasil!",
        narrativeBadge: "LINK AKTIF",
        narrativeHtml: `🎉 <strong>Selamat! File Anda berhasil diproses ke penyimpanan awan sementara (TmpFiles Cloud)!</strong> Tautan unduhan langsung sudah aktif dan siap disalin atau dibuka melalui tabel di bawah.`,
        coreRows: [
          ["Status Unggahan Cloud", { pill: "BERHASIL DIUNGGAH", pillType: "ok" }],
          ["Nama File / Sumber", payload.file_name || payload.url || "File Cloud TmpFiles"],
          ...(fileUrl ? [["Tautan Unduhan Cloud", fileUrl]] : []),
          ["Waktu Proses", elapsedMs ? `${elapsedMs} ms` : "Selesai"]
        ],
        extraDetailRows: []
      };
    }

    if (action === "urlscan") {
      const targetUrl = payload.url || merged.url || "-";
      return {
        narrativeTitle: "Hasil Pemindaian Keamanan Link & Domain",
        narrativeBadge: "SELESAI DIPINDAI",
        narrativeHtml: `🛡️ <strong>Pemindaian keamanan untuk tautan ${escapeHTML(targetUrl)} telah selesai!</strong> Berikut adalah ringkasan status keamanan domain beserta rincian teknis alamat IP, lokasi server, dan identitas jaringan pada tabel di bawah.`,
        coreRows: [
          ["Status Pemindaian", { pill: "SELESAI & TERVERIFIKASI", pillType: "ok" }],
          ["Tautan yang Diperiksa", targetUrl],
          ["Keterangan Keamanan", merged.message || merged.status_text || "Data domain & server berhasil dianalisis"],
          ["Waktu Pemindaian", elapsedMs ? `${elapsedMs} ms` : "Selesai"]
        ],
        extraDetailRows: []
      };
    }

    if (action === "whatsapp-react") {
      const reactList = payload.reaction || merged.reaction || "❤️";
      const chUrl = payload.url || merged.url || "-";
      return {
        narrativeTitle: "Reaksi Emoji Saluran WhatsApp Terkirim!",
        narrativeBadge: "TERKIRIM",
        narrativeHtml: `🎉 <strong>Selamat! Paket reaksi emoji (${escapeHTML(reactList)}) berhasil dikirimkan ke postingan Saluran WhatsApp tujuan!</strong> Seluruh reaksi telah diproses secara otomatis oleh server.`,
        coreRows: [
          ["Status Pengiriman", { pill: "BERHASIL TERKIRIM", pillType: "ok" }],
          ["Emoji yang Dikirim", reactList],
          ["Tautan Saluran WA", chUrl],
          ["Waktu Eksekusi", elapsedMs ? `${elapsedMs} ms` : "Selesai"]
        ],
        extraDetailRows: []
      };
    }

    return {
      narrativeTitle: "Hasil Eksekusi Fitur",
      narrativeBadge: "BERHASIL",
      narrativeHtml: `🎉 <strong>Permintaan Anda pada fitur ${escapeHTML(meta.serviceName)} telah berhasil diproses!</strong> Lihat rincian lengkapnya pada kedua tabel di bawah ini.`,
      coreRows: [
        ["Status Eksekusi", { pill: "BERHASIL", pillType: "ok" }],
        ["Layanan", meta.serviceName],
        ["Waktu Proses", elapsedMs ? `${elapsedMs} ms` : "Selesai"]
      ],
      extraDetailRows: []
    };
  }

  function createTableCellValue(val, rawKey = "") {
    const td = document.createElement("td");
    if (val && typeof val === "object" && val.pill) {
      const span = document.createElement("span");
      const typeClass = val.pillType === "fail" ? "is-fail" : (val.pillType === "wait" ? "is-wait" : "is-ok");
      span.className = `status-pill-inline ${typeClass}`;
      span.textContent = val.pill;
      td.appendChild(span);
      return td;
    }

    const strVal = String(val ?? "-").trim();
    if (/^https?:\/\//i.test(strVal)) {
      const urlText = document.createElement("div");
      urlText.style.fontFamily = "var(--font-mono)";
      urlText.style.fontSize = "11.5px";
      urlText.style.color = "var(--text-secondary)";
      urlText.textContent = strVal;

      const actions = document.createElement("div");
      actions.className = "table-link-actions";

      const a = document.createElement("a");
      a.href = strVal;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "apk-download-banner";
      const isDownload = /apk|download|tmpfiles|file/i.test(rawKey) || /\.apk($|\?)/i.test(strVal);
      a.textContent = isDownload ? "⬇ Unduh File / APK Sekarang" : "↗ Buka Tautan Resmi";

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "table-copy-mini-btn";
      copyBtn.textContent = "Salin Link";
      copyBtn.addEventListener("click", () => copyText(strVal));

      actions.append(a, copyBtn);
      td.append(urlText, actions);
      return td;
    }

    if (strVal.toLowerCase() === "true") {
      td.textContent = "Ya / Aktif (True)";
      return td;
    }
    if (strVal.toLowerCase() === "false") {
      td.textContent = "Tidak / Nonaktif (False)";
      return td;
    }

    td.textContent = strVal;
    return td;
  }

  function buildCyberTableCard(titleText, badgeText, rows) {
    const card = document.createElement("div");
    card.className = "cyber-table-card";

    const header = document.createElement("div");
    header.className = "cyber-table-header";

    const title = document.createElement("span");
    title.className = "cyber-table-title";
    title.innerHTML = `<span class="pulse-dot"></span> ${escapeHTML(titleText)}`;

    const badge = document.createElement("span");
    badge.className = "cyber-table-count";
    badge.textContent = badgeText;

    header.append(title, badge);

    const scrollWrap = document.createElement("div");
    scrollWrap.className = "cyber-table-scroll";

    const table = document.createElement("table");
    table.className = "cyber-status-table";

    const tbody = document.createElement("tbody");
    rows.forEach(([label, value, rawKey]) => {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.scope = "row";
      th.textContent = label;
      const td = createTableCellValue(value, rawKey || label);
      tr.append(th, td);
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    scrollWrap.appendChild(table);
    card.append(header, scrollWrap);
    return card;
  }

  function renderStructuredSummary(summaryEl, data, context = {}) {
    if (!summaryEl) return;
    summaryEl.replaceChildren();

    const action = context.action || summaryEl.dataset.toolAction || "infokota";
    const status = context.status || "success";
    const resultPre = context.resultElement || null;

    const cleanObj = (data && typeof data === "object") ? sanitizeBrandData(data) : {};
    const {
      narrativeTitle,
      narrativeBadge,
      narrativeHtml,
      coreRows,
      extraDetailRows
    } = buildFeatureNarrativeAndCoreRows(action, cleanObj, context);

    // 1. Kartu Narasi & Kesimpulan Mudah Dipahami
    const narrativeCard = document.createElement("div");
    narrativeCard.className = `feature-narrative-card${status === "error" ? " is-error-narrative" : (status === "ready" ? " is-ready-narrative" : "")}`;

    const narHeader = document.createElement("div");
    narHeader.className = "narrative-header";

    const narTitle = document.createElement("span");
    narTitle.className = "narrative-title";
    narTitle.innerHTML = `<span class="pulse-dot"></span> ${escapeHTML(narrativeTitle)}`;

    const narBadge = document.createElement("span");
    narBadge.className = "narrative-badge";
    narBadge.textContent = narrativeBadge;

    narHeader.append(narTitle, narBadge);

    const narBody = document.createElement("p");
    narBody.className = "narrative-body";
    narBody.innerHTML = narrativeHtml;

    narrativeCard.append(narHeader, narBody);
    summaryEl.appendChild(narrativeCard);

    // 2. Tabel 1: TABEL INTI STATUS FITUR
    const coreTableCard = buildCyberTableCard(
      "TABEL INTI STATUS",
      status === "ready" ? "MODE SIAP" : "INTI STATUS",
      coreRows
    );
    summaryEl.appendChild(coreTableCard);

    // 3. Tabel 2: TABEL SELURUH INFORMASI & RINCIAN LENGKAP (saat hasil keluar)
    if (status === "success" || (data && typeof data === "object" && Object.keys(cleanObj).length > 0)) {
      const nestedTarget =
        (cleanObj.result && typeof cleanObj.result === "object" ? cleanObj.result : null) ||
        (cleanObj.data && typeof cleanObj.data === "object" ? cleanObj.data : null) ||
        cleanObj;

      const flatRows = flattenApiDataForTable(nestedTarget);
      if (cleanObj !== nestedTarget) {
        Object.entries(cleanObj).forEach(([k, v]) => {
          if (["result", "data", "statusCode", "status", "success", "raw"].includes(k)) return;
          if (v !== null && v !== undefined && typeof v !== "object") {
            const lbl = formatHumanKey(k);
            if (!flatRows.some(r => r[0] === lbl)) {
              flatRows.push([lbl, v, k]);
            }
          }
        });
      }

      extraDetailRows.forEach(([lbl, val]) => {
        if (!flatRows.some(r => r[0].toLowerCase() === lbl.toLowerCase())) {
          flatRows.unshift([lbl, val, lbl]);
        }
      });

      if (flatRows.length > 0) {
        const fullInfoTableCard = buildCyberTableCard(
          "TABEL SELURUH INFORMASI LENGKAP",
          `${flatRows.length} INFO DETAIL`,
          flatRows
        );
        summaryEl.appendChild(fullInfoTableCard);
      }
    }

    // 4. Tombol Lipat (Toggle) Data Teknis JSON Mentah agar tidak membingungkan
    if (resultPre && (status === "success" || status === "error")) {
      const hideJsonByDefault = settings.autoHideJson !== false && status === "success";
      resultPre.hidden = hideJsonByDefault;

      const toggleWrap = document.createElement("div");
      toggleWrap.className = "raw-json-toggle-wrap";

      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.className = "raw-json-toggle-btn";
      const updateBtnText = () => {
        toggleBtn.innerHTML =
          `<span>&lt;/&gt; ${resultPre.hidden ? "Tampilkan Data Teknis (JSON Mentah)" : "Sembunyikan Data Teknis (JSON Mentah)"}</span>` +
          `<span>${resultPre.hidden ? "Buka ▾" : "Tutup ▴"}</span>`;
      };
      updateBtnText();

      toggleBtn.addEventListener("click", () => {
        resultPre.hidden = !resultPre.hidden;
        updateBtnText();
      });

      toggleWrap.appendChild(toggleBtn);
      summaryEl.appendChild(toggleWrap);
    }

    summaryEl.hidden = false;
  }

  function initAllToolReadyTables() {
    const map = [
      ["alightSummary", "alightResult", "am-send"],
      ["urlscanSummary", "urlscanResult", "urlscan"],
      ["whatsappSummary", "whatsappResult", "whatsapp-react"],
      ["viupremSummary", "viupremResult", "viuprem"],
      ["infokotaSummary", "infokotaResult", "infokota"],
      ["tmpfilesSummary", "tmpfilesResult", "tmpfiles"],
      ["web2apkSummary", "web2apkResult", "web2apk"],
      ["checkbanSummary", "checkbanResult", "checkban"]
    ];
    map.forEach(([sumId, resId, act]) => {
      const sumEl = document.getElementById(sumId);
      const resEl = document.getElementById(resId);
      if (sumEl) {
        sumEl.dataset.toolAction = act;
        renderStructuredSummary(sumEl, null, {
          action: act,
          status: "ready",
          resultElement: resEl
        });
      }
      if (resEl) resEl.hidden = true;
    });
  }

  function showToolResult(element, statusBadge, timeBadge, summaryEl, text, status = "", elapsedMs = null, rawObj = null, extraContext = {}) {
    if (!element) return;
    element.classList.remove("is-error", "is-success");
    statusBadge?.classList.remove("is-error", "is-success");

    let normalizedStatus = "ready";
    if (status === "error") {
      normalizedStatus = "error";
      element.classList.add("is-error");
      statusBadge?.classList.add("is-error");
      if (statusBadge) statusBadge.textContent = "GAGAL";
    } else if (status === "success") {
      normalizedStatus = "success";
      element.classList.add("is-success");
      statusBadge?.classList.add("is-success");
      if (statusBadge) statusBadge.textContent = "BERHASIL";
    } else if (status === "PROSES") {
      normalizedStatus = "loading";
      if (statusBadge) statusBadge.textContent = "PROSES";
    } else {
      if (statusBadge) statusBadge.textContent = status || "SIAP";
    }

    if (timeBadge) {
      if (elapsedMs !== null) {
        timeBadge.hidden = false;
        timeBadge.textContent = `${elapsedMs} ms`;
      } else {
        timeBadge.hidden = true;
      }
    }

    const cleanText = sanitizeBrandText(text);
    element.textContent = cleanText;

    renderStructuredSummary(summaryEl, rawObj, {
      action: extraContext.action || summaryEl?.dataset?.toolAction || "infokota",
      payload: extraContext.payload || {},
      status: normalizedStatus,
      elapsedMs,
      errorText: status === "error" ? cleanText : "",
      resultElement: element
    });
  }

  // Bersihkan otomatis nama @jerexd6677 / jerexd666 dari hasil API menjadi nama brand HAOMI
  function sanitizeBrandText(str) {
    return String(str ?? "")
      .replace(/@?jerexd\d*/gi, match => (match.startsWith("@") ? BRAND_CREATOR : BRAND_ORDER_PREFIX))
      .replace(/@?jere\d+/gi, match => (match.startsWith("@") ? BRAND_CREATOR : BRAND_ORDER_PREFIX))
      .replace(/jerexd/gi, BRAND_ORDER_PREFIX);
  }

  function sanitizeBrandData(input) {
    if (input === null || input === undefined) return input;
    if (typeof input === "string") {
      return sanitizeBrandText(input);
    }
    if (Array.isArray(input)) {
      return input.map(item => sanitizeBrandData(item));
    }
    if (typeof input === "object") {
      const cleaned = {};
      for (const [k, v] of Object.entries(input)) {
        if (/^(creator|author|owner)$/i.test(k) && typeof v === "string") {
          cleaned[k] = BRAND_CREATOR;
        } else if (/^orderid$/i.test(k) && typeof v === "string") {
          cleaned[k] = v.replace(/^[a-z0-9_]+(?=-)/i, BRAND_ORDER_PREFIX).replace(/jerexd\d*/gi, BRAND_ORDER_PREFIX);
        } else {
          cleaned[k] = sanitizeBrandData(v);
        }
      }
      return cleaned;
    }
    return input;
  }

  function stringifyResult(value) {
    const cleanVal = sanitizeBrandData(value);
    return typeof cleanVal === "string" ? cleanVal : JSON.stringify(cleanVal, null, 2);
  }

  async function runTool(config) {
    const { form, button, resultElement, statusBadge, timeBadge, summaryEl, action, payload, loadingText } = config;
    if (!form || form.dataset.busy === "true") return;

    if (summaryEl) summaryEl.dataset.toolAction = action;
    form.dataset.busy = "true";
    const labelSpan = $("span", button) || button;
    const originalText = labelSpan.textContent;
    button.disabled = true;
    labelSpan.textContent = loadingText;

    const startTime = performance.now();
    const isLongBuild = action === "web2apk";
    showToolResult(
      resultElement,
      statusBadge,
      timeBadge,
      summaryEl,
      isLongBuild
        ? "// Sedang merakit file APK Android kamu (proses ini biasanya memakan waktu 60–95 detik, mohon tunggu sebentar)..."
        : "// Sedang memproses permintaan kamu...",
      "PROSES",
      null,
      null,
      { action, payload }
    );

    let progressInterval = null;
    if (isLongBuild) {
      let sec = 0;
      progressInterval = window.setInterval(() => {
        sec += 1;
        labelSpan.textContent = `Membangun APK... (${sec} dtk)`;
      }, 1000);
    }

    try {
      const data = await apiRequest(action, payload);
      const elapsed = Math.round(performance.now() - startTime);
      const result = data.result ?? data.data ?? data;
      showToolResult(
        resultElement,
        statusBadge,
        timeBadge,
        summaryEl,
        stringifyResult(result),
        "success",
        elapsed,
        typeof result === "object" ? result : data,
        { action, payload }
      );
      toast("Berhasil diproses!");
    } catch (error) {
      const elapsed = Math.round(performance.now() - startTime);
      showToolResult(
        resultElement,
        statusBadge,
        timeBadge,
        summaryEl,
        `// Gagal diproses: ${error.message || "Terjadi kendala koneksi."}`,
        "error",
        elapsed,
        null,
        { action, payload }
      );
      toast("Gagal diproses, cek tabel status hasil.", true);
    } finally {
      if (progressInterval) window.clearInterval(progressInterval);
      form.dataset.busy = "false";
      button.disabled = false;
      labelSpan.textContent = originalText;
    }
  }

  function syncWaEmojiChips() {
    const input = $("#whatsappReaction");
    if (!input) return;
    const currentList = input.value
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);

    $$(".emoji-chip[data-emoji]").forEach(chip => {
      chip.classList.toggle("active", currentList.includes(chip.dataset.emoji));
    });
  }

  function toggleWaEmoji(emoji) {
    const input = $("#whatsappReaction");
    if (!input) return;
    const list = input.value
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);

    const idx = list.indexOf(emoji);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(emoji);
    }

    input.value = list.join(",");
    syncWaEmojiChips();
  }

  function cycleResponseStyle() {
    const current = settings.responseStyle || "standard";
    const nextIdx = (responseStyleOrder.indexOf(current) + 1) % responseStyleOrder.length;
    const nextStyle = responseStyleOrder[nextIdx];
    saveSettings({ responseStyle: nextStyle });
    toast(`Gaya bicara AI: ${responseStyleLabels[nextStyle]}`);
  }

  function toggleQuickTheme() {
    const currentResolved = getResolvedTheme(settings.theme);
    const nextTheme = currentResolved === "dark" ? "light" : "dark";
    saveSettings({ theme: nextTheme });
    toast(`Mode ${nextTheme === "dark" ? "Gelap" : "Terang"} diaktifkan`);
  }

  // Eksekusi pintasan perintah cepat (/model, /gaya, /kode, /ringkas, /reset, /tema, dll.)
  function executeSlashShortcut(cmd) {
    if (els.slashCmdMenu) els.slashCmdMenu.hidden = true;
    if (cmd === "/model" || cmd === "/models") {
      openModelDialog();
      return true;
    }
    if (cmd === "/copilot") {
      selectModel("microsoft/copilot");
      return true;
    }
    if (cmd === "/gemini") {
      selectModel("gemini-2.0-pro");
      return true;
    }
    if (cmd === "/gaya" || cmd === "/style") {
      cycleResponseStyle();
      return true;
    }
    if (cmd === "/kode") {
      if (els.input) {
        els.input.value = "Tolong cek dan rapikan kode berikut biar jalan mulus:\n\n";
        resizeInput();
        els.input.focus();
        toast("Format cek kode disiapkan");
      }
      return true;
    }
    if (cmd === "/ringkas") {
      if (els.input) {
        els.input.value = "Tolong rangkum poin paling penting dari teks berikut pakai bahasa yang santai:\n\n";
        resizeInput();
        els.input.focus();
        toast("Format rangkuman disiapkan");
      }
      return true;
    }
    if (cmd === "/reset") {
      resetCurrentSessionContext();
      return true;
    }
    if (cmd === "/tema" || cmd === "/theme") {
      toggleQuickTheme();
      return true;
    }
    if (cmd === "/am" || cmd === "/alight") {
      showView("alight");
      return true;
    }
    if (cmd === "/scan" || cmd === "/urlscan") {
      showView("urlscan");
      return true;
    }
    if (cmd === "/wa" || cmd === "/react") {
      showView("whatsapp");
      return true;
    }
    if (cmd === "/settings" || cmd === "/config") {
      openSettings();
      return true;
    }
    return false;
  }

  function handleTerminalFilter() {
    const q = (els.terminalInput?.value || "").trim().toLowerCase();
    $$("[data-filter-text]").forEach(card => {
      const hay = (card.dataset.filterText || "").toLowerCase();
      card.hidden = Boolean(q) && !hay.includes(q) && !q.startsWith("/");
    });
  }

  function handleTerminalExecute(rawVal) {
    const cmd = rawVal.trim();
    if (!cmd) return;
    if (els.terminalInput) els.terminalInput.value = "";
    handleTerminalFilter();
    if (executeSlashShortcut(cmd.toLowerCase())) return;
    sendMessage(cmd);
  }

  function bindEvents() {
    $("#openSidebar")?.addEventListener("click", toggleSidebar);
    $("#closeSidebar")?.addEventListener("click", closeMobileSidebar);
    els.overlay?.addEventListener("click", closeMobileSidebar);
    $("#newChatButton")?.addEventListener("click", newChat);
    els.historySearch?.addEventListener("input", renderHistory);

    // Ketuk Dynamic Island saat muncul untuk langsung menutup notifikasi
    els.dynamicIsland?.addEventListener("click", () => {
      if (islandTimer) window.clearTimeout(islandTimer);
      els.dynamicIsland.classList.remove("is-notifying", "is-error");
      els.dynamicIsland.setAttribute("aria-hidden", "true");
    });

    document.addEventListener("pointerdown", event => {
      if (event.target.closest("button, .interactive-stat, .prompt-card")) {
        playCyberTick(600, 0.03);
      }
    }, { passive: true });

    // 4 Kotak Dasbor Utama Interaktif
    els.boxActiveModel?.addEventListener("click", openModelDialog);
    els.boxAiStyle?.addEventListener("click", cycleResponseStyle);
    els.boxPingTest?.addEventListener("click", () => measureNetworkPing(true));
    els.boxSessionInfo?.addEventListener("click", () => {
      openSystemInfoModal();
    });

    // Tombol pintasan di bagian atas
    $("#toggleDashboardBtn")?.addEventListener("click", () => {
      if (!els.welcome) return;
      const hasMessages = Boolean(activeConversation()?.messages?.length);
      if (!hasMessages) {
        els.welcome.hidden = !els.welcome.hidden;
        toast(els.welcome.hidden ? "Mode Fokus aktif" : "Panel dasbor ditampilkan");
        return;
      }
      forceShowHud = !forceShowHud;
      els.welcome.hidden = !forceShowHud;
      if (forceShowHud) {
        els.chatScroll?.scrollTo({ top: 0, behavior: "smooth" });
      }
      toast(forceShowHud ? "Panel dasbor ditampilkan" : "Mode Fokus aktif");
    });

    $("#quickThemeToggle")?.addEventListener("click", toggleQuickTheme);
    $("#resetSessionButton")?.addEventListener("click", resetCurrentSessionContext);
    $("#popoverResetChat")?.addEventListener("click", resetCurrentSessionContext);
    $("#exportChatButton")?.addEventListener("click", exportCurrentChat);

    $$("[data-view]").forEach(button => {
      button.addEventListener("click", event => {
        event.preventDefault();
        showView(button.dataset.view);
      });
    });

    // Chip perintah cepat & menu slash command di keyboard composer
    $$(".cmd-chip[data-cmd]").forEach(chip => {
      chip.addEventListener("click", () => {
        executeSlashShortcut(chip.dataset.cmd);
      });
    });

    $$(".slash-cmd-item[data-slash]").forEach(item => {
      item.addEventListener("click", () => {
        if (els.input && item.dataset.slash !== "/kode" && item.dataset.slash !== "/ringkas") {
          els.input.value = "";
          resizeInput();
        }
        executeSlashShortcut(item.dataset.slash);
      });
    });

    els.terminalInput?.addEventListener("input", handleTerminalFilter);
    els.terminalInput?.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleTerminalExecute(els.terminalInput.value);
      }
    });

    els.chatForm?.addEventListener("submit", event => {
      event.preventDefault();
      if (!busy && els.input) sendMessage(els.input.value);
    });

    els.input?.addEventListener("input", () => {
      resizeInput();
      const val = (els.input.value || "").trim();
      if (els.slashCmdMenu) {
        if (val.startsWith("/") && !val.includes(" ")) {
          let anyVisible = false;
          $$(".slash-cmd-item", els.slashCmdMenu).forEach(item => {
            const cmd = item.dataset.slash || "";
            const match = cmd.startsWith(val.toLowerCase());
            item.hidden = !match;
            if (match) anyVisible = true;
          });
          els.slashCmdMenu.hidden = !anyVisible;
        } else {
          els.slashCmdMenu.hidden = true;
        }
      }
    });

    els.input?.addEventListener("keydown", event => {
      if (event.isComposing) return;
      if (settings.enterToSend) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          if (!busy) els.chatForm?.requestSubmit();
        }
      } else {
        if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          if (!busy) els.chatForm?.requestSubmit();
        }
      }
    });

    $$(".prompt-card[data-prompt]").forEach(button => {
      button.addEventListener("click", () => {
        showView("chat");
        if (els.input) {
          els.input.value = button.dataset.prompt || "";
          resizeInput();
          els.input.focus();
          toast("Ide obrolan siap dikirim");
        }
      });
    });

    els.welcomeModelBadge?.addEventListener("click", openModelDialog);
    els.welcomeStyleBadge?.addEventListener("click", openSettings);

    els.messages?.addEventListener("click", event => {
      const codeBtn = event.target.closest("[data-copy-code]");
      if (codeBtn) {
        copyText(codeBtn.dataset.copyCode);
      }
    });

    els.composerToolsBtn?.addEventListener("click", event => {
      event.stopPropagation();
      toggleComposerMenu();
    });

    document.addEventListener("click", event => {
      if (els.composerToolsMenu && !els.composerToolsMenu.hidden &&
          !els.composerToolsMenu.contains(event.target) &&
          !els.composerToolsBtn?.contains(event.target)) {
        closeComposerMenu();
      }
    });

    els.modelTrigger?.addEventListener("click", openModelDialog);
    els.closeModel?.addEventListener("click", closeModelDialog);
    els.modelSearch?.addEventListener("input", updateModelOptions);

    $$(".provider-filter").forEach(btn => {
      btn.addEventListener("click", () => {
        activeProviderFilter = btn.dataset.provider || "all";
        $$(".provider-filter").forEach(b => b.classList.toggle("active", b === btn));
        updateModelOptions();
      });
    });

    els.modelDialog?.addEventListener("click", event => {
      if (event.target === els.modelDialog) closeModelDialog();
    });

    $$(".model-option").forEach(button => {
      button.addEventListener("click", () => selectModel(button.dataset.model));
    });

    // Pengaturan
    $("#openSettings")?.addEventListener("click", openSettings);
    $("#openSettingsTop")?.addEventListener("click", openSettings);
    $("#openSettingsMobile")?.addEventListener("click", openSettings);
    $("#closeSettings")?.addEventListener("click", closeSettings);

    els.settings?.addEventListener("click", event => {
      if (event.target === els.settings) closeSettings();
    });

    $$("[data-stream-choice]").forEach(btn => {
      btn.addEventListener("click", () => {
        saveSettings({ streamSpeed: btn.dataset.streamChoice });
        toast("Kecepatan ketikan AI diperbarui");
      });
    });

    $$("[data-theme-choice]").forEach(btn => {
      btn.addEventListener("click", () => {
        saveSettings({ theme: btn.dataset.themeChoice });
        const actual = getResolvedTheme(btn.dataset.themeChoice);
        toast(`Mode ${actual === "light" ? "Terang" : "Gelap"} diaktifkan`);
      });
    });

    window.matchMedia?.("(prefers-color-scheme: light)")?.addEventListener?.("change", () => {
      if (settings.theme === "system") applySettingsToUI();
    });

    $$("[data-density-choice]").forEach(btn => {
      btn.addEventListener("click", () => {
        saveSettings({ density: btn.dataset.densityChoice });
        toast("Ukuran tampilan diperbarui");
      });
    });

    els.defaultModel?.addEventListener("change", () => {
      const nextModel = els.defaultModel.value;
      saveSettings({ defaultModel: nextModel });
      const active = activeConversation();
      if (active && !active.messages.length) {
        active.model = nextModel;
        saveState();
        syncModelIndicators(nextModel);
      }
      toast(`Model utama diatur ke ${modelName(nextModel)}`);
    });

    els.responseStyle?.addEventListener("change", () => {
      saveSettings({ responseStyle: els.responseStyle.value });
      toast(`Gaya bicara diatur ke ${responseStyleLabels[els.responseStyle.value]}`);
    });

    els.enterToSend?.addEventListener("change", () => {
      saveSettings({ enterToSend: els.enterToSend.checked });
      toast(els.enterToSend.checked
        ? "Tombol Enter aktif untuk kirim pesan"
        : "Gunakan Ctrl+Enter untuk kirim pesan");
    });

    els.saveHistory?.addEventListener("change", () => {
      const enabled = els.saveHistory.checked;
      saveSettings({ saveHistory: enabled });
      if (enabled) {
        saveState();
        toast("Riwayat obrolan disimpan di browser");
      } else {
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(TELEMETRY_KEY);
        } catch {}
        toast("Penyimpanan riwayat dimatikan");
      }
    });

    els.soundFx?.addEventListener("change", () => {
      soundEnabled = Boolean(els.soundFx.checked);
      try {
        localStorage.setItem(SOUND_KEY, soundEnabled ? "1" : "0");
      } catch {}
      saveSettings({ soundFx: soundEnabled });
      toast(soundEnabled ? "Suara sentuhan: Aktif" : "Suara sentuhan: Mati");
    });

    els.defaultWaEmoji?.addEventListener("change", () => {
      const val = els.defaultWaEmoji.value.trim() || defaultSettings.defaultWaEmoji;
      saveSettings({ defaultWaEmoji: val });
      const waInput = $("#whatsappReaction");
      if (waInput) {
        waInput.value = val;
        syncWaEmojiChips();
      }
      toast("Emoji bawaan Reaksi WA disimpan");
    });

    $("#exportAllDataBtn")?.addEventListener("click", exportAllBackup);

    const clearBtn = $("#clearAllHistory");
    clearBtn?.addEventListener("click", () => {
      if (busy) {
        toast("Tunggu jawaban selesai sebelum menghapus riwayat.");
        return;
      }

      if (!clearBtn.classList.contains("confirming")) {
        clearBtn.classList.add("confirming");
        clearBtn.textContent = "Ketuk sekali lagi buat hapus";
        clearTimeout(clearHistoryConfirmTimer);
        clearHistoryConfirmTimer = window.setTimeout(() => {
          clearBtn.classList.remove("confirming");
          clearBtn.textContent = "Hapus Semua Riwayat";
        }, 3500);
        return;
      }

      clearTimeout(clearHistoryConfirmTimer);
      clearBtn.classList.remove("confirming");
      clearBtn.textContent = "Hapus Semua Riwayat";

      const conversation = newConversation();
      state = {
        conversations: [conversation],
        activeId: conversation.id
      };
      telemetry = { totalRequests: 0, successCount: 0, totalLatencyMs: 0 };

      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TELEMETRY_KEY);
      } catch {}
      saveState();
      renderTelemetryStats();
      renderHistory();
      renderMessages(false);
      closeSettings();
      toast("Semua riwayat obrolan berhasil dihapus");
    });

    // Alight Motion
    $$(".mode-tab[data-am-mode]").forEach(tab => {
      tab.addEventListener("click", () => setAlightMode(tab.dataset.amMode));
    });

    $("#alightAction")?.addEventListener("change", updateAlightFields);

    $("#alightForm")?.addEventListener("submit", event => {
      event.preventDefault();
      const action = $("#alightAction").value;
      const payload = { email: $("#alightEmail").value.trim() };
      if (action === "am-verify") payload.link = $("#alightLink").value.trim();

      runTool({
        form: $("#alightForm"),
        button: $("#alightSubmit"),
        resultElement: $("#alightResult"),
        statusBadge: $("#alightStatusBadge"),
        timeBadge: $("#alightTimeBadge"),
        summaryEl: $("#alightSummary"),
        action,
        payload,
        loadingText: "Memproses..."
      });
    });

    // Scan URL
    $("#pasteUrlBtn")?.addEventListener("click", async () => {
      try {
        if (navigator.clipboard?.readText) {
          const text = (await navigator.clipboard.readText()).trim();
          if (text) {
            $("#scanUrl").value = text.startsWith("http") ? text : `https://${text}`;
            toast("Link berhasil ditempel");
            return;
          }
        }
        $("#scanUrl")?.focus();
        toast("Silakan tekan Ctrl+V di kolom link");
      } catch {
        $("#scanUrl")?.focus();
        toast("Silakan tekan Ctrl+V di kolom link");
      }
    });

    $("#urlscanForm")?.addEventListener("submit", event => {
      event.preventDefault();
      runTool({
        form: $("#urlscanForm"),
        button: $("#urlscanSubmit"),
        resultElement: $("#urlscanResult"),
        statusBadge: $("#urlscanStatusBadge"),
        timeBadge: $("#urlscanTimeBadge"),
        summaryEl: $("#urlscanSummary"),
        action: "urlscan",
        payload: { url: $("#scanUrl").value.trim() },
        loadingText: "Memeriksa..."
      });
    });

    // Reaksi WhatsApp & Custom Emoji (+)
    renderCustomWaEmojis();
    $("#waEmojiQuickBar")?.addEventListener("click", event => {
      const chip = event.target.closest(".emoji-chip[data-emoji]");
      if (chip) {
        toggleWaEmoji(chip.dataset.emoji);
      }
    });

    $("#addCustomEmojiBtn")?.addEventListener("click", () => {
      const adder = $("#customEmojiAdder");
      if (!adder) return;
      adder.hidden = !adder.hidden;
      if (!adder.hidden) {
        $("#customEmojiInput")?.focus();
      }
    });

    const handleAddCustomEmoji = () => {
      const inp = $("#customEmojiInput");
      if (!inp) return;
      const raw = inp.value.trim();
      if (!raw) {
        toast("Ketik atau tempel minimal satu emoji dulu ya.", true);
        return;
      }
      const newEmojis = raw
        .split(/[\s,]+/)
        .map(e => e.trim())
        .filter(Boolean);
      const existing = Array.isArray(settings.customWaEmojis) ? [...settings.customWaEmojis] : [];
      newEmojis.forEach(em => {
        if (!existing.includes(em)) existing.push(em);
      });
      saveSettings({ customWaEmojis: existing });
      renderCustomWaEmojis();
      newEmojis.forEach(em => toggleWaEmoji(em));
      inp.value = "";
      const adder = $("#customEmojiAdder");
      if (adder) adder.hidden = true;
      toast("Emoji baru berhasil ditambahkan!");
    };

    $("#saveCustomEmojiBtn")?.addEventListener("click", handleAddCustomEmoji);
    $("#customEmojiInput")?.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleAddCustomEmoji();
      }
    });

    // 5 Fitur Baru: Viu Premium, Info Kota, TmpFiles, Web2APK, Cek Banned WA
    $("#viupremForm")?.addEventListener("submit", event => {
      event.preventDefault();
      runTool({
        form: event.currentTarget,
        button: $("#viupremSubmit"),
        resultElement: $("#viupremResult"),
        statusBadge: $("#viupremStatusBadge"),
        timeBadge: $("#viupremTimeBadge"),
        summaryEl: $("#viupremSummary"),
        action: "viuprem",
        payload: { query: ($("#viupremQuery")?.value || "").trim() },
        loadingText: "Mengambil..."
      });
    });

    $$(".city-chip[data-kota]").forEach(chip => {
      chip.addEventListener("click", () => {
        const kotaInput = $("#infokotaInput");
        if (kotaInput) kotaInput.value = chip.dataset.kota || "Jombang";
        $$(".city-chip[data-kota]").forEach(c => c.classList.toggle("active", c === chip));
      });
    });

    $("#infokotaForm")?.addEventListener("submit", event => {
      event.preventDefault();
      runTool({
        form: event.currentTarget,
        button: $("#infokotaSubmit"),
        resultElement: $("#infokotaResult"),
        statusBadge: $("#infokotaStatusBadge"),
        timeBadge: $("#infokotaTimeBadge"),
        summaryEl: $("#infokotaSummary"),
        action: "infokota",
        payload: { kota: ($("#infokotaInput")?.value || "Jombang").trim() },
        loadingText: "Mencari..."
      });
    });

    $("#tmpfilesForm")?.addEventListener("submit", async event => {
      event.preventDefault();
      const form = event.currentTarget;
      const fileInput = $("#tmpfilesFile");
      const urlVal = ($("#tmpfilesUrl")?.value || "").trim();
      const file = fileInput?.files?.[0] || null;
      const payload = { url: urlVal, rawFile: file };

      if (file) {
        if (file.size > 4.5 * 1024 * 1024) {
          toast("Ukuran file maksimal 4.5 MB ya.", true);
          return;
        }
        try {
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ""));
            reader.onerror = () => reject(new Error("Gagal membaca file"));
            reader.readAsDataURL(file);
          });
          payload.file_base64 = base64;
          payload.file_name = file.name;
          payload.file_mime = file.type || "application/octet-stream";
        } catch {
          toast("File gagal dibaca.", true);
          return;
        }
      }

      runTool({
        form,
        button: $("#tmpfilesSubmit"),
        resultElement: $("#tmpfilesResult"),
        statusBadge: $("#tmpfilesStatusBadge"),
        timeBadge: $("#tmpfilesTimeBadge"),
        summaryEl: $("#tmpfilesSummary"),
        action: "tmpfiles",
        payload,
        loadingText: "Memproses..."
      });
    });

    $("#useCurrentWebBtn")?.addEventListener("click", () => {
      const urlInput = $("#web2apkUrl");
      if (urlInput) {
        urlInput.value = window.location.origin.startsWith("http")
          ? `${window.location.origin}/`
          : "https://hao-ai-kappa.vercel.app/";
        toast("Alamat web saat ini dimasukkan");
      }
    });

    const web2apkFileInput = $("#web2apkFile");
    const web2apkFileNameEl = $("#web2apkFileName");
    const web2apkPreviewEl = $("#web2apkIconPreview");
    const clearWeb2apkFileBtn = $("#clearWeb2apkFileBtn");

    web2apkFileInput?.addEventListener("change", () => {
      const file = web2apkFileInput.files?.[0];
      if (!file) {
        if (web2apkFileNameEl) web2apkFileNameEl.textContent = "Tidak ada file yang dipilih";
        if (web2apkPreviewEl) web2apkPreviewEl.hidden = true;
        if (clearWeb2apkFileBtn) clearWeb2apkFileBtn.hidden = true;
        return;
      }
      if (web2apkFileNameEl) web2apkFileNameEl.textContent = file.name;
      if (clearWeb2apkFileBtn) clearWeb2apkFileBtn.hidden = false;
      if (file.type.startsWith("image/") && web2apkPreviewEl) {
        const reader = new FileReader();
        reader.onload = () => {
          web2apkPreviewEl.src = String(reader.result || "");
          web2apkPreviewEl.hidden = false;
        };
        reader.readAsDataURL(file);
      }
    });

    clearWeb2apkFileBtn?.addEventListener("click", () => {
      if (web2apkFileInput) web2apkFileInput.value = "";
      if (web2apkFileNameEl) web2apkFileNameEl.textContent = "Tidak ada file yang dipilih";
      if (web2apkPreviewEl) web2apkPreviewEl.hidden = true;
      clearWeb2apkFileBtn.hidden = true;
    });

    $("#web2apkForm")?.addEventListener("submit", async event => {
      event.preventDefault();
      const form = event.currentTarget;
      const file = $("#web2apkFile")?.files?.[0] || null;
      const payload = {
        url: ($("#web2apkUrl")?.value || "").trim(),
        name: ($("#web2apkName")?.value || "Ai Haomi").trim(),
        rawFile: file
      };

      if (file && file.size <= 4.5 * 1024 * 1024) {
        try {
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ""));
            reader.onerror = () => reject(new Error("Gagal membaca ikon"));
            reader.readAsDataURL(file);
          });
          payload.file_base64 = base64;
          payload.file_name = file.name;
          payload.file_mime = file.type || "image/png";
        } catch {}
      }

      runTool({
        form,
        button: $("#web2apkSubmit"),
        resultElement: $("#web2apkResult"),
        statusBadge: $("#web2apkStatusBadge"),
        timeBadge: $("#web2apkTimeBadge"),
        summaryEl: $("#web2apkSummary"),
        action: "web2apk",
        payload,
        loadingText: "Membangun APK..."
      });
    });

    $("#checkbanForm")?.addEventListener("submit", event => {
      event.preventDefault();
      runTool({
        form: event.currentTarget,
        button: $("#checkbanSubmit"),
        resultElement: $("#checkbanResult"),
        statusBadge: $("#checkbanStatusBadge"),
        timeBadge: $("#checkbanTimeBadge"),
        summaryEl: $("#checkbanSummary"),
        action: "checkban",
        payload: { number: ($("#checkbanNumber")?.value || "").trim() },
        loadingText: "Memeriksa..."
      });
    });

    // Settings Modal New Controls (No native <select>)
    $("#openModelPickerFromSettings")?.addEventListener("click", () => {
      closeSettings();
      openModelDialog();
    });

    $("#setOverviewModelCard")?.addEventListener("click", () => {
      closeSettings();
      openModelDialog();
    });

    $("#userNicknameInput")?.addEventListener("input", event => {
      saveSettings({ userNickname: event.currentTarget.value });
    });

    $$("[data-nickname]").forEach(chip => {
      chip.addEventListener("click", () => {
        const nick = chip.dataset.nickname || "";
        const inp = $("#userNicknameInput");
        if (inp) inp.value = nick;
        saveSettings({ userNickname: nick });
        toast(`Sapaan diatur ke "${nick}"`);
      });
    });

    $$("[data-lang-choice]").forEach(btn => {
      btn.addEventListener("click", () => {
        const lang = btn.dataset.langChoice || "id";
        saveSettings({ aiLanguage: lang });
        toast("Bahasa utama AI diperbarui");
      });
    });

    $("#autoHideJsonToggle")?.addEventListener("change", event => {
      saveSettings({ autoHideJson: event.currentTarget.checked });
      toast(event.currentTarget.checked ? "Mode Tabel Rapi (JSON disembunyikan)" : "JSON Mentah ditampilkan");
    });

    $("#resetDefaultSettingsBtn")?.addEventListener("click", () => {
      settings = { ...defaultSettings };
      soundEnabled = Boolean(defaultSettings.soundFx);
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        localStorage.setItem(SOUND_KEY, soundEnabled ? "1" : "0");
      } catch {}
      applySettingsToUI();
      toast("Semua setelan dikembalikan ke awal");
    });

    $("#importBackupBtn")?.addEventListener("click", () => {
      $("#importBackupFile")?.click();
    });

    $("#importBackupFile")?.addEventListener("change", event => {
      const file = event.currentTarget.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result || "{}"));
          if (parsed.settings && typeof parsed.settings === "object") {
            saveSettings(parsed.settings);
          }
          if (Array.isArray(parsed.conversations) && parsed.conversations.length) {
            state.conversations = parsed.conversations;
            state.activeId = parsed.conversations[0].id;
            saveState();
            renderHistory();
            renderMessages(false);
          }
          toast("Cadangan data (.json) berhasil dimuat!");
        } catch {
          toast("File cadangan (.json) tidak valid.", true);
        }
      };
      reader.readAsText(file);
      event.currentTarget.value = "";
    });

    const tmpfilesFileInput = $("#tmpfilesFile");
    const tmpfilesFileNameEl = $("#tmpfilesFileName");
    const clearTmpfilesFileBtn = $("#clearTmpfilesFileBtn");

    tmpfilesFileInput?.addEventListener("change", () => {
      const file = tmpfilesFileInput.files?.[0];
      if (!file) {
        if (tmpfilesFileNameEl) tmpfilesFileNameEl.textContent = "Tidak ada file yang dipilih";
        if (clearTmpfilesFileBtn) clearTmpfilesFileBtn.hidden = true;
        return;
      }
      if (tmpfilesFileNameEl) tmpfilesFileNameEl.textContent = file.name;
      if (clearTmpfilesFileBtn) clearTmpfilesFileBtn.hidden = false;
    });

    clearTmpfilesFileBtn?.addEventListener("click", () => {
      if (tmpfilesFileInput) tmpfilesFileInput.value = "";
      if (tmpfilesFileNameEl) tmpfilesFileNameEl.textContent = "Tidak ada file yang dipilih";
      clearTmpfilesFileBtn.hidden = true;
    });

    $$("[data-style-choice]").forEach(btn => {
      btn.addEventListener("click", () => {
        const nextStyle = btn.dataset.styleChoice || "standard";
        saveSettings({ responseStyle: nextStyle });
        toast(`Gaya bicara AI: ${responseStyleLabels[nextStyle] || "Standar"}`);
      });
    });

    $$("[data-length-choice]").forEach(btn => {
      btn.addEventListener("click", () => {
        saveSettings({ responseLength: btn.dataset.lengthChoice || "auto" });
        toast("Panjang jawaban AI diperbarui");
      });
    });

    $("#interactiveChoicesToggle")?.addEventListener("change", event => {
      saveSettings({ interactiveChoices: event.currentTarget.checked });
      toast(event.currentTarget.checked ? "Kartu pilihan interaktif diaktifkan" : "Kartu pilihan interaktif dimatikan");
    });

    $("#customAiInstructionInput")?.addEventListener("input", event => {
      saveSettings({ customAiInstruction: event.currentTarget.value });
    });

    $("#clearCustomAiPromptBtn")?.addEventListener("click", () => {
      const inp = $("#customAiInstructionInput");
      if (inp) inp.value = "";
      saveSettings({ customAiInstruction: "" });
      toast("Instruksi manual dikosongkan");
    });

    $$(".preset-prompt-chip[data-preset]").forEach(chip => {
      chip.addEventListener("click", () => {
        const preset = chip.dataset.preset || "";
        const inp = $("#customAiInstructionInput");
        if (inp) inp.value = preset;
        saveSettings({ customAiInstruction: preset });
        toast("Preset instruksi AI diterapkan");
      });
    });

    $("#streamDelayRange")?.addEventListener("input", event => {
      const val = Number(event.currentTarget.value) || 18;
      const label = $("#streamDelayVal");
      if (label) label.textContent = String(val);
      saveSettings({ streamDelayMs: val });
    });

    $("#cmatrixToggle")?.addEventListener("change", event => {
      saveSettings({ cmatrixEnabled: event.currentTarget.checked });
      toast(event.currentTarget.checked ? "Efek CMatrix diaktifkan" : "Efek CMatrix dimatikan");
    });

    $$("[data-matrix-choice]").forEach(btn => {
      btn.addEventListener("click", () => {
        saveSettings({ cmatrixIntensity: btn.dataset.matrixChoice || "vivid", cmatrixEnabled: true });
        toast("Ketajaman CMatrix diperbarui");
      });
    });

    $$("[data-glass-choice]").forEach(btn => {
      btn.addEventListener("click", () => {
        saveSettings({ glassLevel: btn.dataset.glassChoice || "standard" });
        toast("Efek kaca transparan diperbarui");
      });
    });

    // System Monitor Modal Events
    $("#closeSystemInfoModal")?.addEventListener("click", closeSystemInfoModal);
    $("#systemInfoModal")?.addEventListener("click", event => {
      if (event.target === $("#systemInfoModal")) closeSystemInfoModal();
    });
    $("#sysModalPingCard")?.addEventListener("click", () => { measureNetworkPing(true); updateSystemInfoModalStats(); });
    $("#sysModalPingBtn")?.addEventListener("click", () => {
      measureNetworkPing(true);
      updateSystemInfoModalStats();
    });
    $("#sysModalNewChatBtn")?.addEventListener("click", () => {
      closeSystemInfoModal();
      newChat();
      els.input?.focus();
    });

    $("#whatsappReaction")?.addEventListener("input", syncWaEmojiChips);

    $("#resetWaEmojiBtn")?.addEventListener("click", () => {
      const waInput = $("#whatsappReaction");
      if (waInput) waInput.value = settings.defaultWaEmoji || defaultSettings.defaultWaEmoji;
      syncWaEmojiChips();
      toast("Emoji dikembalikan ke setelan awal");
    });

    $("#whatsappForm")?.addEventListener("submit", event => {
      event.preventDefault();
      runTool({
        form: $("#whatsappForm"),
        button: $("#whatsappSubmit"),
        resultElement: $("#whatsappResult"),
        statusBadge: $("#whatsappStatusBadge"),
        timeBadge: $("#whatsappTimeBadge"),
        summaryEl: $("#whatsappSummary"),
        action: "whatsapp-react",
        payload: {
          url: $("#whatsappUrl").value.trim(),
          reaction: $("#whatsappReaction").value.trim()
        },
        loadingText: "Mengirim..."
      });
    });

    $$("[data-copy-result]").forEach(button => {
      button.addEventListener("click", () => {
        const target = document.getElementById(button.dataset.copyResult);
        if (target) copyText(target.textContent);
      });
    });

    $$("[data-clear-result]").forEach(button => {
      button.addEventListener("click", () => {
        const targetId = button.dataset.clearResult;
        const target = document.getElementById(targetId);
        if (!target) return;
        target.classList.remove("is-error", "is-success");
        target.textContent = "// Hasil sudah dibersihkan, siap dipakai lagi.";
        target.hidden = true;

        const prefix = targetId.replace("Result", "");
        const badge = document.getElementById(`${prefix}StatusBadge`);
        const time = document.getElementById(`${prefix}TimeBadge`);
        const summary = document.getElementById(`${prefix}Summary`);
        if (badge) {
          badge.classList.remove("is-error", "is-success");
          badge.textContent = "SIAP";
        }
        if (time) time.hidden = true;
        if (summary) {
          renderStructuredSummary(summary, null, {
            action: summary.dataset.toolAction || "infokota",
            status: "ready",
            resultElement: target
          });
        }
        toast("Hasil dibersihkan & siap digunakan kembali");
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMobileSidebar();
        closeComposerMenu();
        if (els.slashCmdMenu) els.slashCmdMenu.hidden = true;
        if (els.modelDialog && !els.modelDialog.hidden) closeModelDialog();
        if (els.settings && !els.settings.hidden) closeSettings();
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        newChat();
      }

      if ((event.ctrlKey || event.metaKey) && event.key === ",") {
        event.preventDefault();
        if (els.settings?.hidden) openSettings();
        else closeSettings();
      }

      if (event.key === "/" && els.modelDialog && !els.modelDialog.hidden &&
          document.activeElement !== els.modelSearch) {
        event.preventDefault();
        els.modelSearch?.focus();
      } else if (event.key === "/" &&
                 (!els.modelDialog || els.modelDialog.hidden) &&
                 (!els.settings || els.settings.hidden) &&
                 !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
        event.preventDefault();
        els.input?.focus();
      }
    });
  }


  const consoleBootTime = Date.now();
  let currentFpsValue = 60;

  function renderCustomWaEmojis() {
    const bar = $("#waEmojiQuickBar");
    const addBtn = $("#addCustomEmojiBtn");
    if (!bar || !addBtn) return;

    $$(".emoji-chip.is-custom-emoji", bar).forEach(el => el.remove());

    const customList = Array.isArray(settings.customWaEmojis) ? settings.customWaEmojis : [];
    customList.forEach(emoji => {
      if (!emoji) return;
      const exists = $$(`.emoji-chip[data-emoji]`, bar).some(b => b.dataset.emoji === emoji);
      if (exists) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "emoji-chip is-custom-emoji";
      btn.dataset.emoji = emoji;
      btn.textContent = emoji;
      bar.insertBefore(btn, addBtn);
    });
    syncWaEmojiChips();
  }

  function formatUptime(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const hrs = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const secs = String(totalSec % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  }

  function updateSystemInfoModalStats() {
    const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Core` : "Multi-Core";
    const devMem = navigator.deviceMemory ? `${navigator.deviceMemory} GB RAM` : "RAM Optimal";
    const dashMain = $("#dashSysMain");
    const dashSub = $("#dashSessionSub");
    if (dashMain) {
      dashMain.textContent = `ONLINE · ${currentFpsValue} FPS`;
    }
    if (dashSub) {
      dashSub.textContent = `${cores} · ${devMem}`;
    }

    const modal = $("#systemInfoModal");
    if (!modal || modal.hidden) return;

    const upEl = $("#sysModalUptime");
    if (upEl) upEl.textContent = `AKTIF ${formatUptime(Date.now() - consoleBootTime)}`;

    const pingEl = $("#sysModalPing");
    const avgPing = lastMeasuredPing || (telemetry.totalRequests > 0
      ? Math.round(telemetry.totalLatencyMs / telemetry.totalRequests)
      : 12);
    if (pingEl) pingEl.textContent = `${avgPing} ms`;

    const netEl = $("#sysModalNetType");
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (netEl) {
      const dl = conn?.downlink ? `${Number(conn.downlink).toFixed(1)} Mbps` : "Stabil";
      netEl.textContent = conn?.effectiveType
        ? `Jaringan ${String(conn.effectiveType).toUpperCase()} · ${dl}`
        : "Jaringan Stabil · Ketuk tes";
    }

    const cpuRamEl = $("#sysModalCpuRam");
    if (cpuRamEl) cpuRamEl.textContent = `${cores} · ${devMem}`;

    const heapEl = $("#sysModalHeap");
    if (heapEl) {
      if (performance?.memory?.usedJSHeapSize) {
        const usedMb = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1);
        heapEl.textContent = `Memori web aktif: ${usedMb} MB`;
      } else {
        heapEl.textContent = `${$("#metricOS")?.textContent || "Sistem"} · ${$("#metricBrowser")?.textContent || "Browser"}`;
      }
    }

    const fpsTag = $("#sysModalFpsTag");
    if (fpsTag) fpsTag.textContent = `${currentFpsValue} FPS`;

    const fpsEl = $("#sysModalFps");
    if (fpsEl) fpsEl.textContent = `${window.innerWidth}×${window.innerHeight} px`;

    const scrEl = $("#sysModalScreen");
    const cleanRatio = Number((window.devicePixelRatio || 1).toFixed(1));
    if (scrEl) scrEl.textContent = `Skala ${cleanRatio}x · Baterai ${$("#metricBattery")?.textContent || "Siap"}`;

    const modEl = $("#sysModalModel");
    const activeMod = activeConversation()?.model || getDefaultModel();
    if (modEl) modEl.textContent = modelName(activeMod);

    const reqEl = $("#sysModalRequests");
    if (reqEl) reqEl.textContent = `${telemetry.totalRequests} Request`;

    const sucEl = $("#sysModalSuccess");
    const rate = telemetry.totalRequests > 0
      ? Math.max(85, Math.round((telemetry.successCount / telemetry.totalRequests) * 100))
      : 100;
    if (sucEl) sucEl.textContent = `${rate}% Stabil`;
  }

  function openSystemInfoModal() {
    const modal = $("#systemInfoModal");
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    updateSystemInfoModalStats();
  }

  function closeSystemInfoModal() {
    const modal = $("#systemInfoModal");
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  function initCMatrixRain() {
    const canvas = $("#cmatrixCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "01HAOMIXMLｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ<>/*+=-0123456789";
    const fontSize = 15;
    let columns = 0;
    let drops = [];

    const resizeMatrix = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.ceil(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -40));
    };

    resizeMatrix();
    window.addEventListener("resize", resizeMatrix);

    let lastMatrixTick = 0;
    function drawMatrix(now) {
      requestAnimationFrame(drawMatrix);
      if (settings.cmatrixEnabled === false) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      if (now - lastMatrixTick < 42) return;
      lastMatrixTick = now;

      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      ctx.fillStyle = isLight ? "rgba(242, 247, 244, 0.14)" : "rgba(6, 9, 8, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (y > 0) {
          // Head character bright mint
          ctx.fillStyle = isLight ? "#047857" : "#6ee7b7";
          ctx.fillText(char, x, y);

          // Trail character emerald
          if (drops[i] > 1) {
            const prevChar = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillStyle = isLight ? "rgba(5, 150, 105, 0.65)" : "rgba(16, 185, 129, 0.85)";
            ctx.fillText(prevChar, x, (drops[i] - 1) * fontSize);
          }
        }

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    requestAnimationFrame(drawMatrix);
  }

  function initialize() {
    applySettingsToUI();
    initDeviceMetrics();
    initCMatrixRain();
    initSpotlightEffect();
    updateSystemInfoModalStats();
    window.setInterval(updateSystemInfoModalStats, 1500);
    renderTelemetryStats();
    measureNetworkPing(false);

    if (!state.conversations.length) {
      const conversation = newConversation();
      state.conversations.push(conversation);
      state.activeId = conversation.id;
    }

    if (!state.conversations.some(item => item.id === state.activeId)) {
      state.activeId = state.conversations[0].id;
    }

    const waInput = $("#whatsappReaction");
    if (waInput && settings.defaultWaEmoji) {
      waInput.value = settings.defaultWaEmoji;
    }

    const conversation = activeConversation();
    syncModelIndicators(conversation?.model || getDefaultModel());

    bindEvents();
    initAllToolReadyTables();
    updateAlightFields();
    syncWaEmojiChips();
    renderHistory();
    renderMessages(false);
    updateModelOptions();
    saveState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();

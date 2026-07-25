import Groq, { toFile } from 'groq-sdk';
import { env } from '../config/env.js';
import { AppError } from '../utils/apiResponse.js';

/** UI language → reply language name + Seamless/Whisper codes */
export const AI_LANGUAGES = {
  en: { label: 'English', replyAs: 'English', seamless: 'eng', whisper: 'en', speech: 'en-US' },
  fr: { label: 'Français', replyAs: 'French', seamless: 'fra', whisper: 'fr', speech: 'fr-FR' },
  zh: { label: '中文', replyAs: 'Mandarin Chinese', seamless: 'cmn', whisper: 'zh', speech: 'zh-CN' },
  am: { label: 'አማርኛ', replyAs: 'Amharic', seamless: 'amh', whisper: null, speech: 'am-ET' },
  om: { label: 'Afaan Oromo', replyAs: 'Afaan Oromo', seamless: 'gaz', whisper: null, speech: 'om-ET' },
  ti: { label: 'ትግርኛ', replyAs: 'Tigrinya', seamless: null, whisper: null, speech: 'ti-ET' },
};

const ADWA_SYSTEM_PROMPT = `You are Adwa Guide, the official AI concierge of Adwa Nexus and the Adwa Victory Memorial Museum in Ethiopia.

Your role:
- Answer questions about the Battle of Adwa (1896), Ethiopian heritage, museum galleries, artifacts, visit planning, and cultural context.
- Be warm, precise, and professional — like a senior museum educator.
- Prefer concise answers (2–5 short paragraphs) unless the visitor asks for depth.
- If unsure, say what is known historically and avoid inventing exhibit inventory.
- Never discuss unrelated politics or modern partisan topics; stay on heritage, history, and the visitor experience.

Known seed exhibits (when relevant):
- Warrior Shield — 19th century weapons, Main Hall
- Royal Crown Replica — royalty symbolism
- Ge'ez Manuscript — manuscripts / literacy tradition
- Battle Standard — symbols of resistance

Always reply in the visitor's selected language: {{LANGUAGE}}.
If the visitor writes in another script, still answer in {{LANGUAGE}}.`;

function hasGeminiKey() {
  return Boolean(env.GEMINI_API_KEY?.trim());
}

/** Real Groq keys look like gsk_… — ignore misplaced Gemini keys */
function hasGroqKey() {
  const key = env.GROQ_API_KEY?.trim() || '';
  return key.startsWith('gsk_');
}

function getGroq() {
  if (!hasGroqKey()) return null;
  return new Groq({ apiKey: env.GROQ_API_KEY.trim() });
}

export function resolveLanguage(code = 'en') {
  return AI_LANGUAGES[code] || AI_LANGUAGES.en;
}

function buildChatMessages(message, language, history) {
  const lang = resolveLanguage(language);
  return {
    lang,
    system: ADWA_SYSTEM_PROMPT.replaceAll('{{LANGUAGE}}', lang.replyAs),
    history: history.slice(-12).map((item) => ({
      role: item.role === 'assistant' ? 'assistant' : 'user',
      content: String(item.content || '').slice(0, 4000),
    })),
    userMessage: String(message).slice(0, 4000),
  };
}

async function chatWithGroq({ system, history, userMessage }) {
  const groq = getGroq();
  if (!groq) return null;

  const completion = await groq.chat.completions.create({
    model: env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: system },
      ...history,
      { role: 'user', content: userMessage },
    ],
    temperature: 0.5,
    max_tokens: 900,
  });

  const reply = completion.choices?.[0]?.message?.content?.trim();
  if (!reply) return null;
  return { reply, model: completion.model, provider: 'groq' };
}

async function chatWithGemini({ system, history, userMessage }) {
  if (!hasGeminiKey()) return null;

  const model = env.GEMINI_MODEL || 'gemini-2.0-flash';
  const key = env.GEMINI_API_KEY.trim();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const contents = [
    ...history.map((item) => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content }],
    })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 900,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new AppError(
      `Gemini error: ${response.status} ${errText.slice(0, 200)}`,
      502,
      'GEMINI_ERROR',
    );
  }

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('').trim();
  if (!reply) {
    throw new AppError('Empty AI response from Gemini', 502, 'AI_EMPTY_RESPONSE');
  }

  return { reply, model, provider: 'gemini' };
}

export async function chatAboutAdwa({ message, language = 'en', history = [] }) {
  const { lang, system, history: chatHistory, userMessage } = buildChatMessages(
    message,
    language,
    history,
  );

  if (!hasGroqKey() && !hasGeminiKey()) {
    throw new AppError(
      'No AI key configured. Set GEMINI_API_KEY in backend/.env (from https://aistudio.google.com/apikey), then restart the backend.',
      503,
      'AI_NOT_CONFIGURED',
    );
  }

  let result = null;
  const errors = [];

  // Prefer Groq when a real gsk_ key is present
  if (hasGroqKey()) {
    try {
      result = await chatWithGroq({ system, history: chatHistory, userMessage });
    } catch (error) {
      errors.push(`Groq: ${error.message}`);
      console.error('Groq chat failed, trying Gemini…', error.message);
    }
  }

  if (!result && hasGeminiKey()) {
    try {
      result = await chatWithGemini({ system, history: chatHistory, userMessage });
    } catch (error) {
      errors.push(`Gemini: ${error.message}`);
      console.error('Gemini chat failed:', error.message);
    }
  }

  if (!result) {
    throw new AppError(
      errors.length
        ? `AI failed. ${errors.join(' | ')}`
        : 'AI unavailable. Set GROQ_API_KEY (gsk_...) or GEMINI_API_KEY in backend/.env and restart backend.',
      503,
      'AI_UNAVAILABLE',
    );
  }

  return {
    reply: result.reply,
    language,
    languageLabel: lang.label,
    model: result.model,
    provider: result.provider,
  };
}

/**
 * Transcribe voice:
 * - en / fr / zh → Groq Whisper
 * - am / om → Facebook SeamlessM4T via Hugging Face Inference
 * - ti → best-effort Whisper, then note limited ASR support
 */
export async function transcribeAudio({ buffer, mimeType, language = 'en', filename = 'audio.webm' }) {
  const lang = resolveLanguage(language);

  if (lang.seamless && (language === 'am' || language === 'om')) {
    const text = await transcribeWithSeamless(buffer, lang.seamless, mimeType, filename);
    if (text) return { text, provider: 'facebook/seamless-m4t-v2-large', language };
  }

  if (env.GROQ_API_KEY) {
    try {
      const text = await transcribeWithGroqWhisper(buffer, filename, lang.whisper);
      if (text) return { text, provider: 'groq-whisper', language };
    } catch (error) {
      console.error('Groq whisper failed:', error.message);
    }
  }

  throw new AppError(
    'Could not transcribe audio. For voice: set HF_TOKEN (Amharic/Oromo) or fix GROQ_API_KEY. Text chat works with GEMINI_API_KEY alone.',
    503,
    'TRANSCRIBE_UNAVAILABLE',
  );
}

async function transcribeWithGroqWhisper(buffer, filename, languageCode) {
  const groq = getGroq();
  if (!groq) return null;
  const file = await toFile(buffer, filename || 'voice.webm');

  const result = await groq.audio.transcriptions.create({
    file,
    model: 'whisper-large-v3',
    ...(languageCode ? { language: languageCode } : {}),
    response_format: 'json',
  });

  return (result.text || '').trim();
}

async function transcribeWithSeamless(buffer, srcLang, mimeType, filename) {
  if (!env.HF_TOKEN) {
    return null;
  }

  // Hugging Face Inference — facebook/seamless-m4t-v2-large ASR / S2TT
  const endpoint =
    env.HF_SEAMLESS_URL ||
    'https://router.huggingface.co/hf-inference/models/facebook/seamless-m4t-v2-large';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.HF_TOKEN}`,
      'Content-Type': mimeType || 'audio/webm',
      'x-wait-for-model': 'true',
    },
    body: buffer,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    console.error('SeamlessM4T ASR failed:', response.status, errText.slice(0, 300));
    return null;
  }

  const data = await response.json().catch(() => null);
  if (!data) return null;

  // HF responses vary by provider shape
  if (typeof data === 'string') return data.trim();
  if (data.text) return String(data.text).trim();
  if (data.generated_text) return String(data.generated_text).trim();
  if (Array.isArray(data) && data[0]?.generated_text) {
    return String(data[0].generated_text).trim();
  }

  // Some ASR payloads include language hint; pass srcLang for logging
  console.info('Seamless ASR raw payload keys:', Object.keys(data), 'srcLang=', srcLang, filename);
  return null;
}

export async function voiceAsk({ buffer, mimeType, language = 'en', history = [], filename }) {
  const transcription = await transcribeAudio({ buffer, mimeType, language, filename });
  const chat = await chatAboutAdwa({
    message: transcription.text,
    language,
    history,
  });

  return {
    transcript: transcription.text,
    transcriptProvider: transcription.provider,
    ...chat,
  };
}

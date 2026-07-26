import { useEffect, useMemo, useRef, useState } from 'react';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
import { aiService, AI_LANGUAGE_OPTIONS } from '../../services/ai.service';
import './AiGuideCard.css';

const SPEECH_LANG = {
  en: 'en-US',
  fr: 'fr-FR',
  zh: 'zh-CN',
  am: 'am-ET',
  om: 'om-ET',
  ti: 'ti-ET',
};

function speak(text, language) {
  if (!('speechSynthesis' in window) || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LANG[language] || 'en-US';
  utterance.rate = 0.96;
  window.speechSynthesis.speak(utterance);
}

export default function AiGuideCard() {
<<<<<<< HEAD
  const { t } = useTranslation();
=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
<<<<<<< HEAD
      content: t('aiGuide.welcomeMsg'),
=======
      content:
        'Welcome. I am Adwa Guide — ask me about the museum, the Battle of Adwa, artifacts, or planning your visit.',
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
    },
  ]);

  const listRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const history = useMemo(
    () => messages.map(({ role, content }) => ({ role, content })),
    [messages],
  );

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open, busy]);

  const sendText = async (raw) => {
    const message = (raw ?? input).trim();
    if (!message || busy) return;

    setError('');
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setBusy(true);

    try {
      const result = await aiService.chat({
        message,
        language,
        history,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: result.reply }]);
      speak(result.reply, language);
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'The guide is unavailable. Set GEMINI_API_KEY in backend/.env and restart the backend.';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const startListening = async () => {
    if (busy || listening) return;
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setListening(false);
        setBusy(true);

        try {
          const result = await aiService.voice({
            blob,
            language,
            history,
          });
          setMessages((prev) => [
            ...prev,
            { role: 'user', content: result.transcript },
            { role: 'assistant', content: result.reply },
          ]);
          speak(result.reply, language);
        } catch (err) {
          const msg =
            err?.response?.data?.error?.message ||
            'Voice processing failed. Check Groq / Hugging Face keys.';
          setError(msg);
        } finally {
          setBusy(false);
        }
      };

      recorder.start();
      setListening(true);
    } catch {
      setError('Microphone access is required for voice conversation.');
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className={`ai-guide ${open ? 'ai-guide--open' : ''}`}>
      {open && (
        <section className="ai-guide__panel" aria-label="Adwa Guide conversation">
          <header className="ai-guide__header">
            <div className="ai-guide__identity">
              <span className="ai-guide__avatar" aria-hidden="true">
                <span className="ai-guide__avatar-ring" />
                AG
              </span>
              <div>
<<<<<<< HEAD
                <p className="ai-guide__eyebrow">{t('aiGuide.concierge')}</p>
                <h2 className="ai-guide__title">{t('aiGuide.title')}</h2>
=======
                <p className="ai-guide__eyebrow">Museum Concierge</p>
                <h2 className="ai-guide__title">Adwa Guide</h2>
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
              </div>
            </div>

            <label className="ai-guide__lang">
<<<<<<< HEAD
              <span className="ai-guide__lang-label">{t('aiGuide.language')}</span>
=======
              <span className="ai-guide__lang-label">Language</span>
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Guide language"
              >
                {AI_LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </header>

          <div className="ai-guide__messages" ref={listRef}>
            {messages.map((msg, index) => (
              <article
                key={`${msg.role}-${index}`}
                className={`ai-guide__bubble ai-guide__bubble--${msg.role}`}
              >
                {msg.content}
              </article>
            ))}
            {busy && (
              <p className="ai-guide__thinking" aria-live="polite">
<<<<<<< HEAD
                {t('aiGuide.thinking')}
=======
                Composing a reply…
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
              </p>
            )}
          </div>

          {error && (
            <p className="ai-guide__error" role="alert">
              {error}
            </p>
          )}

          <form
            className="ai-guide__composer"
            onSubmit={(e) => {
              e.preventDefault();
              sendText();
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
<<<<<<< HEAD
              placeholder={t('aiGuide.placeholder')}
=======
              placeholder="Ask about Adwa, artifacts, or your visit…"
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
              disabled={busy || listening}
              aria-label="Message Adwa Guide"
            />

            <button
              type="button"
              className={`ai-guide__mic ${listening ? 'ai-guide__mic--live' : ''}`}
              onClick={listening ? stopListening : startListening}
              disabled={busy}
              aria-pressed={listening}
              aria-label={listening ? 'Stop recording' : 'Start voice question'}
              title="Voice"
            >
              <MicIcon />
            </button>

            <button
              type="submit"
              className="ai-guide__send"
              disabled={busy || listening || !input.trim()}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="ai-guide__launcher"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="adwa-guide-panel"
      >
        <span className="ai-guide__launcher-glow" aria-hidden="true" />
        <span className="ai-guide__launcher-icon" aria-hidden="true">
          {open ? <CloseIcon /> : <GuideIcon />}
        </span>
        <span className="ai-guide__launcher-copy">
<<<<<<< HEAD
          <strong>{open ? t('aiGuide.closeGuide') : t('aiGuide.title')}</strong>
          <small>{open ? t('aiGuide.hideConv') : t('aiGuide.textAndVoice')}</small>
=======
          <strong>{open ? 'Close guide' : 'Adwa Guide'}</strong>
          <small>{open ? 'Hide conversation' : 'Text & voice · Multilingual'}</small>
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
        </span>
      </button>
    </div>
  );
}

function GuideIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8.5 14.5c1.2 1.2 5.8 1.2 7 0M9 10h.01M15 10h.01"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6 11a6 6 0 0012 0M12 17v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M4 12l15-7-4 16-4-6-7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

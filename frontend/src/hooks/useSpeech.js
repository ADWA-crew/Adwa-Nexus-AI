import { useCallback, useEffect, useRef, useState } from 'react';

export const speechSupported = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Narrates a block of text and reports which character the voice has
 * reached, so the UI can highlight words as they are spoken.
 */
export const useSpeech = (text, lang = 'en-US') => {
  const [status, setStatus]       = useState('idle'); /* idle | speaking | paused */
  const [charIndex, setCharIndex] = useState(-1);
  const [rate, setRate]           = useState(1);

  const textRef = useRef(text);
  const rateRef = useRef(rate);

  useEffect(() => { textRef.current = text; }, [text]);
  useEffect(() => { rateRef.current = rate; }, [rate]);

  const stop = useCallback(() => {
    if (!speechSupported()) return;
    window.speechSynthesis.cancel();
    setStatus('idle');
    setCharIndex(-1);
  }, []);

  /* A new exhibit or an unmount must never leave a voice running */
  useEffect(() => stop, [text, stop]);

  const play = useCallback(() => {
    if (!speechSupported() || !textRef.current) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textRef.current);
    utterance.lang = lang;
    utterance.rate = rateRef.current;

    utterance.onboundary = (event) => {
      if (typeof event.charIndex === 'number') setCharIndex(event.charIndex);
    };
    utterance.onend   = () => { setStatus('idle'); setCharIndex(-1); };
    utterance.onerror = () => { setStatus('idle'); setCharIndex(-1); };

    window.speechSynthesis.speak(utterance);
    setStatus('speaking');
    setCharIndex(0);
  }, [lang]);

  const pause = useCallback(() => {
    if (!speechSupported()) return;
    window.speechSynthesis.pause();
    setStatus('paused');
  }, []);

  const resume = useCallback(() => {
    if (!speechSupported()) return;
    window.speechSynthesis.resume();
    setStatus('speaking');
  }, []);

  const toggle = useCallback(() => {
    if (status === 'speaking') pause();
    else if (status === 'paused') resume();
    else play();
  }, [status, pause, resume, play]);

  /* Rate only takes effect on a fresh utterance, so restart if mid-sentence */
  const changeRate = useCallback((value) => {
    setRate(value);
    rateRef.current = value;
    if (status !== 'idle') play();
  }, [status, play]);

  const progress = textRef.current?.length
    ? Math.min(100, Math.max(0, (charIndex / textRef.current.length) * 100))
    : 0;

  return {
    supported: speechSupported(),
    status,
    charIndex,
    progress,
    rate,
    changeRate,
    play,
    pause,
    resume,
    toggle,
    stop,
  };
};

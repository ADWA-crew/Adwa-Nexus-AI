import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from './icons';
import './QrScanner.css';

/* Native detector — no extra dependency. Unsupported browsers
   (Safari, Firefox) are told to open the tour in Chrome or Edge. */
const detectorSupported = () =>
  typeof window !== 'undefined' && 'BarcodeDetector' in window;

/* Ignore the same code briefly so a rejected scan can be retried */
const REPEAT_DELAY = 2500;

export default function QrScanner({ notice, onScan, onClose }) {
  const videoRef  = useRef(null);
  const streamRef = useRef(null);
  const frameRef  = useRef(0);
  const onScanRef = useRef(onScan);
  const lastHit   = useRef({ value: '', at: 0 });

  const [status, setStatus]   = useState('starting');
  const [message, setMessage] = useState('');

  useEffect(() => { onScanRef.current = onScan; }, [onScan]);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* Camera + QR detection loop */
  useEffect(() => {
    let cancelled = false;

    const stopCamera = () => {
      cancelAnimationFrame(frameRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };

    const start = async () => {
      if (!detectorSupported()) {
        setStatus('unsupported');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        setStatus('scanning');

        const scanFrame = async () => {
          if (cancelled) return;

          try {
            const [code] = await detector.detect(videoRef.current);
            const value = code?.rawValue;
            const now = Date.now();

            if (
              value &&
              (value !== lastHit.current.value ||
                now - lastHit.current.at > REPEAT_DELAY)
            ) {
              lastHit.current = { value, at: now };
              onScanRef.current(value);
            }
          } catch {
            /* transient decode failure — keep scanning */
          }

          frameRef.current = requestAnimationFrame(scanFrame);
        };

        frameRef.current = requestAnimationFrame(scanFrame);
      } catch (error) {
        if (cancelled) return;
        setStatus('error');
        setMessage(
          error?.name === 'NotAllowedError'
            ? 'Camera permission was denied. Allow camera access and press Scan again.'
            : 'No camera is available on this device.'
        );
      }
    };

    start();
    return () => { cancelled = true; stopCamera(); };
  }, []);

  return (
    <div className="qr-overlay" onClick={onClose}>
      <div
        className="qr-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Scan exhibit QR code"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="qr-panel__head">
          <h2 className="qr-panel__title">Scan exhibit code</h2>
          <button
            type="button"
            className="qr-panel__close"
            onClick={onClose}
            aria-label="Close scanner"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="qr-stage">
          <video ref={videoRef} className="qr-stage__video" playsInline muted />

          {status === 'scanning' && (
            <div className="qr-stage__frame" aria-hidden="true">
              <span className="qr-stage__corner qr-stage__corner--tl" />
              <span className="qr-stage__corner qr-stage__corner--tr" />
              <span className="qr-stage__corner qr-stage__corner--bl" />
              <span className="qr-stage__corner qr-stage__corner--br" />
              <span className="qr-stage__beam" />
            </div>
          )}
        </div>

        <p
          className={`qr-panel__status${notice ? ' qr-panel__status--warn' : ''}`}
          role="status"
        >
          {notice || (
            <>
              {status === 'starting' && 'Waking up the camera…'}
              {status === 'scanning' && 'Hold the exhibit QR code inside the frame.'}
              {status === 'unsupported' &&
                'This browser cannot scan QR codes. Please open the tour in Chrome or Edge.'}
              {status === 'error' && message}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

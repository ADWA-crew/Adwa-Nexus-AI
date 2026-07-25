import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ScanLine, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageTransition } from '@/app/components/PageTransition'
import { Button } from '@/components/ui/button'
import { scanQrCode } from '@/services/api/artifact.api'

export default function QrScannerPage() {
  const navigate = useNavigate()
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [scanning, setScanning] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      void scannerRef.current?.stop().catch(() => {})
    }
  }, [])

  const startScanner = async () => {
    setError(null)
    setScanning(true)

    try {
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await scanner.stop()
          scannerRef.current = null
          setScanning(false)

          try {
            const artifact = await scanQrCode(decodedText)
            setSuccess(true)
            setTimeout(() => navigate(`/artifact/${artifact.id}`), 1500)
          } catch {
            setError('Artifact not recognized. Please try another code.')
          }
        },
        () => {},
      )
    } catch {
      setScanning(false)
      setError('Camera access denied or unavailable. Please enable camera permissions.')
    }
  }

  const stopScanner = async () => {
    await scannerRef.current?.stop().catch(() => {})
    scannerRef.current = null
    setScanning(false)
  }

  return (
    <PageTransition className="mx-auto max-w-lg px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="font-display text-4xl font-bold">Scan Artifact</h1>
        <p className="text-muted-foreground mt-2">
          Point your camera at a museum QR code to unlock the story
        </p>
      </header>

      <div className="relative rounded-2xl border border-border bg-card overflow-hidden">
        <div id="qr-reader" className="min-h-[300px]" />

        {!scanning && !success && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/90 p-8">
            <ScanLine className="size-16 text-primary mb-4" />
            <p className="text-muted-foreground text-center mb-6">
              Tap below to activate your camera scanner
            </p>
            <Button onClick={() => void startScanner()} size="lg">
              Start Scanning
            </Button>
          </div>
        )}

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-primary/10 backdrop-blur-sm"
            >
              <CheckCircle className="size-16 text-primary mb-4" />
              <p className="font-display text-xl font-semibold">Artifact Found!</p>
              <p className="text-muted-foreground mt-2">Redirecting...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {scanning && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={() => void stopScanner()}>
            <X className="size-4" />
            Stop Scanner
          </Button>
        </div>
      )}

      {error && (
        <p className="text-sm text-accent text-center mt-4" role="alert">
          {error}
        </p>
      )}
    </PageTransition>
  )
}

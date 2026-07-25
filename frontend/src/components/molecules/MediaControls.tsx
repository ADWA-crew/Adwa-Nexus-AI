import { motion } from 'framer-motion'
import { Pause, Play, Volume2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/utils/cn'

interface MediaControlsProps {
  src: string
  title?: string
  className?: string
}

export function MediaControls({ src, title, className }: MediaControlsProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      void audio.play()
    }
    setPlaying(!playing)
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    setProgress((audio.currentTime / audio.duration) * 100)
  }

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-xl border border-border bg-card p-4',
        className,
      )}
      role="group"
      aria-label={title ?? 'Audio player'}
    >
      <audio ref={audioRef} src={src} onTimeUpdate={handleTimeUpdate} onEnded={() => setPlaying(false)} />
      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={togglePlay}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </Button>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Volume2 className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium truncate">{title ?? 'Narration'}</span>
        </div>
        <Progress value={progress} />
      </div>
      <motion.div
        animate={{ scale: playing ? [1, 1.2, 1] : 1 }}
        transition={{ repeat: playing ? Infinity : 0, duration: 1 }}
        className="h-2 w-2 rounded-full bg-primary"
        aria-hidden="true"
      />
    </div>
  )
}

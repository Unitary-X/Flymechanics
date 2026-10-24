import { useEffect, useState } from 'react'
import { useMotion } from '~/components/motion/MotionProvider'
import { cabinAudio } from '~/lib/audio'
import type { MotionMode } from '~/config/motion'

const modes: { value: MotionMode; label: string }[] = [
  { value: 'full', label: 'Full' },
  { value: 'calm', label: 'Calm' },
  { value: 'off', label: 'Off' },
]

/** Motion controls (spec section 8 and 21.7). They live inside the menu so the first screen stays clean. */
export function ControlDock({ inMenu = false }: { inMenu?: boolean }) {
  const { paused, setPaused, mode, setMode, forcedOff, active } = useMotion()
  // Cabin audio is opt-in and is never remembered: browsers need a fresh tap before they allow sound.
  const [sound, setSound] = useState(false)
  // Sound follows motion: Pause, Off and reduced motion silence it; chapter changes ring the chime.
  useEffect(() => {
    if (!active && cabinAudio?.on) {
      cabinAudio.suspend()
      setSound(false)
    }
  }, [active])
  useEffect(() => {
    const onChapter = () => cabinAudio?.chapter()
    window.addEventListener('fm:chapter', onChapter)
    return () => window.removeEventListener('fm:chapter', onChapter)
  }, [])

  return (
    <div className={inMenu ? 'control-dock control-dock--menu' : 'control-dock'} role="region" aria-label="Motion controls">
      <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>
        {paused ? 'Resume' : 'Pause'}<span className="dock-long"> motion</span>
      </button>
      <span className="dock-sep" aria-hidden="true" />
      <div className="dock-group" role="radiogroup" aria-label="Motion intensity">
        {modes.map((m) => (
          <button
            key={m.value}
            type="button"
            role="radio"
            aria-checked={mode === m.value}
            onClick={() => setMode(m.value)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <span className="dock-sep" aria-hidden="true" />
      <button
        type="button"
        aria-pressed={sound}
        disabled={!active}
        onClick={async () => setSound(await cabinAudio.toggle())}
      >
        <span className="dock-long">Cabin </span>audio
      </button>
      {forcedOff && (
        <span className="sr-only" role="status">
          Motion is off because of {forcedOff}.
        </span>
      )}
    </div>
  )
}

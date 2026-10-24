import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { STORAGE_KEYS, type MotionMode, type Tier } from '~/config/motion'

interface MotionState {
  /** Visitor's chosen intensity. Off equals tier C. */
  mode: MotionMode
  setMode: (m: MotionMode) => void
  /** Pause motion stops every animation and is remembered. */
  paused: boolean
  setPaused: (p: boolean) => void
  tier: Tier
  /** True only while animation is allowed to run. */
  active: boolean
  /** Why motion is forced off (reduced motion, Save-Data, ?motion=off), if it is. */
  forcedOff: string | null
}

const MotionContext = createContext<MotionState | null>(null)

const read = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}
const write = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* storage can be blocked; the choice then lasts for this visit only */
  }
}

interface NetworkInformationLike {
  saveData?: boolean
}

export function MotionProvider({ children }: { children: ReactNode }) {
  // Server and first client render agree: full motion, tier A. Real values are read after mount.
  const [mode, setModeState] = useState<MotionMode>('full')
  const [paused, setPausedState] = useState(false)
  const [tier, setTier] = useState<Tier>('A')
  const [forcedOff, setForcedOff] = useState<string | null>(null)

  useEffect(() => {
    const storedMode = read(STORAGE_KEYS.mode)
    if (storedMode === 'full' || storedMode === 'calm' || storedMode === 'off') setModeState(storedMode)
    setPausedState(read(STORAGE_KEYS.paused) === '1')

    const params = new URLSearchParams(window.location.search)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection

    const evaluate = () => {
      if (params.get('motion') === 'off') return setForcedOff('?motion=off')
      if (reduced.matches) return setForcedOff('prefers-reduced-motion')
      if (conn?.saveData) return setForcedOff('Save-Data')
      setForcedOff(null)
    }
    evaluate()
    reduced.addEventListener('change', evaluate)

    // Coarse tier hint. A live frame-rate sample refines this in the video engine phase.
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    if ((memory !== undefined && memory <= 2) || navigator.hardwareConcurrency <= 4) setTier('B')

    return () => reduced.removeEventListener('change', evaluate)
  }, [])

  const setMode = useCallback((m: MotionMode) => {
    setModeState(m)
    write(STORAGE_KEYS.mode, m)
  }, [])
  const setPaused = useCallback((p: boolean) => {
    setPausedState(p)
    write(STORAGE_KEYS.paused, p ? '1' : '0')
  }, [])

  const effectiveTier: Tier = forcedOff || mode === 'off' ? 'C' : tier
  const active = !paused && effectiveTier !== 'C'

  useEffect(() => {
    const root = document.documentElement
    root.dataset.motion = active ? mode : 'off'
    root.dataset.tier = effectiveTier
    root.dataset.paused = paused ? 'true' : 'false'
  }, [active, mode, effectiveTier, paused])

  const value = useMemo<MotionState>(
    () => ({ mode, setMode, paused, setPaused, tier: effectiveTier, active, forcedOff }),
    [mode, setMode, paused, setPaused, effectiveTier, active, forcedOff],
  )

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

export function useMotion(): MotionState {
  const ctx = useContext(MotionContext)
  if (!ctx) throw new Error('useMotion must be used inside <MotionProvider>')
  return ctx
}

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { motionState } from '~/lib/scroll'
import { useMotion } from '~/components/motion/MotionProvider'
import { useAfterQuiet } from '~/lib/scroll'

interface P {
  x: number
  y: number
  z: number // depth 0.3..1: nearer moves faster and draws larger
  vx: number
  vy: number
  a: number
}

/**
 * Sparse dust and star particles on a fixed canvas (spec 21.3). They drift, streak in the direction of the scroll with
 * its speed, and settle when scrolling stops. White on dark chapters, gold on light ones. Fewer on phones.
 * Runs only at full motion on tier A, and stops when the tab is hidden, on Pause, and under reduced motion.
 */
export function ParticleField() {
  const { active: motionActive, tier, mode } = useMotion()
  const ready = useAfterQuiet(500) // extras wait for the first interaction or a quiet moment
  const active = motionActive && ready
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const enabled = active && tier === 'A' && mode === 'full'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!enabled || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const count = window.innerWidth < 820 ? 40 : 110
    const ps: P[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: 0.3 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 0.08,
      vy: -0.04 - Math.random() * 0.1,
      a: 0.18 + Math.random() * 0.4,
    }))

    let running = !document.hidden
    const onVis = () => {
      running = !document.hidden
    }
    document.addEventListener('visibilitychange', onVis)

    const tick = () => {
      if (!running) return
      ctx.clearRect(0, 0, w, h)
      const dark = document.documentElement.dataset.chapterTheme !== 'light'
      const v = motionState.velocity // -1..1, positive when scrolling down
      ctx.lineCap = 'round'
      for (const p of ps) {
        // Scrolling down streams particles upward past the viewer.
        p.x += p.vx * p.z
        p.y += (p.vy - v * 14) * p.z
        if (p.y < -20) p.y = h + 10
        if (p.y > h + 20) p.y = -10
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        const len = Math.abs(v) * 26 * p.z
        const size = 0.7 + p.z * 1.3
        ctx.strokeStyle = dark ? `rgba(255,255,255,${p.a * p.z})` : `rgba(226,150,40,${p.a * p.z * 0.9})`
        ctx.lineWidth = size
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x, p.y + (v > 0 ? len : -len) + 0.01)
        ctx.stroke()
      }
    }
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
      ctx.clearRect(0, 0, w, h)
    }
  }, [enabled])

  if (!enabled) return null
  return <canvas ref={canvasRef} className="fx-particles" aria-hidden="true" />
}

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useMotion } from '~/components/motion/MotionProvider'
import { useAfterQuiet } from '~/lib/scroll'

const INTERACTIVE = 'a, button, input, select, textarea, label, [role="button"], [role="radio"]'

/**
 * Pointer touches (spec 21.3), fine pointers and full motion only: a small cursor dot that follows with a little lag
 * and swells over links and controls, and a soft magnetic pull on the pill buttons. The real cursor stays visible.
 */
export function PointerFx() {
  const { active: motionActive, tier, mode } = useMotion()
  const ready = useAfterQuiet(0) // extras wait for the first interaction or a quiet moment
  const active = motionActive && ready
  const dotRef = useRef<HTMLDivElement>(null)
  const enabled = active && tier === 'A' && mode === 'full'

  useEffect(() => {
    const dot = dotRef.current
    if (!enabled || !dot) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const moveX = gsap.quickTo(dot, 'x', { duration: 0.28, ease: 'power3.out' })
    const moveY = gsap.quickTo(dot, 'y', { duration: 0.28, ease: 'power3.out' })
    const pulls = new Map<HTMLElement, true>()

    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      dot.style.opacity = '1'
      moveX(e.clientX)
      moveY(e.clientY)
      const over = (e.target as Element | null)?.closest(INTERACTIVE)
      gsap.to(dot, { scale: over ? 3 : 1, duration: 0.25, ease: 'power2.out', overwrite: 'auto' })

      // Magnetic pull on pills near the pointer. The fixed header pill keeps its own transform, so it is skipped.
      document.querySelectorAll<HTMLElement>('.pill:not(.fixed)').forEach((pill) => {
        const r = pill.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const near = Math.hypot(dx, dy) < Math.max(r.width, 90)
        if (near) {
          gsap.to(pill, { x: dx * 0.22, y: dy * 0.3, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
          pulls.set(pill, true)
        } else if (pulls.has(pill)) {
          gsap.to(pill, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' })
          pulls.delete(pill)
        }
      })
    }
    const onLeave = () => {
      dot.style.opacity = '0'
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      pulls.forEach((_, pill) => gsap.set(pill, { clearProps: 'x,y' }))
      gsap.set(dot, { clearProps: 'all' })
    }
  }, [enabled])

  if (!enabled) return null
  return <div ref={dotRef} className="fx-cursor" aria-hidden="true" />
}

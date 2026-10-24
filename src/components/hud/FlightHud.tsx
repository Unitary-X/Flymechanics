import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { chapters } from '~/config/chapters'
import { chapterStart, jumpTo, useAfterQuiet } from '~/lib/scroll'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Persistent flight HUD (spec 21.1 #8): a thin route line down the left edge with a small plane tied to the scroll
 * position and one dot per chapter, plus a "Chapter 03 / 09" count with the chapter name. It is decorative progress
 * with no flight data. Dots are real buttons: they jump to the chapter, show the name on hover, focus and when the
 * chapter changes, and expose it to assistive technology. Only the home page has chapters, so it hides elsewhere.
 */
export function FlightHud() {
  const afterLayout = useAfterQuiet(200)
  const [index, setIndex] = useState(0)
  const [present, setPresent] = useState(false)
  const [flash, setFlash] = useState(false)
  const starts = useRef<number[]>([])
  const planeRef = useRef<HTMLDivElement>(null)
  const last = useRef(0)
  const flashTimer = useRef(0)

  useEffect(() => {
    const compute = () => {
      const found = chapters.map((c) => chapterStart(c.id))
      setPresent(found.every((y) => y !== null))
      starts.current = found.map((y) => y ?? 0)
      update()
    }

    const update = () => {
      const s = starts.current
      if (s.length === 0) return
      const y = window.scrollY
      const probe = y + window.innerHeight * 0.35 // a chapter counts once it fills the upper part of the screen
      let i = 0
      for (let k = 0; k < s.length; k++) if (s[k] <= probe) i = k
      // Plane position: between this chapter's dot and the next, by how far we are through the chapter.
      const a = s[i]
      const b = s[i + 1] ?? document.documentElement.scrollHeight - window.innerHeight
      const t = b > a ? Math.min(1, Math.max(0, (y - a) / (b - a))) : 0
      const pos = ((i + t) / (s.length - 1)) * 100
      if (planeRef.current) planeRef.current.style.top = `${Math.min(100, pos)}%`
      if (i !== last.current) {
        last.current = i
        setIndex(i)
        document.documentElement.dataset.chapterTheme = chapters[i].theme
        window.dispatchEvent(new CustomEvent('fm:chapter', { detail: i }))
        setFlash(true)
        window.clearTimeout(flashTimer.current)
        flashTimer.current = window.setTimeout(() => setFlash(false), 1800)
      }
    }

    let raf = 0
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0
          update()
        })
    }
    compute()
    ScrollTrigger.addEventListener('refresh', compute)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', compute)
    const t = window.setTimeout(compute, 1200) // after the pins have settled
    return () => {
      ScrollTrigger.removeEventListener('refresh', compute)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', compute)
      window.clearTimeout(t)
      window.clearTimeout(flashTimer.current)
      cancelAnimationFrame(raf)
    }
  }, [])

  const jump = useCallback((i: number) => {
    const y = starts.current[i]
    if (y !== undefined) {
      history.replaceState(null, '', `#${chapters[i].id}`)
      jumpTo(y)
    }
  }, [])

  if (!present || !afterLayout) return null
  const current = chapters[index]

  return (
    <>
      <nav className="hud-rail hud-blend" aria-label="Chapters">
        <div className="hud-line" aria-hidden="true" />
        <div ref={planeRef} className="hud-plane" aria-hidden="true">
          <svg viewBox="0 0 12 12" width="12" height="12" focusable="false">
            <path d="M6 0 L11 11 L6 8.6 L1 11 Z" fill="currentColor" />
          </svg>
        </div>
        <ol className="hud-dots">
          {chapters.map((c, i) => (
            <li key={c.id} style={{ top: `${(i / (chapters.length - 1)) * 100}%` }}>
              <button
                type="button"
                className="hud-dot"
                aria-label={`Chapter ${c.n} of ${chapters.length}: ${c.name}`}
                aria-current={i === index ? 'step' : undefined}
                data-active={i === index}
                data-flash={flash && i === index}
                onClick={() => jump(i)}
              >
                <span aria-hidden="true" className="hud-dot-mark" />
                <span aria-hidden="true" className="hud-dot-label t-label">
                  {c.name}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <p className="hud-count hud-blend t-label" aria-hidden="true">
        <span>
          Chapter {pad(current.n)} / {pad(chapters.length)}
        </span>
        <span className="hud-count-name">{current.name}</span>
      </p>
    </>
  )
}

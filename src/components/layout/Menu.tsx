import { useEffect, useRef } from 'react'
import { menuChapters } from '~/config/chapters'
import { site } from '~/content/site.content'
import { ControlDock } from './ControlDock'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface MenuProps {
  open: boolean
  onClose: () => void
  /** The MENU button, so focus can return to it. */
  returnFocusTo: React.RefObject<HTMLElement | null>
}

/** Full-screen menu overlay: focus trap, Esc closes, focus returns (spec 5.3). */
export function Menu({ open, onClose, returnFocusTo }: MenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return

    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    window.dispatchEvent(new CustomEvent('fm:scrolllock', { detail: true }))
    const focusables = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
    focusables()[0]?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const returnTarget = returnFocusTo.current
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = previous
      window.dispatchEvent(new CustomEvent('fm:scrolllock', { detail: false }))
      returnTarget?.focus()
    }
  }, [open, onClose, returnFocusTo])

  const c = site.contact

  return (
    <div
      ref={panelRef}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      // inert keeps the closed menu out of the tab order and the accessibility tree.
      {...(!open ? { inert: true } : {})}
      className="fixed inset-0 z-[70] flex flex-col justify-between gap-6 overflow-y-auto"
      style={{
        background: 'var(--black)',
        color: '#fff',
        padding: 'calc(var(--hud-top) + 24px) var(--margin) calc(var(--margin) + 8px)',
        opacity: open ? 1 : 0,
        visibility: open ? 'visible' : 'hidden',
        // visibility interpolates as 'visible' while either end is visible, so it flips at the end of the duration when closing.
        transition: 'opacity var(--dur-3) var(--ease-enter), visibility var(--dur-3) linear',
      }}
    >
      <nav aria-label="Primary">
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {menuChapters.map((ch) => (
            <li key={ch.id}>
              <a
                href={`/#${ch.id}`}
                onClick={onClose}
                className="t-row block no-underline transition-colors duration-300 hover:text-[var(--gold)]"
                style={{ color: 'inherit' }}
              >
                {ch.inMenu}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="grid gap-6 md:grid-cols-[1fr_auto_auto] md:items-end" style={{ borderTop: '1px solid var(--line-dark)', paddingTop: 20 }}>
        <div className="grid gap-1 text-[14px]" style={{ color: 'var(--on-black-78)' }}>
          <a href={c.phoneHref} style={{ color: 'inherit' }}>
            {c.phoneDisplay}
          </a>
          <a href={`mailto:${c.email}`} style={{ color: 'inherit' }}>
            {c.email}
          </a>
          <a href={c.whatsapp} style={{ color: 'inherit' }}>
            {site.cta.whatsapp}
          </a>
          <p className="m-0 mt-2">
            {c.hours.join(' · ')} ({c.tz})
          </p>
        </div>
        <div className="grid gap-2">
          <p className="t-label m-0" style={{ color: 'var(--on-black-78)' }}>
            ( Motion and sound )
          </p>
          <ControlDock inMenu />
        </div>
        <a href="/#contact" onClick={onClose} className="pill pill--gold whitespace-nowrap">
          {site.cta.quote} →
        </a>
      </div>
    </div>
  )
}

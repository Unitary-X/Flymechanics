import type { ReactNode } from 'react'

/**
 * Owner-confirmation marker (brief C1). Every unconfirmed fact renders through this one component, so it looks the
 * same everywhere, stays visible, and is easy to find. The wording is never changed or filled in.
 * `npm run check:placeholders` lists the markers; a production build fails while any remain.
 */
export function OwnerConfirm({ children }: { children: ReactNode }) {
  return (
    <span
      data-owner-confirm
      style={{
        display: 'inline',
        padding: '1px 6px',
        border: '1px dashed var(--gold)',
        borderRadius: 4,
        background: 'rgba(242,181,68,0.14)',
        color: 'inherit',
        font: 'inherit',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
      }}
    >
      {children}
    </span>
  )
}

const MARKER =
  /(\[(?:CONFIRM|YEARS IN BUSINESS|NUMBER OF CLIENTS|CLIENT LOGOS|TESTIMONIALS|LEADERSHIP NAMES|ACCREDITATIONS)[^\]]*\])/

/** Renders a string, wrapping every owner-confirmation marker in it with <OwnerConfirm>. Wording is untouched. */
export function WithMarkers({ text }: { text: string }) {
  return (
    <>
      {text.split(MARKER).map((part, i) => (i % 2 === 1 ? <OwnerConfirm key={i}>{part}</OwnerConfirm> : part))}
    </>
  )
}

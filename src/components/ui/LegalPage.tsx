import type { ReactNode } from 'react'
import { WithMarkers } from './OwnerConfirm'

export interface LegalSection {
  heading: string
  /** Paragraphs. Any [CONFIRM ...] marker in them is shown as an owner-confirmation marker. */
  body: string[]
}

/**
 * Shared layout for the Privacy Policy and Terms pages. Both are drafts for lawyer review (spec 14): they say so on
 * the page, and everything not yet confirmed stays a visible marker.
 */
export function LegalPage({ title, sections, children }: { title: string; sections: LegalSection[]; children?: ReactNode }) {
  return (
    <div className="legal" data-theme="light">
      <div className="legal-inner">
        <p className="t-label m-0" style={{ color: 'var(--grey-60)' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            ← Flymechanics
          </a>
        </p>
        <h1 className="t-display m-0" style={{ fontSize: 'clamp(40px, 6vw, 96px)' }}>
          {title}
        </h1>
        <p className="legal-draft m-0" role="note">
          Draft for review by the company's lawyer. Not yet approved.
        </p>
        {children}
        {sections.map((s) => (
          <section key={s.heading} className="legal-section">
            <h2 className="m-0">{s.heading}</h2>
            {s.body.map((p) => (
              <p key={p} className="t-body m-0">
                <WithMarkers text={p} />
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

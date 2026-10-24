import { useEffect, useLayoutEffect, useRef, type CSSProperties } from 'react'

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

interface FitTextProps {
  /** Text without the trailing full stop. */
  text: string
  /** Gold full stop, rendered as its own element for the hero portal (phase 2). */
  dot?: boolean
  className?: string
  style?: CSSProperties
  /** A second copy of the wordmark used as the film knock-out layer: its own data attributes and a hidden dot,
   *  but the same size, so its letters line up with the animated copy. */
  knockout?: boolean
}

/**
 * Edge-to-edge wordmark. Measures the text at 100px and scales it to the container width,
 * so it never clips at any viewport (spec 5.2). Letters are separate spans for the hero reveal.
 */
export function FitText({ text, dot = true, className = '', style, knockout = false }: FitTextProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)

  useIsoLayoutEffect(() => {
    const box = boxRef.current
    const inner = innerRef.current
    if (!box || !inner) return

    const fit = () => {
      inner.style.fontSize = '100px'
      const measured = inner.getBoundingClientRect().width
      const available = box.clientWidth
      if (measured > 0 && available > 0) {
        // Floor to avoid sub-pixel overflow from rounding.
        inner.style.fontSize = `${Math.floor((100 * available) / measured * 100) / 100}px`
      }
    }

    // Measure only once the web fonts are in: measuring with the fallback font and then again later makes the
    // wordmark jump. Until then the CSS size below (a close match for the real font) is used.
    let ready = document.fonts ? document.fonts.status === 'loaded' : true
    if (ready) fit()
    const ro = new ResizeObserver(() => ready && fit())
    ro.observe(box)
    void document.fonts?.ready.then(() => {
      ready = true
      fit()
    })
    return () => ro.disconnect()
  }, [text, dot])

  return (
    <div ref={boxRef} {...(knockout ? { 'data-wordmark-ko': '' } : { 'data-wordmark': '' })} className={`w-full overflow-visible ${className}`} style={style}>
      <span
        ref={innerRef}
        className="t-display inline-block whitespace-nowrap"
        // Before measuring (server render, first paint) a safe width-based size avoids any clip.
        style={{ fontSize: 'calc((100vw - 2 * var(--margin)) * 0.1245)' }}
      >
        {Array.from(text).map((ch, i) => (
          <span key={i} {...(knockout ? { 'data-letter-ko': '' } : { 'data-letter': '' })} className="inline-block">
            {ch}
          </span>
        ))}
        {dot && (
          // A separate round element, so the hero portal can swell it into the sun (spec 21.1 #1).
          <span
            {...(knockout ? {} : { 'data-dot': '' })}
            aria-hidden="true"
            className="inline-block rounded-full"
            style={{
              width: '0.17em',
              height: '0.17em',
              marginLeft: '0.03em',
              background: 'var(--gold)',
              ...(knockout ? { visibility: 'hidden' as const } : {}),
            }}
          />
        )}
      </span>
    </div>
  )
}

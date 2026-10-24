import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { site } from '~/content/site.content'
import { SERVICE_OPTIONS, validateQuote, type QuoteErrors, type QuoteInput } from '~/lib/quote-validation'
import { submitQuote } from '~/server/quote'

const EMPTY: QuoteInput = {
  name: '',
  company: '',
  email: '',
  phone: '',
  service: '',
  travellers: '',
  message: '',
  consent: false,
  website: '',
}

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; message: string }

const TURNSTILE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void }
  }
}

/** Quote request form (spec section 13). Visible labels, inline text errors, aria-live status. */
export function QuoteForm() {
  const uid = useId()
  const [values, setValues] = useState<QuoteInput>(EMPTY)
  const [errors, setErrors] = useState<QuoteErrors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const turnstileRef = useRef<HTMLDivElement>(null)
  const turnstileId = useRef<string | undefined>(undefined)

  // Spam check widget, only when a site key is configured.
  useEffect(() => {
    if (!TURNSTILE_KEY || !turnstileRef.current) return
    const el = turnstileRef.current
    const render = () => {
      if (!window.turnstile || turnstileId.current) return
      turnstileId.current = window.turnstile.render(el, {
        sitekey: TURNSTILE_KEY,
        theme: 'dark',
        callback: (token: string) => setValues((v) => ({ ...v, turnstile: token })),
      })
    }
    if (window.turnstile) return render()
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    s.async = true
    s.onload = render
    document.head.appendChild(s)
  }, [])

  const set = <K extends keyof QuoteInput>(key: K, value: QuoteInput[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key as keyof QuoteErrors]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status.kind === 'sending') return
    const found = validateQuote(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      // Move focus to the first problem so keyboard and screen-reader users land on it.
      const first = Object.keys(found)[0]
      document.getElementById(`${uid}-${first}`)?.focus()
      return
    }
    setStatus({ kind: 'sending' })
    try {
      const res = await submitQuote({ data: values })
      if (res.ok) {
        setStatus({ kind: 'sent' })
        setValues(EMPTY)
        return
      }
      if (res.code === 'invalid') {
        setErrors(res.errors)
        setStatus({ kind: 'idle' })
        return
      }
      const messages = {
        rate: 'Too many requests from this connection. Please wait a few minutes, or call or email us directly.',
        captcha: 'We could not confirm you are human. Please try again.',
        not_configured: 'Sending is not available right now. Please call or email us directly.',
        failed: 'Something went wrong and your request was not sent. Please try again, or call or email us directly.',
      } as const
      setStatus({ kind: 'error', message: messages[res.code] })
      window.turnstile?.reset(turnstileId.current)
    } catch {
      setStatus({ kind: 'error', message: 'We could not reach the server. Please try again, or call or email us directly.' })
    }
  }

  const field = (key: keyof QuoteErrors, label: string, extra?: { required?: boolean }) => ({
    id: `${uid}-${key}`,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${uid}-${key}-err` : undefined,
    'aria-required': extra?.required || undefined,
    label,
  })

  const Err = ({ k }: { k: keyof QuoteErrors }) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className="qf-error" role="alert">
        {errors[k]}
      </p>
    ) : null

  if (status.kind === 'sent') {
    return (
      <div className="qf" role="status" aria-live="polite">
        <p className="t-row m-0" style={{ fontSize: 'clamp(28px, 3vw, 44px)' }}>
          Thank you.
        </p>
        <p className="t-body m-0" style={{ color: 'var(--on-black-78)' }}>
          We have received your request and will be in touch.
        </p>
        <button type="button" className="pill pill--outline" onClick={() => setStatus({ kind: 'idle' })}>
          Send another request
        </button>
      </div>
    )
  }

  return (
    <form className="qf" onSubmit={onSubmit} noValidate aria-label={site.cta.quote} id="quote-form">
      <div className="qf-row">
        <div className="qf-field">
          <label htmlFor={field('name', '').id}>Name</label>
          <input
            {...field('name', 'Name', { required: true })}
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
          />
          <Err k="name" />
        </div>
        <div className="qf-field">
          <label htmlFor={field('company', '').id}>Company</label>
          <input
            {...field('company', 'Company', { required: true })}
            type="text"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => set('company', e.target.value)}
          />
          <Err k="company" />
        </div>
      </div>

      <div className="qf-row">
        <div className="qf-field">
          <label htmlFor={field('email', '').id}>Work email</label>
          <input
            {...field('email', 'Work email', { required: true })}
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
          />
          <Err k="email" />
        </div>
        <div className="qf-field">
          <label htmlFor={field('phone', '').id}>Phone</label>
          <input
            {...field('phone', 'Phone')}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
          <Err k="phone" />
        </div>
      </div>

      <div className="qf-row">
        <div className="qf-field">
          <label htmlFor={field('service', '').id}>Service interest</label>
          <select
            {...field('service', 'Service interest', { required: true })}
            value={values.service}
            onChange={(e) => set('service', e.target.value)}
          >
            <option value="">Choose a service</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Err k="service" />
        </div>
        <div className="qf-field">
          <label htmlFor={field('travellers', '').id}>Travellers per month</label>
          <input
            {...field('travellers', 'Travellers per month')}
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={values.travellers}
            onChange={(e) => set('travellers', e.target.value)}
          />
          <Err k="travellers" />
        </div>
      </div>

      <div className="qf-field">
        <label htmlFor={field('message', '').id}>Message</label>
        <textarea
          {...field('message', 'Message')}
          rows={4}
          value={values.message}
          onChange={(e) => set('message', e.target.value)}
        />
        <Err k="message" />
      </div>

      {/* Honeypot: hidden from people and from assistive technology. Bots fill it, and are dropped on the server. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set('website', e.target.value)} />
        </label>
      </div>

      <div className="qf-field">
        <label className="qf-check">
          <input
            id={field('consent', '').id}
            type="checkbox"
            checked={values.consent}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${uid}-consent-err` : undefined}
            aria-required
            onChange={(e) => set('consent', e.target.checked)}
          />
          <span>I agree that Flymechanics may contact me about this enquiry.</span>
        </label>
        <Err k="consent" />
        <p className="m-0" style={{ fontSize: 13, color: 'var(--on-black-78)' }}>
          See the <a href="/privacy">Privacy Policy</a>.
        </p>
      </div>

      {TURNSTILE_KEY && <div ref={turnstileRef} />}

      <div className="qf-actions">
        <button type="submit" className="pill pill--gold" disabled={status.kind === 'sending'}>
          {status.kind === 'sending' ? 'Sending…' : `${site.cta.quote} →`}
        </button>
        <p className="m-0" role="status" aria-live="polite" style={{ fontSize: 14, color: status.kind === 'error' ? '#ffb4a8' : 'var(--on-black-78)' }}>
          {status.kind === 'error' ? status.message : ''}
        </p>
      </div>
    </form>
  )
}

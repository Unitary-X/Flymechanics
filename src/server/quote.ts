import { createServerFn } from '@tanstack/react-start'
import { getRequestIP } from '@tanstack/react-start/server'
import { validateQuote, type QuoteErrors, type QuoteInput } from '~/lib/quote-validation'

export type QuoteResult =
  | { ok: true }
  | { ok: false; code: 'invalid'; errors: QuoteErrors }
  | { ok: false; code: 'rate' | 'not_configured' | 'failed' | 'captcha' }

// Simple in-memory limit: 5 enquiries per IP per 10 minutes. This protects one server instance; several instances
// need a shared store (for example Redis).
const hits = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_HITS = 5

function limited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_HITS
}

const ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ENTITIES[c])

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // not configured: spam control then relies on the honeypot and the rate limit
  if (!token) return false
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  })
  const json = (await res.json()) as { success?: boolean }
  return json.success === true
}

async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  const key = process.env.EMAIL_PROVIDER_API_KEY
  const from = process.env.QUOTE_FROM_EMAIL
  if (!key || !from) throw new Error('email_not_configured')
  // Resend's REST API. The sending domain needs SPF and DKIM before real delivery can be trusted.
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html, reply_to: replyTo }),
  })
  if (!res.ok) throw new Error(`email_failed_${res.status}`)
}

async function storeEnquiry(record: Record<string, unknown>) {
  const url = process.env.ENQUIRY_STORE_URL
  if (!url) throw new Error('store_not_configured')
  const token = process.env.ENQUIRY_STORE_TOKEN
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(record),
  })
  if (!res.ok) throw new Error(`store_failed_${res.status}`)
}

/**
 * Quote form handler. It validates again on the server, drops bots (honeypot), rate-limits, then stores the
 * enquiry so none is lost, emails the team, and sends the sender an acknowledgement.
 * It never reports success unless delivery to the team or to storage really happened.
 */
export const submitQuote = createServerFn({ method: 'POST' })
  .validator((d: QuoteInput) => d)
  .handler(async ({ data }): Promise<QuoteResult> => {
    // Honeypot: bots fill the hidden field. Pretend it worked and do nothing.
    if (data.website && data.website.trim() !== '') return { ok: true }

    const errors = validateQuote(data)
    if (Object.keys(errors).length > 0) return { ok: false, code: 'invalid', errors }

    const ip = getRequestIP({ xForwardedFor: true }) ?? 'unknown'
    if (limited(ip)) return { ok: false, code: 'rate' }
    if (!(await verifyTurnstile(data.turnstile, ip))) return { ok: false, code: 'captcha' }

    const emailReady = Boolean(process.env.EMAIL_PROVIDER_API_KEY && process.env.QUOTE_FROM_EMAIL)
    const storeReady = Boolean(process.env.ENQUIRY_STORE_URL)
    if (!emailReady && !storeReady) return { ok: false, code: 'not_configured' }

    const record = {
      receivedAt: new Date().toISOString(),
      name: data.name.trim(),
      company: data.company.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      service: data.service,
      travellers: data.travellers.trim(),
      message: data.message.trim(),
      consent: data.consent,
    }

    let delivered = false
    if (storeReady) {
      try {
        await storeEnquiry(record)
        delivered = true
      } catch (err) {
        console.error('[quote] storage failed', err)
      }
    }
    if (emailReady) {
      try {
        const to = process.env.QUOTE_TO_EMAIL || 'info@flymechanics.com'
        const rows = Object.entries(record)
          .map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(String(v))}</td></tr>`)
          .join('')
        await sendEmail(to, `New quote request from ${record.company}`, `<table>${rows}</table>`, record.email)
        delivered = true
        // Acknowledgement to the sender. It promises no response time (none is confirmed).
        await sendEmail(
          record.email,
          'We have received your enquiry',
          `<p>Hello ${esc(record.name)},</p><p>Thank you for contacting Flymechanics. We have received your enquiry and will be in touch.</p><p>Flymechanics</p>`,
        ).catch((err) => console.error('[quote] acknowledgement failed', err))
      } catch (err) {
        console.error('[quote] email failed', err)
      }
    }
    return delivered ? { ok: true } : { ok: false, code: 'failed' }
  })

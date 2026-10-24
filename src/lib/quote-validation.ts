import { site } from '~/content/site.content'

export interface QuoteInput {
  name: string
  company: string
  email: string
  phone: string
  service: string
  travellers: string
  message: string
  consent: boolean
  /** Honeypot: real visitors never see or fill this. */
  website?: string
  /** Cloudflare Turnstile token, when a site key is configured. */
  turnstile?: string
}

export type QuoteErrors = Partial<
  Record<'name' | 'company' | 'email' | 'phone' | 'service' | 'travellers' | 'message' | 'consent', string>
>

export const SERVICE_OPTIONS: string[] = site.services.map((s) => s.title)

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Shared by the form (inline errors) and the server (never trust the browser). */
export function validateQuote(i: QuoteInput): QuoteErrors {
  const e: QuoteErrors = {}
  const name = i.name.trim()
  const company = i.company.trim()
  if (!name) e.name = 'Enter your name.'
  else if (name.length > 120) e.name = 'Use 120 characters or fewer.'
  if (!company) e.company = 'Enter your company.'
  else if (company.length > 160) e.company = 'Use 160 characters or fewer.'
  if (!i.email.trim()) e.email = 'Enter your work email.'
  else if (!EMAIL.test(i.email.trim()) || i.email.length > 200) e.email = 'Enter a valid email address, like name@company.com.'
  if (i.phone.trim() && !/^[+()\d\s-]{6,24}$/.test(i.phone.trim())) e.phone = 'Use digits, spaces, + and - only.'
  if (!SERVICE_OPTIONS.includes(i.service)) e.service = 'Choose a service.'
  if (i.travellers.trim()) {
    const n = Number(i.travellers)
    if (!Number.isInteger(n) || n < 1 || n > 100000) e.travellers = 'Enter a whole number, 1 or more.'
  }
  if (i.message.length > 4000) e.message = 'Use 4,000 characters or fewer.'
  if (!i.consent) e.consent = 'Please tick the box so we can contact you.'
  return e
}

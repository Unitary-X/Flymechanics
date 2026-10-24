# Flymechanics: launch checklist

Nothing has been deployed. This lists what is still needed, who supplies it, and the order to do it in.

## A. Content the owner must confirm (the build refuses to release until these are filled)

Run `npm run check:placeholders` for the live list (24 markers today).

| Item | Where it shows |
|---|---|
| Legal name and LLPIN | Footer, Privacy, Terms |
| Full office address (and one verified map pin if a map is wanted) | Contact, Privacy |
| Emergency line: number, hours, call charges | FAQ answer 4, Contact "After hours" |
| Licensed partners and scope for foreign exchange, mediclaim, visa, attestation | Service 06, Terms |
| Confirm the WhatsApp number is a WhatsApp number | Hero, menu, contact |
| Fee, response-time and onboarding FAQ answers (optional additions) | FAQ |
| Whether Cargo, Bus, Fleet are offered | Not shown until confirmed |
| Proof: years in business, client count and logos, testimonials, accreditations, leadership | Not shown until confirmed (nothing renders while empty) |
| Privacy Policy and Terms reviewed by a lawyer (retention, rights, grievance officer, liability, governing law) | /privacy, /terms |
| Wording approvals: caption order in the Navigator chapter, "(c)26" in the service meta line, the form's thank-you text and the acknowledgement email text | Navigator, Services, Form |

## B. Services and accounts to set up (the form cannot be called working until these exist)

1. **Email provider** (the code calls Resend's API): an API key and a sending address on a domain you own, with SPF and DKIM records added in DNS. Set `EMAIL_PROVIDER_API_KEY`, `QUOTE_FROM_EMAIL`, `QUOTE_TO_EMAIL` (defaults to info@flymechanics.com).
2. **Enquiry storage** so no enquiry is lost: a webhook URL that accepts a JSON POST (a Google Sheets or Airtable automation, or a database endpoint). Set `ENQUIRY_STORE_URL` and `ENQUIRY_STORE_TOKEN` if it needs one.
3. **Spam check** (optional but recommended): Cloudflare Turnstile keys, `VITE_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.
4. Put the values in the host's environment settings. Never commit them.
5. Send a real test enquiry. Confirm the team email arrives, the sender's acknowledgement arrives, and the enquiry is stored. Until you have seen all three, do not announce the form.

## C. Hosting and domain: Vercel (adapter done, deployment not done)

Done in the code: `nitro` is installed and `nitro()` is in `vite.config.ts`. A build with `NITRO_PRESET=vercel` produced `.vercel/output` (static files plus one server function) and a local preview served `/` and `/privacy` with 200. Vercel detects this setup by itself; no build command or output folder needs to be typed in.

Owner steps (in order):
1. Put the project in a Git repository on GitHub (the folder is not a Git repo today). `.env` files are already ignored; never commit secrets.
2. Create a Vercel account and choose the **Pro** plan: Vercel's Hobby plan does not allow commercial use, and this is a business site.
3. Import the repository, check the Framework Preset reads TanStack Start, Node.js version 24 or newer, then deploy once.
4. Environment Variables (Production): `EMAIL_PROVIDER_API_KEY`, `QUOTE_FROM_EMAIL`, `QUOTE_TO_EMAIL`, `ENQUIRY_STORE_URL`, `ENQUIRY_STORE_TOKEN` (if needed), `TURNSTILE_SECRET_KEY`, `VITE_TURNSTILE_SITE_KEY`. Redeploy after adding them.
5. Domain: add flymechanics.com in Project Settings, Domains, then add the DNS records Vercel shows. HTTPS is automatic.
6. Films: 56 files, 65 MB, ship inside the deployment and are served from Vercel's CDN. A separate video CDN is optional later.
7. Release build: fill LAUNCH_ANSWERS.md. Before the real launch, in Vercel Project Settings, Build and Deployment, set the Build Command to `npm run build:release`, so a production build fails while any `[CONFIRM ...]` marker remains. For test deployments before then, leave the default build command.
8. After launch: submit `sitemap.xml` in Search Console and add the Google Business Profile link.

## D. Testing still to do

- Real phones (one low-end Android, one iPhone) for smoothness of the scroll films.
- A screen-reader pass (NVDA or VoiceOver) and a keyboard-only pass.
- 200% browser zoom.
- Lighthouse on the live URL (the numbers so far are from a local build).

## E. Licences and records

- The film clips were made with AI video tools. Record the tool, date and licence terms for each clip before launch.
- Fonts (Inter, Plus Jakarta Sans) are SIL OFL; listed in the README.

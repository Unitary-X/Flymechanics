# Flymechanics

Corporate travel management site: a cinematic, scroll-driven page built on pre-made video clips.
Sources of truth: `FLYMECHANICS_BUILD_SPEC.md` (copy and behaviour), `FLYMECHANICS_SPEC_ADDENDUM_VIDEO.md` (video plan, wins where they differ),
`FLYMECHANICS_BUILD_NOTES.md` (running decisions and clip status).

## Run

```bash
npm install
npm run dev              # http://localhost:3000
npm run build            # normal build (placeholders only warn)
npm run build:release    # fails while any [CONFIRM ...] marker remains: use this for production
npm run typecheck
npm run check:placeholders
```

`?motion=off` turns the whole motion layer off. Pause motion, Full / Calm / Off and reduced motion are in the control bar.

## Before launch (owner actions)

1. Fill every `[CONFIRM ...]` item (legal name and LLPIN, address, emergency line, partners, WhatsApp check, privacy and terms review). `npm run check:placeholders` lists them.
2. Quote form delivery needs real services, set in the host's environment (see `.env.example`): an email provider key and a verified sending address (SPF and DKIM on the domain), somewhere to store enquiries (`ENQUIRY_STORE_URL`), and optionally Cloudflare Turnstile keys. Until then the form tells visitors it cannot send. Send a real test enquiry and confirm the email arrives and the enquiry is stored before announcing the site.
3. Host the film files on a video CDN (they are in `public/media` for now) and re-check sizes.
4. Approve the AI-generated clips' licence terms and record them below.
5. Deployment (for example Vercel) and the domain are not set up. Nothing has been deployed.

## Stack

TanStack Start (React, TypeScript), Tailwind CSS 4, GSAP + ScrollTrigger and Lenis. No three.js and no WebGL: every scene is a pre-made film clip scrubbed by scroll.

## Layout

```
src/content/site.content.ts   all copy, verbatim from the spec
src/config/chapters.ts        one source of truth for chapters, anchors and menu order
src/config/motion.ts          durations, easings, tiers
src/styles/                   tokens.css (design tokens) and app.css
src/components/layout/        Header, Menu, ControlDock
src/components/motion/        MotionProvider (pause, intensity, reduced motion), FitText
src/routes/                   __root.tsx, index.tsx
scripts/check-placeholders.mjs
```

## Third-party assets and licences

| Asset | Source | Licence |
|---|---|---|
| Inter (variable) | `@fontsource-variable/inter` | SIL Open Font License 1.1 |
| Plus Jakarta Sans (variable) | `@fontsource-variable/plus-jakarta-sans` | SIL Open Font License 1.1 |

Video clips are generated with AI video tools. Record the tool, date and licence terms for each before launch.

## Owner placeholders

Run `npm run check:placeholders` for the live list. See section 19 of the spec for who supplies each item.

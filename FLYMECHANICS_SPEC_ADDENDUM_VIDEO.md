# FLYMECHANICS: SPEC ADDENDUM (video-scroll plan)

Give this file to the AI builder together with `FLYMECHANICS_BUILD_SPEC.md`. **Where they differ, this addendum wins.** Everything not mentioned here (copy in section 6, rules in section 2, forms, legal, SEO, accessibility, the `[CONFIRM]` register, guardrails in 21.10) stays exactly as the spec says.

Also read `FLYMECHANICS_BUILD_NOTES.md` (running decisions) and `FLYMECHANICS_VIDEO_PROMPTS.md` (how the clips were made).

---

## A. What changes and why

The site is built on **pre-made scroll-scrubbed video clips**, not live 3D. Consequences:

| Spec item | Change |
|---|---|
| Section 3 stack | TanStack Start + React + TS + Tailwind + GSAP/ScrollTrigger + Lenis. **Drop three.js / R3F / drei / postprocessing.** Keep the 2D canvas globe (spec 9, item 1). Build fresh in this folder (see section H for the repo question) |
| Section 9 (3D globe) | Not built. Globe chapter = clips + the spec's 2D canvas globe (section D, chapter 05) |
| Section 10 (3D still-life) | Not built. Replaced by clip `still-life` |
| Section 21.6 tiers | A and B are the same video experience (B = lower bitrate, no particles, no skew). C = posters only, as in the spec |
| Section 11 media | Clips already exist (section B). Remaining AI prompts in section 11 are not needed except optional service stills |
| Section 7.7 galleries | One video per service in a window-shaped frame (3 to 4 stills per service are **[ASSET]**, optional later) |

## B. Clip manifest (files in `C:\Users\harik\Desktop\fly`; rename on import)

All clips: 24 fps, about 10 s, one smooth camera move, no audio, no watermark, no baked-in text (exceptions in section G).

| Publish name | Source file | Size | Chapter |
|---|---|---|---|
| `hero-film` | clip 1.mp4 | 1920x1080 | 01 Hero |
| `statement-window` | clip 2.mp4 (HD version) | 1920x1080 | 02 Statement |
| `still-life` | clip 3.mp4 | 1920x1080 | 03 We handle |
| `scramble-film` | clip4.mp4 | 1920x1080 | 04 Scramble |
| `nav-1` | clip5a.mp4 (the file named `clip5a.mp4`, first globe clip, over India) | 1920x1080 | 05 Navigator |
| `nav-2` | clip5b.mp4 | 1920x1080 | 05 Navigator |
| `nav-3` | clip 5c.mp4 | 1920x1080 | 05 Navigator |
| `s01` to `s06` | clip6a.mp4, clip6b_clean.mp4, clip6c.mp4, clip6d.mp4, clip 6e.mp4, clip 6f.mp4 | 1920x1080 (s02 is 1280x720) | 06 Services |
| `close-landing` | ckip 7.mp4 (the second Clip 7, with the solid runway; not `clip 7.mp4`) | 1920x1080 | 09 Close |

Note: the first globe clip was supplied as `clip5.mp4` (Downloads) and `clip5a.mp4` (fly folder). Use whichever is the India-centred first globe clip.

## C. Media pipeline

- **Encode for scrubbing:** H.264 with a keyframe on every frame so scroll can seek smoothly.
  `ffmpeg -i in.mp4 -vf scale=1280:-2 -c:v libx264 -g 1 -crf 24 -preset slow -pix_fmt yuv420p -an -movflags +faststart out.mp4`
  Also make a `.webm` copy. Alternative if seeking stutters: frame sequences at about 12 fps as WebP (spec 11.6).
- **Budgets (spec):** film at most 6 MB desktop and 3 MB phone; posters under 120 KB; the whole globe set (`nav-1`, `nav-2`, `nav-3`) about 5 MB desktop and 2 MB phone. Where a clip exceeds this, drop to 960 or 1280 wide, 10 fps frame sequence, or trim.
- **Posters:** first frame of every clip as WebP. Used for tier C, reduced motion, Save-Data and loading.
- **Phone versions (9:16):** we only have 16:9. Do not fake new footage. Use a centre-biased crop (per-clip `object-position` listed in section D) rendered to 720x1280. Flag any clip where the crop hides the subject.
- **Hosting:** video CDN (Cloudflare Stream or R2, Bunny, Mux), not in the app bundle. Load one chapter ahead only. Dispose anything out of range.
- **Colour unify:** a fixed overlay gradient (spec 21.1 #9) plus a per-clip CSS filter so all clips share the dawn, golden, blue-hour, night grade. Service clips (s01 to s06) get a slight brighten and warm so the white studio set matches (s01 and s06 run grey or cool).

## D. Chapter plan (replaces spec 7.2 to 7.6, 7.7 media, 9, 10; keep spec 21.2 scroll lengths unless noted)

Scroll position drives the video frame. Text is always real HTML over the video on a dark scrim. Text zones below come from what each clip actually shows.

**01 Hero (200vh pinned).** White page, spec wordmark, tagline, pills. The gold full stop swells and opens a circular reveal onto `hero-film`. Clip plays with scroll. Text zone: right half (open sky). Letters F, L, Y detach and lift, ready for chapter 03. Crop focus (phone): left third, so the aircraft stays in frame.

**02 Statement (250vh pinned).** Statement text with the reading highlight. The framed film is `statement-window`, shaped as an aircraft window at about 70% inset, expanding to full bleed as the camera pushes through the window to the city. Text sits on the dark cabin edges, then on a scrim once the city fills the frame. Clip ends bright, so end the chapter with a dip-to-dark into 03 (not a plain cut).

**03 We handle (300vh pinned).** `still-life` plays behind the list. Text-safe column = left 40% with a dark gradient (props drift into it). **F, L, Y letters orbit as HTML/CSS (or a small canvas) overlays**, away from the text column at rest. The clip ends on the brass compass close-up, which dissolves with a radial mask into chapter 05 (compass-to-globe match-cut).

**04 Scramble film (160vh pinned).** `scramble-film`. Timing (clip is 10 s): traveller silhouette visible 0 to 30%, bright cloud wall around 40 to 50%, open navy sky 60 to 100%. Line 1 "Time flies." decodes at 5 to 30% (left column). **Hide all text during 40 to 50%** (white-out). Line 2 decodes at 60 to 90% (centre). Final text is always in the DOM.

**05 Navigator (480vh pinned + 8% hold).** Text column on the left with title, body, caption, counter `0 / 4 routes`, progress bar, Skip link. Planet plays on the right/centre. Sequence:
1. 0 to 10%: compass-to-globe morph into `nav-1`.
2. `nav-1`: Chennai hub (caption 1), then Singapore at the lower-right edge (caption 2 in clip order).
3. `nav-2`: India to Arabia to Europe. Frankfurt and London (caption 3).
4. `nav-3`: Atlantic to the US east coast. New York (caption 4).
5. 80 to 100%: cross-fade to the spec's **2D canvas globe** (section 9 item 1) showing all four gold great-circle arcs, counter 4/4, caption 5 "Four routes, one hub". Exact coordinates from spec 9 table.
- No arcs are drawn over the moving video (they would not stay on the right cities).
- Captions keep the spec's text; **their order follows clip order** (Chennai, Singapore, Europe, New York, overview). Owner to approve this order change.
- Globe fills the frame in the clips (spec 9 says whole globe visible): the 2D globe at the end is the "whole planet" proof. Keep labels inside a safe area; never overlap London and Frankfurt.

**06 Services (6 x 180vh).** Row layout per spec 7.7 (title, `S'0n`, meta, `( Deliverables )`, list, links). Media = one clip per service, revealed through the aircraft-window mask (spec 21.1 #5), scrubbing slowly with scroll. Mapping: `s01` Corporate travel (seat + briefcase), `s02` Hotels and serviced apartments (key card + brass handle), `s03` Online booking portal (abstract glass panels, no real data), `s04` Conferences and events (stage and chairs), `s05` Group travel (teal suitcases), `s06` Traveller support (headset + plain booklet; keep spec note and the `[CONFIRM WITH OWNER / LEGAL]` partners line exactly). Add a CSS glow sweep per row (amber, teal, blue, violet, green, steel) over the clip. Page background stays white.

**07 Approach (150vh) and 08 FAQ (100vh).** As spec. No video. Optional faint route line only.

**09 Close and landing (150vh pinned).** `close-landing` behind the form with a dark scrim; the lower half of the clip is already calm. Stars canvas fades in, the heading, pills, form and details rise, the giant FLYMECHANICS. wordmark ascends from the bottom edge and the gold dot glows once (spec 21.2). Spec's "jet recedes" is replaced by the runway approach.

## E. Transitions (replace plain fades)

| From to | Transition |
|---|---|
| 01 to 02 | Hero film closes into an aircraft-window-shaped mask, then `statement-window` opens |
| 02 to 03 | Dip-to-dark through the cabin, warm lamp-like fade into the still-life |
| 03 to 05 | Compass dial becomes the globe (radial mask, spec 21.1 #4); mist passage |
| 04 to 05 | Navy sky darkens to space (04 ends in deep blue); short dark cross-fade |
| nav-1 to nav-2 to nav-3 | About 0.5 s cross-fades (the clips do not start exactly where the previous one ends) |
| 05 to 06 | Globe recedes into stars, blue hour, then dark to white crossfade (spec boundary rule C5 from the brief: 40 to 60% of a viewport, no flash) |
| 08 to 09 | White to dark, then the stars and `close-landing` |

## F. Motion, tiers and controls (as spec section 8 and 21, with these adjustments)

- Keep: Lenis (desktop), GSAP ScrollTrigger, Pause motion, Motion Full / Calm / Off, `?motion=off`, Skip links on pinned scenes longer than 250vh, URL hash per chapter, flight HUD (decorative), particle canvas, velocity skew (tier A only), opt-in audio.
- Drop: all R3F/three.js code, GLB models, HDRI, bloom, depth of field, the `PerformanceMonitor` for 3D.
- Tier A and B both run video. B uses lower-bitrate files, no particles and no skew. C shows posters and final text states.
- Safety: no flashes over 3 per second; text over video on a scrim at 4.5:1 measured on real pixels; `prefers-reduced-motion` and Save-Data give posters.

## G. Known imperfections to accept or fix (owner decision)

1. `still-life`: the passport cover shows the word "PASSPORT" (spec avoid list bans text). Accept (tiny) or regenerate.
2. `s03`: a large numeral "7" appears briefly around 2 to 3 s. Accept (window frame may crop it) or regenerate.
3. `close-landing`: runway number "32" and a Manhattan-like skyline. Accept.
4. `nav-1/2/3`: planet fills the frame and Singapore sits at an edge; New York sits upper-right at the end of `nav-3`.
5. `s02` is 720p and has the Gemini sparkle removed with a small soft patch around 4 s.
6. `statement-window` ends bright, so chapter 02 needs the dip-to-dark.
7. Services have one clip each, not 3 to 4 stills.

## H. Decisions and assumptions (change if wrong)

1. **Repo:** assumed **fresh TanStack Start project in this folder**. The spec points to `harrisbenadict14-spec/building-blocks` as a base to refactor; if you want that, say so and I will clone it and reuse its 2D globe and components instead.
2. **Globe:** assumed clips as lead-in plus the spec's 2D globe for the four routes (section D, chapter 05).
3. **Services:** assumed one clip per service.
4. **Copy:** spec section 6 verbatim. The mockup's "100+ destinations", "24/7" and similar stats are not used. Every `[CONFIRM ...]` stays visible and fails the production build.
5. **Never invent facts.** Credentials (email provider, domain DNS, Turnstile) are still needed before the form can be called working.

## I. Build order (spec section 20, adapted)

1. Foundation: tokens, fonts, content file, motion config, shell, header and menu, `FitText`, MotionProvider.
2. Video engine: scroll-scrubbed `<video>` / canvas component, per-clip crop focus, posters, lazy load, tier detection.
3. Hero and statement (01 to 02) with the dot portal and window mask.
4. We handle and scramble (03 to 04), including the F, L, Y overlays and the text-hide timing.
5. Navigator (05): clips, captions, counter, 2D globe overview, compass morph.
6. Services (06) with six window-framed clips.
7. Approach, FAQ, close, form, Privacy and Terms, SEO and JSON-LD (07 to 09).
8. Immersion pass (HUD, mist, particles, velocity, optional audio) and quality pass (screenshots at 1910x914, 1366x584, 1024x768 and 390x844, Lighthouse, checklist).

Stop and report after each phase. Post the plan and file tree first.

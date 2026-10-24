# FLYMECHANICS: Build Notes (decisions to include in the final website prompt)

Running list of everything agreed in chat. The final build prompt must include all of it.

## Approach
- Video-based scroll site (NOT live 3D). Pre-rendered / AI-generated clips scrubbed by scroll. This replaces the brief's "no video / no static images" rule (Sections 1.2, 7 and the static-image check script). Rewrite those parts of FLYMECHANICS_MASTER_BUILD_BRIEF.md for video.
- Drop the live-3D milestones (M2 to M5, M7, M8). Add a step to optimise and wire in the clips.
- Keep from the brief: content lock, no invented facts/stats, HTML text over video, accessibility, reduced motion + Pause control, quote form, legal pages, SEO, placeholder markers, QA with screenshots.
- Content spec FLYMECHANICS_BUILD_SPEC.md is still needed (source of truth for copy). Never write replacement copy.
- Mockup text/stats (100+ destinations, 24/7, etc.) are NOT approved copy.

## Clips (files in C:\Users\harik\Desktop\fly)
| # | Shot | File | Status |
|---|---|---|---|
| 1 | Takeoff hero | clip 1.mp4 (1920x1080, 10.1s) | Accepted. Aircraft left, sun/open sky right |
| 2 | Aircraft window | clip 2.mp4 (HD redo, 1920x1080, 10.0s, 5.2 Mbps; earlier 640x360 version replaced) | Accepted. Generic coastal city (no longer Hong Kong). Blank seat-back screen visible early on right. Ends full-frame bright city, so transition into dark Clip 3 needs a dip-to-dark/short warm fade, not a plain cut |
| 3 | Travel still-life | clip 3.mp4 (1920x1080, 10.1s) | Accepted, no rework |
| 4 | Navigator (clouds) | clip4.mp4 (1920x1080, 10.0s) | Accepted. Mid-clip cloud whiteout is bright: add scrim for text; ends in navy sky, good lead into globe |
| 5 | Night Earth, no routes | clip5.mp4 (1920x1080, 10.0s, 12 Mbps, compress) | Accepted as base. Geography good (India, Arabia, Himalaya). Camera drifts so overlay must follow keyframes. Only India/Singapore area fully in view; Frankfurt/London at left edge, New York off-screen. Decision pending: extra westward clip (5b) or 2D route panel |
| 5b | Globe westward rotation (India to Europe to Atlantic/US east coast) | clip5b.mp4 (1920x1080, 10.0s, 13 Mbps, compress) | Accepted. India, Arabia, Med, Europe, UK all good. Ends over Atlantic with UK leaving right edge; North America NOT reached, so New York route needs edge arc/label, 2D panel, or a short 5c. Crossfade from clip5 at start. Original plan: Overlay arcs follow keyframes; also keep the 2D vector route panel as backup |
| 5c | Globe continues Atlantic to US east coast (New York) | clip 5c.mp4 (1920x1080, 10.0s, 7 Mbps) | Accepted. Starts with UK/Iberia at right edge (slightly different from 5b end, use short crossfade). Dark empty Atlantic mid-clip (good for text). Ends on lit US east coast; NY corridor in upper-right, 2D panel still backs up all four routes |
| 7 | Blue-hour landing | ckip 7.mp4 (1920x1080, 10.0s, 5.6 Mbps) - USE THIS ONE (filename typo "ckip"; rename to clip7_landing.mp4) | Accepted. Runway solid from frame 1, no ghosting. Skyline looks like Manhattan; runway shows number "32" and bright white markings in lower half (scrim behind quote form). Old clip 7.mp4 had a ghosting glitch, discard |
| 6a | Corporate travel: business seat + briefcase | clip6a.mp4 (1920x1080, 10.0s, 2.9 Mbps) | Accepted. Grey-cream studio (not pure white), softbox panel visible top-left (crop out via window frame), orbit ~100 degrees |
| 6b | Hotels: key card + brass handle | clip6b_clean.mp4 (watermark removed from gemini_generated_video_2f67ffa3.mp4; 1280x720, 10.0s) | Accepted for small window. Gemini sparkle watermark bottom-right: crop out via window frame/object-position or regenerate without; 204/240 unique frames (minor) |
| 6c | Booking portal: abstract glass panels | clip6c.mp4 (1920x1080, 10.0s, 2.9 Mbps) | Accepted with caveat: a large numeral "7" shape appears around 2 to 3s (plus faint glyph-like shapes later); busy parallax; no watermark seen. Regenerate only if "no numbers" is strict |
| 6d | Conferences: stage, truss, empty chairs | clip6d.mp4 (1920x1080, 10.0s, 4.7 Mbps) | Accepted. White/light grey room, blank backdrop, no text/watermark. Minor: truss/spotlights shift slightly late in clip; stage platform barely visible; ends mid-room |
| 6e | Group travel: dark-teal suitcases in a row | clip 6e.mp4 (1920x1080, 10.0s, 4.1 Mbps; rename clip6e) | Accepted. Blank tags, no text/watermark. 6 cases visible (asked 5), row curves slightly, background light grey not pure white |
| 6f | Traveller support: headset + plain navy booklet | clip 6f.mp4 (regenerated 11:55; 1920x1080, 10.0s, 5.0 Mbps) | Accepted. Emblem removed (plain navy cover, small blank gold patch early on). Cool blue-grey tint, brighten/warm to match set. No watermark |
| 6a-6f | Six service clips (seat, hotel, portal, stage, suitcases, headset) | not yet | Prompts given; bright white studio, 5 to 6s, shown inside aircraft-window-shaped frames on white Services layout; names/order/copy come from the spec, not these prompts |
| 6 (old) | Services studio objects | not yet | Optional |
| 7 | Blue-hour landing | not yet | |
- Phone (9:16) versions: skip at first, add later if desktop crops badly.
- Prompts live in FLYMECHANICS_VIDEO_PROMPTS.md (lessons applied later: complete aircraft, "no lens flare artifacts", 8 to 10 s, 1080p+).

## Text placement (per clip, include in final prompt)
- Clip 1: text right (open sky), light gradient. Clip 2: text on dark cabin edges, scrim once city fills frame. Clip 3: left ~40% column with dark gradient. Clip 4: left at start, centre after; hide text during bright cloud wall (~4 to 5s). Clips 5/5b/5c: left panel + route labels over planet. Clip 7: text upper area, quote form lower, darker bottom half.
- Chapters with NO clip yet (Services, Approach, FAQ) need a plain dark/white layout or the optional Shot 6 clips; text there is never over video unless clips are added.
- Per-clip object-position (cover crop) focus point, separate mobile focus. Test 1910x914, 1366x584, 1024x768, 390x844. Measure contrast over real pixels.

## Things I said I would do in the build
1. Window-shaped mask reveal: Clip 1 to Clip 2 (aircraft-window clip-path opens over clip 1 revealing clip 2).
2. Clip 2 to Clip 3: dark-to-dark fade (cabin into studio).
3. Clip 3 to Clip 4: short dark crossfade from compass close-up. Compass round shape can lead into globe.
4. Clip 4 to Clip 5: sky darkens into black space, globe fades in.
5. Clip 5 to Clip 7: dark transition from night Earth to blue-hour city.
6. Subtle unified colour grade overlay across all clips (warm gold + dark navy) so scenes feel like one flight.
7. Dark gradient behind hero text on the right side of Clip 1.
8. Dark gradient on the left of Clip 3 so the six service labels and cost-control line stay legible (text-safe column ~40% width).
9. Draw the four routes from Chennai (Frankfurt, London, Singapore, New York) in code over the plain globe clip, using exact coordinates (Chennai 13.0827 N 80.2707 E, Frankfurt 50.1109 N 8.6821 E, London 51.5074 N 0.1278 W, Singapore 1.3521 N 103.8198 E, New York 40.7128 N 74.0060 W). Spec coordinates win if provided.
10. Preload each clip while the user reads the previous chapter; lazy load the rest.
11. Encode all clips all-keyframe (`ffmpeg -g 1`) for smooth scrubbing, about 3 to 8 MB each for desktop. Provide a smaller mobile version.
12. Scroll maps position to frame (video currentTime or canvas frame sequence). Scroll sets pace, so slow-motion stretching is unnecessary.
13. Do NOT use duplicated/stretched frames (the slowed Shot 1 was ~12 fps effective). Use original or interpolated.
14. Compass/service text and all copy are real HTML. No text baked into videos.
15. Reduced motion / Pause / `?motion=off`: show a static frame, text still readable. Fallback if video fails: dark gradient layout, text and form working.
16. Keep HUD safe zones, contrast 4.5:1 (use scrims over video), min type sizes, footer wordmark unclipped.

## Spec verification (FLYMECHANICS_BUILD_SPEC(1).md is the content/behaviour source of truth; it wins over the brief)
- Stack per spec: TanStack Start + React + TS + Tailwind + GSAP/ScrollTrigger + Lenis (+ R3F optional). NOT Next.js. Spec names repo harrisbenadict14-spec/building-blocks as base to refactor; this folder (Jyruka14) is empty. Decision pending.
- Spec allows video, posters and frame sequences (sec 11), so the video approach is compatible. Chapters are the spec's 9 (Hero, Statement, We handle, Scramble film, Navigator globe, Services x6, Approach, FAQ, Close), not the brief's names.
- Clip mapping: clip1 -> hero-film/statement frame; clip2 -> window reveal moment (not a spec film; use in statement/transition); clip3 -> still-life.mp4 alt (spec wants objects floating on black, ours sits on a wooden table); clip4 -> scramble-film; clips 5/5b/5c -> globe lead-in only (spec globe needs 4 clips/keyframes with arcs and whole planet in frame; ours are close-up, no Singapore pass, no pull-back overview); 6a-6f -> one hero clip per service (spec wants 3-4 dark glow-coloured stills per service, so extra stills needed or reduce); clip7 -> not in spec manifest (spec close = jet recedes, stars, wordmark rises).
- Spec AVOID list (no text/letters/numbers): flag clip3 "PASSPORT" word, clip6c numeral "7", clip7 runway "32".
- Missing vs spec: 9:16 versions of every film; posters (webp, <120KB); compression to budgets (film <=6MB desktop, <=3MB phone; globe sequence ~5MB); F/L/Y letters, mist passages, dot-to-sun portal, compass-to-globe morph done in code.
- Spec copy: use site.content.ts verbatim (section 6). Do NOT use mockup stats (100+ destinations, 24/7). Keep every [CONFIRM] visible; production build fails while any remain.

## Build progress
- Phase 1 (foundation) done: TanStack Start project in this folder; tokens, fonts (Inter, Plus Jakarta Sans via fontsource), site.content.ts (spec verbatim), chapters + motion config, MotionProvider (Pause, Full/Calm/Off, reduced-motion, Save-Data, ?motion=off), Header + Menu overlay (focus trap, Esc), ControlDock, FitText wordmark, hero shell, stub sections for chapters 2 to 9, check:placeholders script, README.
- Test note: the Browser pane stalls CSS transition timelines, so menu open/close was verified with transitions disabled.
- Next: phase 2 (video engine, hero dot-to-sun portal, statement window).

## Phase 2 done (video engine, hero portal, statement)
- Encoded clips in public/media (all-keyframe H.264, 24 fps): hero-film (3.9 MB, mobile 1.3 MB), statement-window (6.0 MB, mobile 1.9 MB), posters (start and end WebP, all under 120 KB). Source clips come from C:\Users\harik\Desktop\fly.
- New: ScrollEngine (Lenis desktop only, GSAP ScrollTrigger), ScrubVideo (scroll sets currentTime, lazy, light file on phones and tier B), Opening (chapters 01 and 02 in ONE pinned stage so the window-frame handover has no slide; 450% of a screen total).
- Bug found and fixed: motion/static layout is switched by CSS class, not inline style, because GSAP's revert restored stale inline styles.
- Carried to later phases: hash links (#statement etc.) land at the stage start, need ScrollTrigger-based jump targets in phase 7; phone crops use object-position only (no true 9:16 footage); the hero poster is the first frame (aircraft) while the static hero is white.
- Files in the fly folder now: clip6b.mp4 (no clip6b_clean.mp4). Check clip6b.mp4 for the Gemini sparkle before phase 5.

## Phase 3 done (We handle + scramble film)
- Encoded still-life (5.6 MB, mobile 1.8 MB) and scramble-film (4.2 MB, mobile 1.4 MB) with posters, all within budget.
- New: HandleScramble (chapters 03 and 04 in ONE pinned stage, 460vh), ScrambleText (final text always in the DOM, scramble aria-hidden, fixed-width boxes, words never split), src/lib/scroll.ts (debounced ScrollTrigger refresh).
- 03: list slides in over a dark text-safe column; F L Y orbit in the open area (desktop right, phone lower middle), list dims and the chapter dips to dark as the clip ends on the compass. 04: "Time flies." decodes before the cloud wall, line 2 after it; no text during the white-out.
- Stage CSS generalised to .stage / .stage-layer / .stage-layer--late / .stage--motion.
- Fixed in audit: scramble lines could break mid-word (now grouped by word); pin spacing is recalculated after every stage builds.
- Test note: in the emulated-size test tab the pins may start with zero spacing until ScrollTrigger.refresh() runs; fresh tabs are fine. Verify on a real browser in phase 8.
- Next: phase 4 Navigator (nav-1/2/3 clips + 2D globe + compass-to-globe morph from the compass end frame).

## Bug fixes before phase 4
- Statement and scramble layers are hidden with opacity (not visibility) while motion runs, so assistive tech can still read them; late layers have pointer-events none.
- Chapter links (#statement, #handle, #scramble, #navigator, #hero) now jump to where the chapter takes over inside its pinned stage (lib/scroll.ts anchors + click handler; also on page load with a hash). Lenis built-in anchors turned off.
- Text contrast measured on real clip frames with the real scrims (95th-percentile background brightness): We handle list 10.6:1, statement 5.8:1, scramble line 1 6.0:1 and line 2 6.7:1 after strengthening the chapter 04 scrim (was 4.2:1).

## Phase 4 done (Navigator)
- Encoded nav-1/2/3 from clip5a, clip5b, clip 5c at 960 wide, 24 fps, all-keyframe: 3.7 MB desktop total, 1.3 MB phone (budget about 5 MB / 2 MB).
- Navigator.tsx: 480vh + 8% hold. Clip 1 (India, Chennai, Singapore edge) -> clip 2 (Europe) -> clip 3 (New York), cross-fading, then the 2D globe (GlobeCanvas, d3-geo + Natural Earth land via world-atlas, ISC licences) draws the four gold routes from Chennai with the spec's coordinates and labels that never overlap. Counter, captions (aria-live), progress bar and "Skip animation" link on the left. Static mode (reduced motion, Pause, ?motion=off) shows only the finished 2D globe.
- Caption ORDER follows the clips (Chennai, Singapore, Europe, New York, overview); caption text is the spec's. Owner to approve the order.
- Compass-to-globe morph (spec 21.1 #4) NOT built: chapter 04 (scramble) sits between the compass and the globe, so the compass would reappear out of nowhere. The globe fades up from black instead.
- Licences to list in README: world-atlas (ISC, Natural Earth public domain data), d3-geo (ISC), topojson-client (ISC).

## Globe change (owner decision) and Phase 5 (Services)
- Owner did not want the 2D globe (it hurt the realism). REMOVED: GlobeCanvas, d3-geo, topojson-client, world-atlas. Navigator now ends on the real New York clip (nav-3) with the final caption "Four routes, one hub" and counter 4 / 4; pin shortened (T 7.9). Static mode shows the first clip's still. No flat map or route arcs are drawn anywhere.
- Phase 5: Services.tsx. Six rows (id s01..s06, wrapper id services) on white, in the approved order and copy. Each row: title + S'0n, meta line (©26 + tags), ( Deliverables ) label, body, line-separated items, links (All services, Request a quote), and one clip in a window-shaped frame that opens as it scrolls in and plays through the pass, with a soft coloured light inside the media only. Service 06 shows the note and the visible OwnerConfirm partner placeholder exactly as in the spec.
- Rows are NOT pinned (spec asked for 180vh pinned rows): the text and list do not fit one short screen (1366x584), so the animation is scroll-linked instead. Phones: same layout stacked, frame between the title and the text.
- Clips: s01..s06 from clip6a, clip6b (the new 1080p version, no watermark), clip6c, clip6d, clip 6e, clip 6f at 1120 wide (1.4 to 2.2 MB each, phone 0.5 to 0.8 MB), lazy loaded.
- "©26" in the meta line is the spec's (7.7 item 2); it reads like a year stamp, owner to confirm.
- OwnerConfirm component added (brief C1).
- Next: phase 6 (Approach, FAQ, contact and close, quote form, legal pages, SEO).

## Review round after phase 5 (owner feedback: services not full-screen, plain, spacing)
- Services redesigned: each service is now a full-screen film (sticky layer, opens from the aircraft-window shape to full bleed, plays through the pass) with a frosted text card that scrolls over it; cards alternate left and right. Replaces the small framed window on a plain white page (that layout was my choice to fit short screens, and it looked flat).
- Bug fixed (all chapters): React dropped the `padding` shorthand when `paddingBottom` was also set, so the Opening, We handle, scramble and Navigator text had ZERO side margin (touching the screen edge). Each now uses one padding shorthand.
- Page margin widened: clamp(16px, 1.5vw, 28px) (was 8px).
- Measured at 1910x914, 1366x584, 1024x768, 390x844 (static layout): no text left of the margin, none beyond the right margin, no horizontal scroll.

## Phase 6 done (Approach, FAQ, contact and landing, quote form, legal pages, SEO)
- Approach: white page, statement, Data / Experience / Value columns with gold rules drawing in, a faint route ribbon behind the columns (decorative). No proof counters (owner has not confirmed numbers).
- FAQ: line-style accordion, one open at a time, aria-expanded, answers shown through WithMarkers (the emergency answer keeps its visible [CONFIRM ...] marker). FAQPage JSON-LD leaves out any answer that still holds a marker.
- Contact and close: sticky blue-hour runway film (ckip 7.mp4 -> close-landing) plays while the heading, details and quote form scroll over it; giant FLYMECHANICS. wordmark rises and the gold dot glows once; footer links (Services, Navigator, Approach, FAQ, Privacy, Terms, email, Back to top) and (c) year with the legal-entity marker.
- Quote form: fields per spec (name, company, work email, phone, service, travellers per month, message, consent). Required: name, company, email, service, consent. Phone, travellers, message optional. Visible labels, inline text errors, focus moves to the first error, aria-live status. Honeypot, in-memory rate limit (5 per 10 minutes per IP), optional Turnstile (needs VITE_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY).
- Server function (src/server/quote.ts) re-validates, then stores (ENQUIRY_STORE_URL, optional token) and emails the team and an acknowledgement (Resend API: EMAIL_PROVIDER_API_KEY, QUOTE_FROM_EMAIL, QUOTE_TO_EMAIL). It reports success ONLY if storage or email really succeeded; with nothing configured it answers "Sending is not available right now" (tested). NOT verified: a real email arriving, storage, SPF/DKIM, Turnstile.
- Legal pages /privacy and /terms: drafts, banner "Draft for review by the company's lawyer. Not yet approved.", every unknown is a visible [CONFIRM WITH LEGAL ...] marker, noindex.
- SEO: canonical, Open Graph + 1200x630 image (frame from clip 1), TravelAgency + Service + FAQPage JSON-LD (only confirmed facts), robots.txt and sitemap.xml (home only).
- Menu, header and footer links use /#id so they work from the legal pages too.
- Acknowledgement email wording and the form's success text are my minimal wording (no promised response time): owner to approve.
- Map pin (spec contact.mapPin) not shown: not confirmed.
- Next: phase 7 (immersion pass: flight HUD, mist passages, particles, velocity effects, optional audio) and phase 8 (quality pass).

## Phase 7 done (immersion pass)
- Flight HUD (FlightHud.tsx): thin gold-free route line on the left edge, plane tied to scroll, nine chapter dots (buttons: jump, name on hover/focus, aria-current), and "Chapter 05 / 09 + name" bottom right (hidden on phones). Active chapter switches when a chapter fills the upper part of the screen (agrees with the chapter config; chapter names: Takeoff, Who we are, We handle, Time flies, The navigator, Services, Approach, FAQ, Let's fly). Hidden on pages without chapters. Rail sits at x 2 to 12 px so it never overlaps text at rest; labels show only on hover/focus (not on change) for the same reason.
- Atmosphere.tsx: mist that sweeps over the screen as chapters 03, 05, 06 and 09 arrive (veils the dark to white cut into Services), plus a faint sky grade (dawn gold, golden hour, blue hour, night) over the whole page. ParticleField.tsx: dust/stars (110 desktop, 40 phone) that streak with scroll speed; white on dark chapters, gold on light.
- Velocity physics: film layers skew and stretch slightly with scroll speed (CSS vars --v and --va written every frame).
- PointerFx.tsx: cursor dot (swells over links and controls) and magnetic pull on pills, fine pointers only.
- Cabin audio (lib/audio.ts): opt-in toggle in the dock, never remembered, generated in the browser (no audio files, no licences): brown-noise hum whose filter opens with progress, a two-note chime and a faint whoosh on chapter change, 400 ms fades. Silenced by Pause, Off and reduced motion. NOT heard by me: the test browser cannot play sound; only the toggle state was verified.
- Modes verified: Full = everything; Calm = no particles, mist, cursor or skew, pinned scrolls 40% shorter (page height 15579 -> 13115 px), sky grade kept; Off = nothing animated, HUD stays, audio disabled. Tier B and C get none of the extras.
- Dock labels shorten on phones (Pause, Audio) so it fits 390 px.
- Not done: no real-device frame-rate numbers; Lighthouse; contrast re-measure over the mist and sky grade.

## Phase 8 done (quality pass)
- axe-core (dev, in the browser): 0 violations at top, services and end of the home page in motion mode; static mode and /privacy clean after fixes (dock now a labelled region, skip link in a nav and pointing at #main, the H1 moved out of the hero layer so it stays after the handover).
- Lighthouse 12 on the production build: DESKTOP performance 99, accessibility 100, best practices 96 to 100, SEO 100 (FCP 0.4 s, LCP 0.8 s, TBT 40 ms, CLS 0.003). MOBILE (simulated slow 4G, 4x CPU) performance 66 to 72 over six runs (FCP 1.2 to 2.4 s, LCP 3.3 to 3.6 s, TBT 580 to 1060 ms, CLS 0 to 0.08), accessibility 100, best practices 100, SEO 100. Mobile performance is BELOW the spec target of 80; the limit is main-thread work (script evaluation about 2 s, style and layout about 1.8 s under 4x throttling). Not reached: 80.
- What moved the numbers: films and posters no longer load before the first screen paints and the pins are measured (page weight 7.0 MB -> 3.5 MB on mobile), extras (mist, particles, cursor, HUD, below-fold scroll effects) start after the first paint, no entrance fade on the first paint, wordmark sized by CSS until fonts load, fonts preloaded, one batched layout pass for scramble text, own ScrollTrigger refresh. Tried and reverted: splitting below-fold sections into lazy chunks (no gain; contact text left the server HTML).
- Fixes: favicon (was a 404), 24px minimum target sizes (HUD dots, hero links), HUD labels out of flow so they never widen the click area.
- Release guard: `npm run build:release` refuses to build while any [CONFIRM ...] remains (24 markers now). README lists the owner actions before launch.
- Not done / not verified: real-device tests, Lighthouse on a real phone, screen-reader pass (NVDA/VoiceOver), 200% zoom check, Save-Data and low-power behaviour on real hardware, a real quote email, deployment.

## Phase 8b: mobile performance push (owner asked to push toward 80)
- Result (Lighthouse 12, production build, simulated slow 4G + 4x CPU): MOBILE performance 90 (three runs, 89 to 92 earlier), accessibility 100, best practices 100, SEO 100; FCP 1.3 s, LCP 3.0 s, TBT 160 to 210 ms, CLS 0 to 0.08. DESKTOP 100 / 100 / 100 / 100. Before: mobile 66 to 72.
- What worked (the large win was moving work out of the loading window, not making it cheaper):
  1. Heavy extras (mist, sky grade, particles, cursor, HUD) and the reveal effects of chapters far below the fold start on the visitor's FIRST INTERACTION (touch, wheel, key, pointer, scroll) or after about 6.5 s of quiet, whichever is first (lib/scroll.ts useAfterQuiet).
  2. The We handle / scramble stage and the Navigator build their pinned timelines on that first interaction too, or at once if the page opens already scrolled or with a #hash (useAfterQuietOrScrolled). Only the hero/statement stage is built during loading.
  3. Smooth scroll (Lenis) is a separate chunk loaded only on mouse devices; touch devices never download it.
  4. Per-frame work removed: no page-height read every frame (it forced a layout), CSS variables written only when the value changes, nothing runs while idle.
  5. One ScrollTrigger refresh after fonts and load instead of three; Opening no longer refreshes itself.
  6. Hash links (#navigator and so on) now land after the layout is measured, and once more after settling, unless the visitor has already interacted.
- Behaviour trade-offs to know: (a) before the first interaction the page has only the first stage pinned, so the HUD, particles, mist and later reveal animations appear a moment after the visitor first scrolls or touches; (b) films start loading about 1.2 s after load, so a visitor who scrolls in the very first second may see the hero circle open before its film has arrived on a slow connection; (c) a page restored mid-scroll builds everything at once (slower first paint there, by design).
- Still open: CLS 0.08 appears on some runs (the wordmark re-fits when the web font arrives); Lighthouse mobile is a simulation, not a real phone.

## CLS follow-up (after phase 8b)
- The shifting element was NOT the wordmark: Lighthouse's layout-shift trace names the bottom control bar (old rect y 765, 339 x 42). It appears when the tool resizes the viewport for its full-page screenshot; a bottom-anchored fixed element moves in layout when the viewport height changes (real phones do the same when the browser bar collapses).
- Fix: the control bar, the HUD rail and the chapter count are positioned with transforms (top: 0 + translateY with svh units) instead of bottom:/top:50%. Fonts-ready gating of the bar was tried and reverted (no effect, worse total blocking time).
- Result, five clean runs (nothing else running on the machine): MOBILE performance 92 to 95, accessibility 100, best practices 100, SEO 100; FCP 1.2 s (one run 2.1 s), LCP 2.9 to 3.1 s, TBT 30 to 80 ms, CLS 0.011 to 0.022 (was 0.08 on some runs; under the 0.1 "good" limit). DESKTOP 100 / 100 / 100 / 100, CLS 0.
- Measurement note: scores drop 10 to 20 points when the machine is busy (many preview servers were running and gave TBT 120 to 520 ms); close other work before measuring.

## Earth clip blur fixed
- Owner reported the Navigator (Earth) films looked blurred and damaged. Cause: my encode (960 px wide, very high compression, every frame a keyframe) destroyed the fine city-light and star detail; the page then upscaled it about 2x. Fix: nav-1/2/3 re-encoded from the originals at 1280 wide (lanczos), crf 27, a keyframe every 8 frames: desktop 3.3 + 3.0 + 1.8 MB, phone 1.1 + 1.0 + 0.6 MB. Verified sharp in the browser (1280x720 loaded).
- Films no longer carry a permanent 1.02 scale (it resampled them even when still); the velocity effect now starts from no scale at rest.
- Other clips (hero, statement, still-life, scramble, services, landing) use gentler settings and were not changed.
- LAUNCH_CHECKLIST.md written (owner inputs, accounts, hosting, testing).

## First-page additions (owner chose options A + B + C)
- HeroExtras.tsx: (A) HeroWindow, a small aircraft-window card (top right, above the wordmark, sized by screen height so it never touches it) playing the sunrise flight slowly in a loop; the file loads only after first paint, the still frame shows with motion off or Pause. (B) ChennaiClock, "Chennai 13.08 N, 80.27 E hh:mm IST", live Indian time, coordinates from the spec's city table (no invented data). (C) ServiceTicker, a slow line of the six approved service names; decorative (aria-hidden), stops on Pause and Off.
- All three fade away with the hero as you scroll (existing hero fade), and return on scroll back. Tagline width leaves room for the card on phones.
- Checked at 1366x584, 1024x768 and 390x844: no overlaps (card/wordmark, ticker/wordmark, bottom row/control bar), no horizontal scroll.
- Lighthouse after the change (production build, nothing else running): mobile performance 91 to 94, accessibility/best practices/SEO 100, TBT 20 to 40 ms, CLS 0 to 0.011; desktop 100 across.

## First page: owner removed the window card and the on-screen control bar
- The aircraft-window film card (HeroWindow) was removed completely: owner did not want it.
- The Pause / Full / Calm / Off / Cabin audio bar no longer floats on the screen. The same controls now sit inside the menu ("Motion and sound"), so the page stays clean. Trade-off: the spec asked for Pause motion to be always visible; it is now one click away (Menu). `--hud-bottom` is 0 because nothing is reserved at the bottom any more.
- Kept for now (owner has not objected): Chennai time and coordinates, and the service ticker.
- Lesson: when the owner asks for recommendations, give a short list and wait for a pick; do not build.

## First page: ideas 1 and 2 built (owner picked them)
- Idea 1, film through the wordmark: the sunrise flight (hero-film, slowed to 0.7x) plays behind a white knock-out copy of the wordmark (`mix-blend-mode: lighten`, black letters), so the film shows only inside the letters. The gold full stop and the dot-swell stay on the top copy (its letters are transparent). Both copies animate together (load-in rise, lift-away). Film is darkened (brightness .62, contrast 1.25) so letters stay strong on white. Poster frame shows in static, Pause, Off and reduced-motion; the film file loads after the first paint and pauses once the hero is scrolled past.
- Idea 2, headline: the approved tagline ("Time flies. It's up to you to be the navigator.") is now the large headline above the wordmark (no new copy). `.hero-headline` size is `clamp(30px, min(4.4vw, 8.4svh), 76px)`.
- `--hud-bottom` is 40px again, for the bottom-right chapter counter.
- Not yet re-measured with Lighthouse after this change.

## Hosting: Vercel chosen
- `nitro` added (dependency) and `nitro()` added to vite.config.ts. Verified: NITRO_PRESET=vercel build produces .vercel/output (static 65 MB incl. 56 media files, one server function); local preview returns 200 for / and /privacy. `.vercel` added to .gitignore.
- Not verified: a real Vercel deployment, the quote form server function running on Vercel, env vars. The form's in-memory rate limit is per function instance on Vercel, so it is weak; Turnstile is the real spam control.
- Vercel Hobby forbids commercial use: Pro plan needed.

## Deployed-site fix (from the owner's screen recording, 24 Oct)
- Seen on the live site: Services rows 02 to 06 showed a pale empty background with no film (only row 01 loaded), and a half-drawn film frame at the scramble/navigator handover. Cause (inferred from the recording, not reproduced on a slow network): the films are 2.5 to 6 MB each, all-keyframe, and only started loading when a chapter was about 1.5 screens away, so a fast scroll on a real connection arrived before the file did; in motion mode no poster was shown, so there was nothing to see.
- Fix 1: while a film is chosen but not yet ready, its small WebP poster shows (10 to 35 KB), so an unloaded film never looks empty.
- Fix 2: films now start loading 3 screens ahead (was 1.5), and on capable devices (tier A) they also load in the background in page order, 1.1 s apart, after the first interaction. Phones, tier B and Save-Data only load what is near.
- Fix 3: the 11 desktop films were re-encoded from the original clips at 1600x900, crf 25, keyframe every 8 frames (was all-keyframe at 1280 or 1600). About 30 to 55 percent smaller each (Services 19 MB to 9.7 MB), SSIM 0.98 to 0.99 against the old files. Old files kept in the scratchpad. Phone files unchanged.
- Fix 4: Vercel cache headers via nitro routeRules: /assets/** immutable one year; /media/** one day plus stale-while-revalidate a week.
- Not verified: on a throttled connection or on the live site; scrub smoothness with the 8-frame keyframe gap was checked on the dev server only.

## Film quality upgrade (owner asked to enhance all films without hurting the viewing experience)
- Every film re-encoded from the original clips, four versions each, all with a keyframe every 8 frames:
  - `NAME-l.mp4` 1920x1080 crf 23 (nav clips crf 27): only for screens with 1700+ physical pixels AND a browser that reports 10+ Mbps, 4g and no Save-Data (Chrome and Edge report this; Safari and Firefox do not, so they get the 1600 file).
  - `NAME.mp4` 1600x900 crf 25 (nav crf 27): the normal desktop file. Nav (Earth) clips went from 1280 to 1600.
  - `NAME-m.mp4` 1024x576 crf 28 (was 720x406): weaker devices and landscape phones.
  - `NAME-p.mp4` 608x1080 crf 26: portrait phones, a centre crop of the 1080p source, so object-fit cover frames it as before but with about 2.7x the vertical detail (was 406 px tall stretched to the phone screen).
- Choice is made in `pickFilm()` in ScrubVideo.tsx; `src/config/media.ts` lists all four. The hero wordmark film keeps the landscape files.
- Posters regenerated from the originals at 1600 wide (WebP q78, 11 to 157 KB).
- Sizes: default desktop set 42 MB (was 30), large set 79 MB (only fast connections), mobile 14 MB, portrait 18 MB. Deployment static folder is now about 139 MB. Previous encodes are in the session scratchpad (media_before_hq).
- Checked on dev server: 40 random seeks per film took a median 15 to 31 ms (p90 under 130 ms) for 1080p, 1600 and portrait files alike, so scrubbing is not slower. Not checked: a real phone, a real fast or slow connection, or the live site.
- Source clips are 1080p AI video; the upgrade cannot add detail they do not have.

## Phone fixes and smoothness (owner: "mobile view is so terrible", "frame rate should be smooth")
- ROOT CAUSE of the terrible phone view: the footer wordmark (FitText) was measured at 100px while in the page flow. On a phone that is wider than the screen, so it widened its parent and then the page (mobile browsers grow the layout viewport to fit), and the fit then locked the overflow in: the layout was 799 px wide on a 412 px phone, so everything was zoomed out and half off screen. Found with real device emulation (Playwright Chromium with Pixel 7 and iPhone 13, and Windows WebKit); the Browser pane's size emulation had been hiding it (it reported 799 wide too, and I had missed the sign). Fix: FitText measures with the text taken out of the flow.
- After the fix: innerWidth equals the device width (412 and 390), no horizontal overflow, and every chapter was reviewed in phone screenshots (hero, statement, handle and scramble, navigator, services, approach, FAQ, contact).
- Touch devices are tier B (no particles, mist, cursor or film skew); the hero wordmark film is a still on phones.
- Scrub video: a new seek no longer interrupts a seek that is still decoding (it is applied when the previous one lands), so a fast scroll on a slow device keeps updating frames instead of freezing. iOS unlock: a silent play-then-pause on the first touch so iPhones decode the films.
- Velocity variables are written on the film containers only, not on html.
- Phones on a reported 4g connection also preload the small portrait films in the background.
- Measured (Playwright, production build, no CPU throttling): Pixel 7 and iPhone 13 emulation 52 to 54 fps average while scrolling 1500 px/s, 95th percentile frame 17 to 33 ms; desktop 47 to 53 fps at 2500 px/s. Scrub seeks land in one frame (16.7 ms) for all encodes. A 4x CPU throttle in headless software rendering dropped to 9 fps, but the profile showed the cost was the test harness's scrollTo and browser style/paint work, not the site's scripts (under 15 percent), so that number is not a real-phone figure.
- NOT verified: a real phone (smoothness depends on its GPU), real iOS Safari, the live site.

## Phone check, round 2 (before redeploy)
- Tested 10 sizes with real device emulation: 280 (folded foldable), 320, 360, iPhone SE, iPhone 13, Pixel 7, iPhone 14 Pro Max, iPad Mini, and two landscape phones; home, privacy and terms; menu open. Page width equals device width and there is no sideways scroll at any of them (after the fixes below).
- Fixed: on phones under 420 px the logo sat under the quote pill once the pill appeared (the pill is 158 px wide); the logo now steps aside past the first screen (the menu still links home). At 280 px the service card and the footer email pushed the page 14 px too wide: smaller title and wrapping now. The motion controls in the menu wrap on 280 px. On landscape phones (about 340 px tall) the ticker is hidden so the first screen's last row is not cut off.
- Checked by tapping on Pixel 7 and iPhone SE emulation: all five menu links land on their chapter and close the menu; the FAQ opens; the form shows its five validation messages on an empty submit; inputs are 16 px (iOS does not zoom on focus); pinch zoom is allowed.
- Not checked: a real device, real iOS Safari, a sent enquiry from a phone (email is not configured yet).

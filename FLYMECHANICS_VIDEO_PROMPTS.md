# FLYMECHANICS: Scroll Video Shot List and Prompts

Prompts for the scroll-scrubbed background videos. Paste each one into an AI video tool (Veo, Runway, Kling, Luma, Sora or similar). Use the matching crop of your mockup as the **start frame / reference image** when the tool allows it.

Shots are made **one at a time**. Generate Shot 1, review it, then move to the next.

---

## 0. Global rules (apply to every shot)

**Format**
- 16:9, 1080p or higher (4K if the tool allows). Also make a 9:16 version for phones if you can.
- 6 to 10 seconds. One continuous camera move. No cuts.
- Camera moves slowly and steadily in **one direction**, so it scrubs cleanly forward and backward with scroll.
- No loops, no fades, no flashes.

**Never in the video**
- No text, logos, letters, airline marks, flags or readable documents. All text is added in the website as HTML.
- No people with visible faces. Silhouettes only.
- No lens flare spam, no heavy chromatic aberration, no shaky camera.

**Style block (paste at the end of every prompt)**

```text
Photorealistic, cinematic, shot on a large-format cinema camera, 35mm anatomy, shallow depth of field where relevant, physically accurate lighting, rich dark navy and warm gold colour grade, subtle film grain, high dynamic range, ultra detailed, smooth slow camera movement, no text, no logos, no watermarks.
```

**Brand palette**
- Deep navy / near-black: `#07080C` to `#0B0C10`
- Warm gold accent: about `#F2B632`

---

## Shot 1: Takeoff (hero)

- **Used in:** hero. Scroll maps to the push-in.
- **Start frame:** top-left panel of the mockup (airliner over clouds at sunrise).

```text
A sleek unbranded twin-engine passenger airliner, clean white fuselage with a thin gold accent stripe and no logos or markings, flying above a sea of clouds at sunrise. The sun sits low on the horizon, glowing gold and orange, with long soft light rays through the clouds. The camera starts wide in front of the aircraft and slowly pushes forward and slightly upward alongside it, revealing the wing catching golden light. Deep navy sky at the top, warm gold glow near the horizon. Slow, majestic, steady camera movement.
```

## Shot 2: Who we are (aircraft window)

- **Used in:** chapter 2.
- **Start frame:** top-right panel of the mockup (window with city view).

```text
Inside an aircraft cabin at golden hour, looking at a single oval aircraft window with a thick rounded frame. Through the window, a glittering coastal city skyline with skyscrapers, harbour and mountains in warm sunset light. The camera slowly pushes toward the window until the view fills the frame. Dark cabin interior in shadow, a soft warm rim light on the window frame, a hint of the seat edge on the right. Smooth, slow push-in.
```

## Shot 3: We handle (travel still-life)

- **Used in:** chapter 3.
- **Start frame:** left-middle panel of the mockup (passport, boarding pass, compass, duffel).

```text
A luxury travel still-life on a dark polished surface in a moody studio: a navy-blue passport with a small gold generic emblem (no real country insignia), a blank cream boarding pass with no printing, a brass pocket compass with a glass cover and red-tipped needle, a tan leather duffel bag with brass buckles, and a blank white hotel key card. Warm key light from the top left, cool blue rim light, soft realistic contact shadows, a hint of window light in the background. The camera slowly dollies in across the props and ends on a close-up of the brass compass. Smooth, slow movement.
```

## Shot 4: The Navigator (through the clouds)

- **Used in:** chapter 4.
- **Start frame:** right-middle panel of the mockup (mountain above clouds).

```text
A high mountain ridge above a sea of dramatic clouds at dusk, with distant mountain peaks catching the last warm light. A lone small silhouette of a traveller stands on a rocky summit, looking out, tiny against the huge sky. The camera slowly flies forward through layers of clouds, which part and drift past the lens, ending in a deep blue and gold sky. Dark navy shadows, glowing gold edges on the clouds. Slow, steady forward motion.
```

## Shot 5: Global Hub (night Earth)

- **Used in:** chapter 5.
- **Start frame:** left panel of the mockup (night globe with glowing routes).
- **Important:** AI video cannot place routes between exact cities. Generate the globe **without routes**. The four routes from Chennai (to Frankfurt, London, Singapore and New York) are drawn in code on top, using the real coordinates. Ask for a plain globe.

```text
Planet Earth seen from orbit at night, slowly rotating. City lights glow in warm gold across continents, a thin blue atmosphere glow along the edge, stars in the black background. Deep navy ocean with soft specular highlights, thin wispy clouds. The camera starts wide with the whole globe in frame and slowly drifts closer, centred on southern India, Europe and Asia. No lines, no arcs, no text, no labels. Slow, smooth, realistic.
```

## Shot 6: Services (studio objects, optional)

- **Used in:** the six service panels. Can be six short clips or can be skipped in favour of CSS and type.
- **Setup:** bright, clean white studio, softbox lighting, one object each, slow turntable-style move.

```text
A bright minimalist white photography studio with soft shadows and a clean floor. [OBJECT], rotating very slowly, lit by large softbox lights, premium commercial photography look, no branding, no text.
```

Replace `[OBJECT]` with one of:
1. A premium business-class airline seat with a closed leather briefcase
2. A blank white hotel key card, a brass door handle and a warm lamp glow
3. Abstract floating glass interface panels with no readable text or data
4. A small conference stage with truss and spotlights and rows of empty chairs
5. A row of identical dark-teal hard-shell suitcases with blank tags
6. A matte black wireless headset beside a closed navy passport

## Shot 7: Landing and Quote (blue-hour approach)

- **Used in:** the final chapter, behind the quote form.
- **Start frame:** bottom-left panel of the mockup (night city and bridge).

```text
Blue-hour descent over a glittering modern waterfront city with illuminated skyscrapers and a long bridge, then continuing toward a runway with rows of warm approach lights. The camera glides forward and slowly down, following the approach, ending low over the runway lights with the city glow behind. Deep blue sky with a last band of orange on the horizon, gold city lights reflecting on water. Smooth gliding motion, no aircraft markings.
```

---

## After you generate each clip

1. Check: no text or logos, no sudden changes, camera moves one way.
2. Tell me the shot number and attach the file (or say what was wrong), and I'll adjust the prompt.
3. When all shots are done, I convert them for smooth scrolling. Example, all-keyframe encode:

```bash
ffmpeg -i shot1.mp4 -c:v libx264 -g 1 -crf 22 -pix_fmt yuv420p -an -movflags +faststart shot1_scrub.mp4
```

Target about 3 to 8 MB per clip for desktop and a smaller 9:16 version for phones.

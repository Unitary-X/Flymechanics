// Media paths. Every film has four encodes, all with a keyframe every 8 frames so scroll can seek frame by frame:
//   large    1920x1080  big screens on a fast connection (chosen in ScrubVideo)
//   desktop  1600x900   the normal desktop version
//   mobile   1024x576   weaker devices and landscape phones
//   portrait 608x1080   portrait phones: a centre crop, so object-fit: cover frames it exactly as before, but sharp
// Files live in public/media for now; they move to a video CDN before launch (spec 3 and 11).
export const media = {
  hero: {
    desktop: '/media/hero-film.mp4',
    large: '/media/hero-film-l.mp4',
    portrait: '/media/hero-film-p.mp4',
    mobile: '/media/hero-film-m.mp4',
    poster: '/media/hero-film-poster.webp',
    posterEnd: '/media/hero-film-poster-end.webp',
  },
  statement: {
    desktop: '/media/statement-window.mp4',
    large: '/media/statement-window-l.mp4',
    portrait: '/media/statement-window-p.mp4',
    mobile: '/media/statement-window-m.mp4',
    poster: '/media/statement-window-poster.webp',
    posterEnd: '/media/statement-window-poster-end.webp',
  },
  stillLife: {
    desktop: '/media/still-life.mp4',
    large: '/media/still-life-l.mp4',
    portrait: '/media/still-life-p.mp4',
    mobile: '/media/still-life-m.mp4',
    poster: '/media/still-life-poster.webp',
    posterEnd: '/media/still-life-poster-end.webp',
  },
  scramble: {
    desktop: '/media/scramble-film.mp4',
    large: '/media/scramble-film-l.mp4',
    portrait: '/media/scramble-film-p.mp4',
    mobile: '/media/scramble-film-m.mp4',
    poster: '/media/scramble-film-poster.webp',
    posterEnd: '/media/scramble-film-poster-end.webp',
  },
  nav1: {
    desktop: '/media/nav-1.mp4',
    large: '/media/nav-1-l.mp4',
    portrait: '/media/nav-1-p.mp4',
    mobile: '/media/nav-1-m.mp4',
    poster: '/media/nav-1-poster.webp',
    posterEnd: '/media/nav-1-poster-end.webp',
  },
  nav2: {
    desktop: '/media/nav-2.mp4',
    large: '/media/nav-2-l.mp4',
    portrait: '/media/nav-2-p.mp4',
    mobile: '/media/nav-2-m.mp4',
    poster: '/media/nav-2-poster.webp',
    posterEnd: '/media/nav-2-poster-end.webp',
  },
  nav3: {
    desktop: '/media/nav-3.mp4',
    large: '/media/nav-3-l.mp4',
    portrait: '/media/nav-3-p.mp4',
    mobile: '/media/nav-3-m.mp4',
    poster: '/media/nav-3-poster.webp',
    posterEnd: '/media/nav-3-poster-end.webp',
  },
  s01: {
    desktop: '/media/s01.mp4',
    large: '/media/s01-l.mp4',
    portrait: '/media/s01-p.mp4',
    mobile: '/media/s01-m.mp4',
    poster: '/media/s01-poster.webp',
    posterEnd: '/media/s01-poster-end.webp',
  },
  s02: {
    desktop: '/media/s02.mp4',
    large: '/media/s02-l.mp4',
    portrait: '/media/s02-p.mp4',
    mobile: '/media/s02-m.mp4',
    poster: '/media/s02-poster.webp',
    posterEnd: '/media/s02-poster-end.webp',
  },
  s03: {
    desktop: '/media/s03.mp4',
    large: '/media/s03-l.mp4',
    portrait: '/media/s03-p.mp4',
    mobile: '/media/s03-m.mp4',
    poster: '/media/s03-poster.webp',
    posterEnd: '/media/s03-poster-end.webp',
  },
  s04: {
    desktop: '/media/s04.mp4',
    large: '/media/s04-l.mp4',
    portrait: '/media/s04-p.mp4',
    mobile: '/media/s04-m.mp4',
    poster: '/media/s04-poster.webp',
    posterEnd: '/media/s04-poster-end.webp',
  },
  s05: {
    desktop: '/media/s05.mp4',
    large: '/media/s05-l.mp4',
    portrait: '/media/s05-p.mp4',
    mobile: '/media/s05-m.mp4',
    poster: '/media/s05-poster.webp',
    posterEnd: '/media/s05-poster-end.webp',
  },
  s06: {
    desktop: '/media/s06.mp4',
    large: '/media/s06-l.mp4',
    portrait: '/media/s06-p.mp4',
    mobile: '/media/s06-m.mp4',
    poster: '/media/s06-poster.webp',
    posterEnd: '/media/s06-poster-end.webp',
  },
  close: {
    desktop: '/media/close-landing.mp4',
    large: '/media/close-landing-l.mp4',
    portrait: '/media/close-landing-p.mp4',
    mobile: '/media/close-landing-m.mp4',
    poster: '/media/close-landing-poster.webp',
    posterEnd: '/media/close-landing-poster-end.webp',
  },
} as const

export type MediaKey = keyof typeof media

export const MOBILE_MAX = 820

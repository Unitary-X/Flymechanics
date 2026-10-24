/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import '@fontsource-variable/inter'
import '@fontsource-variable/plus-jakarta-sans'
import appCss from '~/styles/app.css?url'
import interLatin from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url'
import jakartaLatin from '@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2?url'
import { site } from '~/content/site.content'
import { MotionProvider } from '~/components/motion/MotionProvider'
import { Header } from '~/components/layout/Header'
import { ScrollEngine } from '~/components/motion/ScrollEngine'
import { FlightHud } from '~/components/hud/FlightHud'
import { Atmosphere } from '~/components/fx/Atmosphere'
import { ParticleField } from '~/components/fx/ParticleField'
import { PointerFx } from '~/components/fx/PointerFx'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { title: 'Corporate travel management in Chennai | Flymechanics' },
      // Built only from approved copy: the descriptor and the tagline.
      { name: 'description', content: `${site.descriptor}. ${site.tagline}` },
      { name: 'theme-color', content: '#ffffff' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'preload', as: 'font', type: 'font/woff2', href: jakartaLatin, crossOrigin: 'anonymous' },
      { rel: 'preload', as: 'font', type: 'font/woff2', href: interLatin, crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <MotionProvider>
      <nav aria-label="Skip links">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
      </nav>
      <ScrollEngine />
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Atmosphere />
      <ParticleField />
      <FlightHud />
      <PointerFx />
    </MotionProvider>
  )
}

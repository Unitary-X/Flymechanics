import { createFileRoute } from '@tanstack/react-router'
import { site } from '~/content/site.content'
import { Opening } from '~/components/sections/Opening'
import { HandleScramble } from '~/components/sections/HandleScramble'
import { Navigator } from '~/components/sections/Navigator'
import { Services } from '~/components/sections/Services'
import { Approach } from '~/components/sections/Approach'
import { Faq } from '~/components/sections/Faq'
import { Contact } from '~/components/sections/Contact'

const SITE_URL = 'https://flymechanics.com'

// Structured data uses only confirmed facts: no address, no legal name, no unconfirmed answers (spec 15).
const organization = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Flymechanics',
  url: SITE_URL,
  telephone: '+919994426333',
  email: site.contact.email,
  areaServed: 'IN',
  openingHours: ['Mo-Fr 09:00-17:00', 'Sa 10:00-15:00'],
}
const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  // Questions whose answer still holds an owner marker are left out until confirmed.
  mainEntity: site.faq
    .filter((f) => !f.a.includes('[CONFIRM'))
    .map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}
const services = site.services.map((s) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: s.title,
  description: s.body,
  provider: { '@type': 'TravelAgency', name: 'Flymechanics', url: SITE_URL },
  areaServed: 'IN',
}))

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Flymechanics' },
      { property: 'og:title', content: 'Corporate travel management in Chennai | Flymechanics' },
      { property: 'og:description', content: `${site.descriptor}. ${site.tagline}` },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:image', content: `${SITE_URL}/og/og-default.jpg` },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: SITE_URL }],
    scripts: [organization, faqPage, ...services].map((d) => ({ type: 'application/ld+json', children: JSON.stringify(d) })),
  }),
  component: Home,
})

function Home() {
  return (
    <>
      <Opening />
      <HandleScramble />
      <Navigator />
      <Services />
      <Approach />
      <Faq />
      <Contact />
    </>
  )
}

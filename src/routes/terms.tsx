import { createFileRoute } from '@tanstack/react-router'
import { site } from '~/content/site.content'
import { LegalPage, type LegalSection } from '~/components/ui/LegalPage'

const regulated = site.services[5]

const sections: LegalSection[] = [
  {
    heading: 'About these terms',
    body: [
      `These terms cover the use of this website and the enquiries you send through it. ${site.brand} is the trading name used here. Legal entity: ${site.contact.legalEntity}`,
    ],
  },
  {
    heading: 'Quotes and services',
    body: [
      'Services are described on this website in general terms. What we provide, and at what price, is agreed with your company in a written quotation.',
      regulated.note,
      regulated.partners,
    ],
  },
  {
    heading: 'Information on this website',
    body: ['The content of this website is general information about our services. It is not an offer, and it is not advice for your particular situation.'],
  },
  {
    heading: 'Liability',
    body: ['[CONFIRM WITH LEGAL: limits on liability]'],
  },
  {
    heading: 'Governing law',
    body: ['[CONFIRM WITH LEGAL: governing law and where disputes are heard]'],
  },
  {
    heading: 'Contact',
    body: [`Questions about these terms: ${site.contact.email}`],
  },
]

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      { title: 'Terms | Flymechanics' },
      { name: 'description', content: 'Terms for using the Flymechanics website. Draft for legal review.' },
      { name: 'robots', content: 'noindex' },
    ],
    links: [{ rel: 'canonical', href: 'https://flymechanics.com/terms' }],
  }),
  component: () => <LegalPage title="Terms" sections={sections} />,
})

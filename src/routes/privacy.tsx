import { createFileRoute } from '@tanstack/react-router'
import { site } from '~/content/site.content'
import { LegalPage, type LegalSection } from '~/components/ui/LegalPage'

const sections: LegalSection[] = [
  {
    heading: 'Who we are',
    body: [
      `${site.brand} provides corporate travel management from Chennai, India.`,
      `Legal entity: ${site.contact.legalEntity}`,
      `Address: ${site.contact.address}`,
      `Contact: ${site.contact.email}`,
    ],
  },
  {
    heading: 'What we collect',
    body: [
      'When you send a quote request we collect the details you type into the form: your name, company, work email, phone number, the service you are interested in, travellers per month, and your message. We also keep a record that you agreed to be contacted.',
      '[CONFIRM WITH LEGAL: any analytics or cookies, and whether they run only after consent]',
    ],
  },
  {
    heading: 'Why we use it',
    body: ['We use these details to reply to your enquiry and to prepare a proposal for your company.'],
  },
  {
    heading: 'Consent and withdrawing it',
    body: [
      'We contact you about your enquiry because you agreed to it in the form. You can withdraw that agreement at any time by writing to us at the email address above.',
      '[CONFIRM WITH LEGAL: how a withdrawal is handled and how quickly]',
    ],
  },
  {
    heading: 'How long we keep it',
    body: ['[CONFIRM WITH LEGAL: retention period for enquiries]'],
  },
  {
    heading: 'Who we share it with',
    body: ['[CONFIRM WITH LEGAL: the service providers that process enquiries, such as the email provider and the enquiry store]'],
  },
  {
    heading: 'Your rights',
    body: ['[CONFIRM WITH LEGAL: your rights under the Digital Personal Data Protection Act 2023 and how to use them]'],
  },
  {
    heading: 'Grievances',
    body: ['[CONFIRM WITH LEGAL: grievance officer name and contact details]'],
  },
]

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      { title: 'Privacy Policy | Flymechanics' },
      { name: 'description', content: 'How Flymechanics handles the details you send in a quote request. Draft for legal review.' },
      { name: 'robots', content: 'noindex' },
    ],
    links: [{ rel: 'canonical', href: 'https://flymechanics.com/privacy' }],
  }),
  component: () => <LegalPage title="Privacy Policy" sections={sections} />,
})

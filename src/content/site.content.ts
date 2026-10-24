// Single content file. Copy is the owner's, from FLYMECHANICS_BUILD_SPEC.md section 6, verbatim.
// Do not reword. Every [CONFIRM ...] marker stays visible until the owner supplies verified information.
export const site = {
  brand: "Flymechanics",
  wordmark: "FLYMECHANICS.",
  descriptor: "Corporate travel management — Chennai, India",
  tagline: "Time flies. It's up to you to be the navigator.",
  cta: { quote: "Request a quote", whatsapp: "WhatsApp", email: "Email us" },

  statement: "We source the best method of transport and fares — so your people just travel.",
  modes: ["Air", "Rail", "Hotel and serviced apartments", "Car rental and chauffeur", "Ferry"],
  // Cargo, Bus and Fleet only after owner confirmation: [CONFIRM]

  handle: {
    label: "We handle:",
    list: [
      "Corporate travel",
      "Hotels and serviced apartments",
      "Online booking portal",
      "Conferences and events",
      "Group travel",
      "Traveller support",
    ],
    line: "A pro-active, hands-on approach with a clear focus on cost control.",
  },

  scramble: { first: "Time flies.", second: "It's up to you to be the navigator." },

  navigator: {
    eyebrow: "The navigator",
    title: "One team. Routes across the world.",
    body: "Regional, domestic and international air and rail — planned, booked and supported from Chennai.",
    captions: [
      "Chennai (Hub)",
      "Europe — London & Frankfurt",
      "Southeast Asia — Singapore",
      "North America — New York",
      "Four routes, one hub",
    ],
  },

  services: [
    {
      n: "01",
      title: "Corporate travel",
      body: "Individualised travel for companies and their people — technology plus personalised service, delivered by small, highly experienced teams. Regional, domestic and international air and rail, with us doing the hard work.",
      items: [
        "Dedicated account manager",
        "Air, rail, ferry and car bookings",
        "Monthly, quarterly or annual MIS reports",
        "Reconciliation and billing services",
      ],
      tags: "Air / Rail / Ferry / Car",
    },
    {
      n: "02",
      title: "Hotels and serviced apartments",
      body: "Access to a network of properties, with rates and booking confirmation handled for you.",
      items: ["Hotel bookings", "Serviced apartments", "Airport transfers", "Chauffeur drive"],
      tags: "Hotels / Apartments / Transfers",
    },
    {
      n: "03",
      title: "Online booking portal",
      body: "A bespoke portal customised to your travel and administration policies. Your travellers book directly — air, bus, ground transport and hotels — with approvals and consolidated billing built in.",
      items: ["Policy-based booking", "Manager approvals", "Consolidated billing", "Tailored self-booking tool"],
      tags: "Portal / Approvals / Billing",
    },
    {
      n: "04",
      title: "Conferences and events",
      body: "From a boardroom table for two to large delegate events. Concept, pricing and inspection through to delivery.",
      items: ["Venue finding", "Rate negotiation", "End-to-end project management", "Duty of care management"],
      tags: "Meetings / Conferences / Events",
    },
    {
      n: "05",
      title: "Group travel",
      body: "Special-interest groups, sightseeing tours, sports tournaments or family celebrations — itinerary creation, handling expertise and an escort when appropriate.",
      items: ["Itinerary creation", "Group accommodation", "Team building and hospitality", "Group escort when appropriate"],
      tags: "Groups / Tours / Teams",
    },
    {
      n: "06",
      title: "Traveller support",
      body: "Documentation and assistance so your people travel with peace of mind.",
      items: [
        "Visa and passport assistance",
        "Attestation and apostille",
        "Foreign exchange consultancy",
        "Overseas mediclaim policy",
        "Travel vaccination advice",
        "Meet and greet",
      ],
      note: "Foreign exchange, overseas mediclaim and visa assistance are scoped at the time of quotation. Travel vaccination information is general guidance, not medical advice.",
      partners: "[CONFIRM WITH OWNER / LEGAL: licensed partner names and scope for each regulated service]",
      tags: "Documents / Money / Cover",
    },
  ],
  deliverablesLabel: "( Deliverables )",

  approach: {
    label: "( Approach )",
    statement:
      "A pro-active, hands-on approach with a clear focus on cost control. You stay in control of company travel spend.",
    columns: [
      { t: "Data", d: "Data reporting and MIS analysis, reconciliation, post-event budget analysis and satisfaction surveys." },
      { t: "Experience", d: "An experienced, knowledgeable team, personal and flexible solution management, strong vendor relationships." },
      { t: "Value", d: "Competitive fares and rates, content from multiple sources, one point of contact for everything." },
    ],
  },

  faq: [
    { q: "Who do you work with?", a: "A portfolio of customers, from large-scale organisations to SMEs with smaller teams and budgets." },
    { q: "Which travel classes do you cover?", a: "Business, economy and low-cost travel — we look for the most cost-effective route for every trip." },
    { q: "How do we keep track of spend?", a: "Clear invoicing and fare-savings reports, monthly, quarterly or annually, plus tailored management reporting." },
    { q: "What if something goes wrong outside office hours?", a: "Emergency assistance outside office hours: [CONFIRM number, hours and any call charges]." },
    // Add: fees, response time, onboarding: [CONFIRM answers]
  ],

  close: {
    heading: "Let's fly.",
    sub: "We're here to take your corporate travel to the next level. Reach out directly or request a customised proposal for your company.",
  },

  contact: {
    phoneDisplay: "+91 99944 26333",
    phoneHref: "tel:+919994426333",
    email: "info@flymechanics.com",
    whatsapp: "https://wa.me/919994426333", // [CONFIRM it is a WhatsApp number]
    hours: ["Monday to Friday: 9:00 to 17:00", "Saturday: 10:00 to 15:00", "Sunday: closed"],
    tz: "Indian Standard Time",
    address: "[CONFIRM FULL ADDRESS]",
    mapPin: "[CONFIRM] one verified pair; label: Flymechanics office",
    legalEntity: "[CONFIRM legal name and LLPIN]",
  },
  proof: {
    years: "[YEARS IN BUSINESS]",
    clients: "[NUMBER OF CLIENTS]",
    logos: "[CLIENT LOGOS]",
    testimonials: "[TESTIMONIALS]",
    accreditations: "[ACCREDITATIONS only if held]",
    leadership: "[LEADERSHIP NAMES]",
  },
} as const

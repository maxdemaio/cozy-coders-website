// Pricing page content. One place to edit the offer; the page only lays it out.
// Shape after kojo.design/pricing (decided 2026-10-23): monthly subscriptions that stack,
// a free first week, pause or cancel any time; one-off projects as the exception, not the rule.
//
// PLACEHOLDER NUMBERS: the prices below were drafted to give the page its shape and have
// not been decided. Replace them before this goes live, then delete this note.

export const intro = {
  eyebrow: "pricing",
  title: "Plans for every size.",
  lede: "One week free on every plan. Pause or cancel any time, no contract, no notice period.",
};

export interface Plan {
  slug: string;
  /** mono uppercase chip */
  name: string;
  /** second chip, three words */
  tag: string;
  /** one line under the chips, what the plan is for */
  blurb: string;
  /** shown in the sans at 44px; the unit sits after it, faded */
  price: string;
  unit: string;
  /** "Everything in X, plus:" line above the list, when it stacks */
  plus?: string;
  includes: string[];
  /** small mono line next to the button */
  note: string;
  cta: string;
  featured?: boolean;
}

export const plans: Plan[] = [
  {
    slug: "advice",
    name: "Advice",
    tag: "a designer on call",
    blurb: "Design and UX help wherever you need it, without a project attached.",
    price: "995",
    unit: "/ month",
    includes: [
      "Reply within a working day, Monday to Friday",
      "Reviews of your site, app or deck, with fixes marked up",
      "Moodboards and direction before you commit to a build",
      "Copy and SEO notes on pages you're shipping",
      "A second opinion on hires, tools and vendors",
    ],
    note: "no minimum term",
    cta: "Get started",
  },
  {
    slug: "design",
    name: "Design",
    tag: "one request at a time",
    blurb: "As much design as you can use, one thing at a time, delivered every day or two.",
    price: "4,500",
    unit: "/ month",
    plus: "Everything in Advice, plus:",
    includes: [
      "Product, brand, print and marketing design in Figma",
      "Sales and pitch decks you can edit yourself",
      "Illustration, icons and photo selection to match",
      "A shared board where you queue and reorder requests",
      "View access to every file for your whole team",
    ],
    note: "deliverables every 24 to 48 hours",
    cta: "Get started",
    featured: true,
  },
  {
    slug: "design-code",
    name: "Design & code",
    tag: "live & fast",
    blurb: "The same, plus the code to match: pages that ship, not mockups that wait.",
    price: "8,500",
    unit: "/ month",
    plus: "Everything in Design, plus:",
    includes: [
      "Marketing pages built in Astro, loading in under a second",
      "A component library in React and Tailwind, in your brand",
      "Hosting set up and managed, on your accounts",
      "Analytics, forms and share cards wired in",
      "Handover as a GitHub repo with deploy notes, any time",
    ],
    note: "pause when you've shipped",
    cta: "Get started",
  },
];

export const oneOff = {
  name: "One-off project",
  tag: "when a plan doesn't fit",
  blurb:
    "We take a few one-off projects a year, usually a site or a brand, scoped and priced before any work starts. Most teams find a month on a plan, paused after shipping, costs less.",
  range: "$6,000 to $15,000",
  includes: [
    "A fixed number after the intro call, not an estimate",
    "Half to start, half at launch",
    "Thirty days of fixes after launch, included",
    "Unused days roll into future work at no charge",
  ],
  cta: "Tell us about it",
};

export const faqs: { q: string; a: string }[] = [
  {
    q: "What does \"one request at a time\" mean?",
    a: "You can queue as many requests as you like; we work on one at a time and most are back within a day or two. Bigger pieces are split into steps you'll see as they land. It keeps the quality up and the queue honest.",
  },
  {
    q: "Which plan do I need for a website?",
    a: "Most teams start on Design, then move to Design & code when the pages are ready to build, and pause once it's live. Upgrades are prorated, so you only pay the difference for the days left in the month.",
  },
  {
    q: "What does pausing mean?",
    a: "If you don't have work for us this month, pause. Billing stops, the days you've paid for and not used stay on your account, and you pick up where you left off whenever you're ready.",
  },
  {
    q: "How long does a website take?",
    a: "About a month: roughly two weeks of design and two of build, with something to look at every day or two. A one-pager is faster; a site with a lot of content takes longer, mostly waiting on the content.",
  },
  {
    q: "Do you do full-stack development?",
    a: "Not on a plan. We build what people see: marketing sites, component libraries, and front ends that match the design exactly. Business logic, APIs and databases stay with your team, or come in as a scoped one-off if there's nobody to hand them to.",
  },
  {
    q: "How do we work together?",
    a: "Mostly async. A shared Slack channel or email thread, a board where you queue requests, and a call when a call is faster. We're in Massachusetts and reply within a working day.",
  },
  {
    q: "Who owns the work?",
    a: "You do. Figma files can be moved into your workspace at any time, code is handed over as a GitHub repository with deploy notes, and hosting and domains live in your accounts.",
  },
  {
    q: "What do you need to get started?",
    a: "A rough idea of what you're after, a few sites or products you like, and whatever you already have: a logo, copy, an old site. We can start the first week with less than that.",
  },
  {
    q: "What if I don't like the result?",
    a: "The first week is free, so either of us can walk away before any money changes hands. After that we keep revising until it's right. We don't offer refunds on paid months.",
  },
  {
    q: "Why not hire a designer?",
    a: "You should, when there's a full-time job to do. Until then a designer and an engineer on payroll cost well into six figures a year, and take months to find. A plan starts next week and stops when you say.",
  },
];

// Pricing page content. One place to edit the offer; the page only lays it out.
//
// PLACEHOLDER NUMBERS (2026-10-23): the prices below were drafted to give the page its shape
// and have not been decided. Replace them before this goes live, then delete this note.

export interface Package {
  slug: string;
  /** mono uppercase chip */
  name: string;
  /** second chip, what it is in three words */
  tag: string;
  /** "from $X" or "$X / month" as shown; keep the number in `price`, the unit in `unit` */
  price: string;
  unit: string;
  /** one line under the price */
  blurb: string;
  /** what's inside, four to six lines, each a thing the client can point at */
  includes: string[];
  /** how long, in their words */
  timeline: string;
  featured?: boolean;
}

export const packages: Package[] = [
  {
    slug: "site",
    name: "Website",
    tag: "live & fast",
    price: "6,000",
    unit: "from",
    blurb: "A marketing site that loads in under a second and that you can edit yourself.",
    includes: [
      "Design you can sit in on, with comments on the page",
      "Up to six pages, built in Astro, hosted where you like",
      "A CMS or plain files, your call, with a walkthrough",
      "Analytics, forms and the boring launch checklist done",
      "Found on Google: metadata, sitemap, share cards",
    ],
    timeline: "Three to five weeks",
  },
  {
    slug: "brand-site",
    name: "Brand + site",
    tag: "looks like one company",
    price: "12,000",
    unit: "from",
    blurb: "Logo, colours, type and the rules for them, then the site built on top so it all matches.",
    includes: [
      "Everything in Website",
      "Wordmark and mark, with the files for print and screen",
      "Colour and type system with a one-page brand guide",
      "Templates for the deck, the email signature and social",
      "A second round on anything that doesn't feel right",
    ],
    timeline: "Six to eight weeks",
    featured: true,
  },
  {
    slug: "app",
    name: "App",
    tag: "something people use",
    price: "15,000",
    unit: "from",
    blurb: "A web app or an internal tool, designed and built by the same two people, scoped before we start.",
    includes: [
      "A scoping week first, so the number is a number",
      "Product design in the open, clickable before it's built",
      "Built on a boring, maintained stack we'll name up front",
      "Accounts, payments or data where you need them",
      "Handover with docs, or keep us on the retainer",
    ],
    timeline: "Scoped per project",
  },
];

export const retainer = {
  name: "Retainer",
  tag: "someone who answers",
  price: "2,500",
  unit: "/ month",
  blurb:
    "For when the site is live and you want it to keep getting better. A fixed number of days a month, a shared channel, and no ticket queue.",
  includes: [
    "Four working days a month, rolled over once",
    "Design and engineering, whichever the week needs",
    "A shared Slack or email thread with a reply inside a working day",
    "Monthly note on what shipped and what's next",
    "Pause or stop with a month's notice",
  ],
  slots: "Taking on a limited number of slots for Q4.",
};

export const faqs: { q: string; a: string }[] = [
  {
    q: "Why \"from\"?",
    a: "Because a six-page site and a sixty-page site aren't the same job. We'll give you a fixed number after the intro call, before any work starts, and it stays fixed unless the scope changes.",
  },
  {
    q: "What do you need from us?",
    a: "Someone who can make decisions, your existing logo and copy if you have them, and about an hour a week for comments and calls. We write copy with you if you don't have any.",
  },
  {
    q: "Who owns the work?",
    a: "You do, from the day the last invoice is paid. Design files, code, the domain and the hosting are all in your accounts, not ours.",
  },
  {
    q: "What happens after launch?",
    a: "Thirty days of fixes are included on every project. After that you can edit the site yourself, call us for one-off work, or go on the retainer.",
  },
  {
    q: "Do you work with agencies or only direct?",
    a: "Both. If you're an agency we can be the engineering half, or the whole thing under your name.",
  },
  {
    q: "How do we pay?",
    a: "Half to start, half at launch, by bank transfer or card. The retainer is billed at the start of each month.",
  },
];

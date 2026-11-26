// Single source of truth for what Despacho Bonsai sells. The homepage, its brief builder, the JSON-LD and /llms.txt
// all read this file, so they can't drift apart.
// Campaign rules (2026-11, v2): sell the product loop, not the code. Buyers are founders/CTOs doing product themselves
// and product leaders whose PMs write tickets. One action: book a call (US buyers); WhatsApp and email stay as quiet
// alternatives. No public prices, no founder name on the site.

export const ORG = {
  name: 'Despacho Bonsai',
  url: 'https://despachobonsai.com',
  descriptor: 'embedded product management studio',
  tagline: 'Full-stack product managers',
  oneLiner: 'Full-stack product managers, embedded in your team: from user feedback to shipped, tested, measured releases. In your tools, under your method. Mexico City, on US time.',
  email: 'hola@despachobonsai.com',
  location: 'Mexico City, Mexico',
  serves: 'US and English-speaking startups and product teams',
  hours: '9am–6pm US Central, Monday to Friday',
  whatsapp: '525572953673',
  booking: 'https://cal.com/despachobonsai/bonsaidiscovery',
} as const;

/** Official profiles. Used for JSON-LD sameAs (ties the brand together for search engines) and the footer. */
export const SOCIAL = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/despacho-bonsai' },
  { name: 'Instagram', url: 'https://www.instagram.com/despachobonsai' },
  { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61572082478661' },
] as const;

export const waLink = (text: string) => `https://wa.me/${ORG.whatsapp}?text=${encodeURIComponent(text)}`;

/** The product loop we run end to end. Rendered as numbered tiles: the order is the point. */
export const LOOP = [
  { n: '01', h: 'Feedback', p: 'We read what users say in support, calls, reviews and data, and turn it into a short list of real problems.' },
  { n: '02', h: 'Decide', p: 'With you, we pick the one bet worth making this cycle, and write down what success would look like.' },
  { n: '03', h: 'Spec', p: 'A clear spec your team, or our agents, can build from. Scope, edge cases, and what we are not doing.' },
  { n: '04', h: 'Build', p: 'We build it with AI agents, in your repo, reviewed by a human. Or we hand it to your engineers, ready to go.' },
  { n: '05', h: 'Test', p: 'Tested before release and behind a switch, so it ships safely and can be turned off.' },
  { n: '06', h: 'Report', p: 'Did it move the number? A plain report your board can read, and the next bet it points to.' },
] as const;

/** Two ways to buy the same practice. */
export const MODES = [
  { h: 'Embed', p: 'We run the loop for you, inside your team. For a founder doing product at night, or a roadmap waiting on a PM hire.' },
  { h: 'Upskill', p: 'We pair with your product managers on real roadmap items until they can take a ticket all the way to a measured release.' },
] as const;

export const STEPS = [
  { n: '01', h: 'Tell us what’s stuck', p: 'Book a 20-minute call, or scope it below in about a minute. A senior product manager answers. Not a bot, not a sales rep.' },
  { n: '02', h: 'Get a plan for the first bet', p: 'What we would tackle first, how we would measure it, and a fixed price for the first milestone. Within a day of the call.' },
  { n: '03', h: 'We embed and ship', p: 'In your tools and under your method, with a weekly report. Every spec, decision and release note stays yours.' },
] as const;

export const WORK = [
  { name: 'Golden Frijoles', kind: 'AI product practice', p: 'The kit we run our own work on: AI agents that plan, build, review and report on product bets, with a record of which ones paid off.', url: 'https://goldenfrijoles.com' },
  { name: 'Miyagi Sánchez', kind: 'Marketplace', p: 'A no-commission marketplace for Mexico: listings, accounts, search and messaging, live in production.', url: 'https://miyagisanchez.com' },
  { name: 'Dineros', kind: 'Data product', p: 'Mexico’s public spending explained in plain language, built from official government data.', url: 'https://dineros.despachobonsai.com' },
  { name: 'Battle for La Roma', kind: 'Browser game', p: 'A real-time strategy game that runs in the browser and on macOS.', url: 'https://battle-for-la-roma.pages.dev/' },
] as const;

/** Written as the questions buyers actually ask. Rendered on the page and as FAQPage JSON-LD. No prices, ever. */
export const FAQ = [
  { q: 'Who will I work with?',
    a: 'A senior product manager who also builds. The person on the first call is the person who runs your work.' },
  { q: 'How is this different from hiring a PM or an agency?',
    a: 'A PM hire takes months and usually stops at the spec. An agency builds what you ask for. We own the whole loop, from user feedback to a measured release, and we work inside your team instead of next to it.' },
  { q: 'Do you replace our engineers?',
    a: 'No. If you have engineers, we hand them clear, ready-to-build specs and review what ships. If you don’t, we build with AI agents and a human reviews every change.' },
  { q: 'Can you train our own PMs instead?',
    a: 'Yes. We pair with them on real items from your roadmap, not a course, until they can take a ticket to a tested, measured release on their own.' },
  { q: 'How do you price?',
    a: 'A fixed price per milestone, or a monthly price for an ongoing embed. Agreed on the call before we start.' },
  { q: 'Do we keep everything?',
    a: 'Yes. We work in your tools, your repo and your accounts, under your methodology. Specs, decisions, release notes and reports all stay with you.' },
  { q: 'Where are you, and do you work US hours?',
    a: 'Mexico City, which is on US Central time all year. We work 9am–6pm Central, Monday to Friday, which overlaps with every US time zone.' },
] as const;

/* ---------- Brief builder ("Scope it in 60 seconds"): options a buyer taps instead of an empty text box ---------- */

export const STAGES = [
  { id: 'decisions', label: 'Product decisions wait on me', sum: 'Product decisions are bottlenecked on me, and the team waits or builds the wrong thing', done: 'A product loop that runs without you in every decision: a clear next bet, shipped and measured, with a weekly report.' },
  { id: 'hiring', label: 'We’re hiring a PM', sum: 'We are hiring a product manager and the roadmap is waiting', done: 'The roadmap keeps moving while you hire, and your new PM inherits a working practice instead of a backlog.' },
  { id: 'team', label: 'Our PMs need to ship with AI', sum: 'Our product managers write tickets, and we want them shipping with AI agents', done: 'PMs who can take a ticket all the way to a tested, measured release, on your real roadmap.' },
  { id: 'idea', label: 'We have something to build', sum: 'We have a product or feature to build and need someone to own it end to end', done: 'The first version live, with users on it and a number that tells you whether it worked.' },
] as const;

export const NEEDS = [
  { id: 'feedback', label: 'Making sense of user feedback', items: ['Pull feedback from support, calls, reviews and data into one place', 'A short, ranked list of real problems'] },
  { id: 'roadmap', label: 'Deciding what to build next', items: ['One bet per cycle, with the reason written down', 'What success looks like, before anything is built'] },
  { id: 'specs', label: 'Clear specs', items: ['Specs your engineers or our agents can build from', 'Scope, edge cases and what we are not doing'] },
  { id: 'build', label: 'Building it', items: ['Built with AI agents in your repo, reviewed by a human', 'Or handed to your engineers, ready to go'] },
  { id: 'quality', label: 'Safe releases', items: ['Tests before release', 'Features behind a switch, so they can be turned off'] },
  { id: 'metrics', label: 'Knowing if it worked', items: ['The metric each release should move', 'A readout two weeks after it ships'] },
  { id: 'reporting', label: 'Board and investor reporting', items: ['Numbers with a source, not a debate', 'A plain monthly report'] },
  { id: 'process', label: 'Rituals and paper trail', items: ['Lightweight planning and review rhythm', 'Specs, decisions and release notes in your tools'] },
  { id: 'upskill', label: 'Training our PMs', items: ['Pairing on real roadmap items', 'The workflow, templates and habits, left behind'] },
  { id: 'prototype', label: 'Turning a prototype into a product', items: ['From an AI-built demo to something real users rely on', 'Security, data and payments checked first'] },
  { id: 'unsure', label: 'Not sure yet', items: ['A short call to find the first thing worth fixing'] },
] as const;

export const TOOLS = ['Jira', 'Linear', 'Notion', 'GitHub', 'Asana / ClickUp', 'Nothing formal', 'Not sure'] as const;

export const WHEN = [
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
  { id: 'quarter', label: 'In the next few months' },
  { id: 'exploring', label: 'Just exploring' },
] as const;

/** Landing variants: each ad links to /?v=<id>. The headline matches the ad and the brief arrives preselected.
 *  `dot` is the one word set in dot-matrix on an acid block; it must appear verbatim in h1.
 *  founder = ad A2, hiring = ad A3, team = ads B1/B2. */
export const VARIANTS: Record<string, { eyebrow: string; h1: string; dot: string; sub: string; stage?: string; needs?: string[]; wa: string }> = {
  default: { eyebrow: 'Full-stack product managers · Mexico City, on US time', h1: 'Product management that ships.', dot: 'management', sub: 'From user feedback to measured releases.',
    wa: 'Hi Despacho Bonsai, I’d like to talk about product help for my team.' },
  founder: { eyebrow: 'For founders doing product after hours', h1: 'Code is cheap. Judgment isn’t.', dot: 'Judgment', sub: 'We own what gets built, and whether it worked.',
    stage: 'decisions', needs: ['feedback', 'roadmap'], wa: 'Hi Despacho Bonsai, product decisions are stuck on me. Can we talk?' },
  hiring: { eyebrow: 'For teams with an open PM role', h1: 'Hiring a PM? Keep shipping while you search.', dot: 'shipping', sub: 'A full-stack PM from week one.',
    stage: 'hiring', needs: ['roadmap', 'specs'], wa: 'Hi Despacho Bonsai, we’re hiring a PM and need someone running product meanwhile.' },
  team: { eyebrow: 'For product leaders', h1: 'Make your product managers full-stack.', dot: 'full-stack.', sub: 'From writing tickets to shipping releases.',
    stage: 'team', needs: ['upskill', 'build'], wa: 'Hi Despacho Bonsai, I lead a product team and want our PMs shipping with AI agents.' },
};

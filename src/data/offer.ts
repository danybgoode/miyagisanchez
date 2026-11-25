// Single source of truth for what Despacho Bonsai sells. The homepage, its brief builder, the JSON-LD and /llms.txt
// all read this file, so they can't drift apart.
// Campaign rules (2026-11): developer language, one action (WhatsApp), no public prices, no founder name on the site.

export const ORG = {
  name: 'Despacho Bonsai',
  url: 'https://despachobonsai.com',
  descriptor: 'AI engineering studio',
  oneLiner: 'An AI engineering studio in Mexico City, on US time. Senior engineers who build MVPs, fix AI-built apps, add AI features and ship the hard parts: login, payments, deploy and scale.',
  email: 'hola@despachobonsai.com',
  location: 'Mexico City, Mexico',
  serves: 'US and English-speaking startups and small businesses',
  hours: '9am–6pm US Central, Monday to Friday',
  whatsapp: '525572953673',
  booking: 'https://cal.com/despachobonsai/bonsaidiscovery',
} as const;

export const waLink = (text: string) => `https://wa.me/${ORG.whatsapp}?text=${encodeURIComponent(text)}`;

/** What we do, in the words buyers search with ("hire developer", "MVP development"). */
export const SERVICES = [
  { h: 'Build your MVP', p: 'From idea to a first version real users can sign up for and pay for.' },
  { h: 'Fix an AI-built app', p: 'Made it with Lovable, Bolt, Replit or Cursor? We make it secure, stable and ready for customers.' },
  { h: 'Add AI features', p: 'Assistants, search, automations. Tested on your real data, with costs you can predict.' },
  { h: 'Ship the hard parts', p: 'Login, payments, databases, deploys, integrations, speed.' },
  { h: 'Extra hands while you hire', p: 'Keep shipping while you look for your own engineers or product lead.' },
] as const;

export const STEPS = [
  { n: '01', h: 'Tell us what you need', p: 'On WhatsApp, or scope it below in about a minute. A senior engineer answers. Not a bot, not a sales rep.' },
  { n: '02', h: 'Get a plan the same day', p: 'What we would build, how, and in which order, with a fixed price for the first milestone. All in the chat.' },
  { n: '03', h: 'See it live, fast', p: 'We start small and ship something you can click within days. You own the code from day one.' },
] as const;

export const WORK = [
  { name: 'Miyagi Sánchez', kind: 'Marketplace', p: 'A no-commission marketplace for Mexico: listings, accounts, search and messaging, live in production.', url: 'https://miyagisanchez.com' },
  { name: 'Golden Frijoles', kind: 'AI product tool', p: 'Agentic product management: AI agents that plan, build and report on software work.', url: 'https://goldenfrijoles.com' },
  { name: 'Dineros', kind: 'Data site', p: 'Mexico’s public spending explained in plain language, built from official government data.', url: 'https://dineros.despachobonsai.com' },
  { name: 'Battle for La Roma', kind: 'Browser game', p: 'A real-time strategy game that runs in the browser and on macOS.', url: 'https://battle-for-la-roma.pages.dev/' },
] as const;

/** Written as the questions buyers actually ask. Rendered on the page and as FAQPage JSON-LD. No prices, ever. */
export const FAQ = [
  { q: 'Who will I be talking to?',
    a: 'A senior engineer from the studio, from the first message. The person who scopes your project is the person who builds it.' },
  { q: 'How do you price?',
    a: 'A fixed price per milestone, agreed in the chat before we start. Small jobs are welcome: a bug, a deploy, a single feature.' },
  { q: 'Can you work on an app I built with AI tools?',
    a: 'Yes, that is a big part of what we do. Apps built with Lovable, Bolt, Replit, v0 or Cursor often work in a demo but leak data, break on payments or fall over with real users. We check for that first, then fix it.' },
  { q: 'Do I own the code?',
    a: 'Yes. Everything lives in your repository and your accounts from day one.' },
  { q: 'Where are you, and do you work US hours?',
    a: 'Mexico City, which is on US Central time all year. We reply 9am–6pm Central, Monday to Friday, which overlaps with every US time zone.' },
  { q: 'What is an AI engineering studio?',
    a: 'Senior engineers who use AI agents for the legwork (code, tests, reviews), so you get more done for the same budget. A human makes every decision and reviews every change.' },
] as const;

/* ---------- Brief builder ("Scope it in 60 seconds"): options a buyer taps instead of an empty text box ---------- */

export const STAGES = [
  { id: 'idea', label: 'Just an idea', sum: 'We have an idea and need the first version built', done: 'A first version live on your domain, that real users can sign up for and use.' },
  { id: 'prototype', label: 'An AI-built prototype', sum: 'We have an AI-built prototype and need it production-ready', done: 'The same app, now secure, tested and running in production, ready for paying customers.' },
  { id: 'live', label: 'A live product', sum: 'We have a live product and need more built or fixed', done: 'The new work shipped to your users, without breaking what already works.' },
  { id: 'hiring', label: 'Hiring, need help meanwhile', sum: 'We are hiring and need to keep shipping in the meantime', done: 'The roadmap keeps moving, and your new hire inherits clean, documented work.' },
] as const;

export const NEEDS = [
  { id: 'auth', label: 'Login & accounts', items: ['Sign-up, sign-in and password reset', 'Roles and permissions', 'Sessions that expire safely'] },
  { id: 'payments', label: 'Payments', items: ['Checkout or subscriptions', 'Webhooks so payments and your database always agree', 'Receipts, refunds and failed cards', 'Switching from test mode to live'] },
  { id: 'deploy', label: 'Deploy & hosting', items: ['A production environment with its own secrets', 'Your domain with HTTPS', 'Automatic deploys from your repo, with a way to roll back'] },
  { id: 'data', label: 'Database', items: ['A data model that holds up as you grow', 'Access rules so users only ever see their own data', 'Backups and safe migrations'] },
  { id: 'ai', label: 'AI feature', items: ['The model behind a clean, swappable interface', 'Tests on real examples, so quality is measured, not guessed', 'Cost and rate limits', 'A fallback for when the model fails'] },
  { id: 'mobile', label: 'Mobile app', items: ['iOS and Android, or a mobile web app if that is enough', 'App Store and Google Play submission'] },
  { id: 'admin', label: 'Admin dashboard', items: ['Screens for your team to manage users, content and orders', 'Exports and basic reports'] },
  { id: 'integrations', label: 'Integrations', items: ['Connections to the tools you already use (CRM, email, Slack, APIs)', 'Retries and alerts when something fails'] },
  { id: 'speed', label: 'Speed & scale', items: ['Find the slow pages and queries', 'Caching where it pays off', 'A load test before launch'] },
  { id: 'security', label: 'Security review', items: ['Check for exposed keys, open database rules and injection', 'A written list of fixes, worst first'] },
  { id: 'design', label: 'Design polish', items: ['Consistent screens that work on mobile', 'Empty, loading and error states'] },
  { id: 'unsure', label: 'Not sure yet', items: ['A short call to find the first thing worth building'] },
] as const;

export const TOOLS = ['Lovable', 'Bolt', 'Replit', 'v0', 'Cursor / Claude Code', 'Bubble / no-code', 'Custom code', 'Nothing yet', 'Not sure'] as const;
export const AI_TOOLS = ['Lovable', 'Bolt', 'Replit', 'v0', 'Cursor / Claude Code'] as const;

export const WHEN = [
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
  { id: 'quarter', label: 'In the next few months' },
  { id: 'exploring', label: 'Just exploring' },
] as const;

/** Landing variants: each ad links to /?v=<id>. The headline matches the ad and the brief arrives preselected.
 *  `dot` is the one word set in dot-matrix (DB Matriz) on an acid block; it must appear verbatim in h1. */
export const VARIANTS: Record<string, { eyebrow: string; h1: string; dot: string; sub: string; stage?: string; needs?: string[]; wa: string }> = {
  default: { eyebrow: 'AI engineering studio · Mexico City, on US time', h1: 'Need a developer? Talk to one now.', dot: 'developer?',  sub: 'Senior engineers. Shipped fast.',
    wa: 'Hi Despacho Bonsai, I need help with a software project.' },
  stuck: { eyebrow: 'Built it with AI? Good start.', h1: 'Your app works in the demo. We make it work for customers.', dot: 'customers.',  sub: 'Production-ready, fast.',
    stage: 'prototype', needs: ['deploy', 'security'], wa: 'Hi Despacho Bonsai, I built an app with AI tools and need it production-ready.' },
  build: { eyebrow: 'From idea to first users', h1: 'Have an idea? We’ll build the first version.', dot: 'idea?',  sub: 'Live in weeks, not quarters.',
    stage: 'idea', needs: ['auth', 'deploy'], wa: 'Hi Despacho Bonsai, I have an idea and need the first version built.' },
  ai: { eyebrow: 'AI features that hold up', h1: 'Add AI to your product. The right way.', dot: 'AI',  sub: 'Tested, costed, in production.',
    stage: 'live', needs: ['ai'], wa: 'Hi Despacho Bonsai, I want to add an AI feature to my product.' },
  hire: { eyebrow: 'For teams with an open role', h1: 'Hiring engineers? Keep shipping while you search.', dot: 'shipping',  sub: 'Senior hands from Monday.',
    stage: 'hiring', wa: 'Hi Despacho Bonsai, we are hiring and need help shipping in the meantime.' },
};

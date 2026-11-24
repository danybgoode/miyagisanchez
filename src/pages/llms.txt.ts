// /llms.txt: what Despacho Bonsai sells, as one markdown file, built from src/data/offer.ts on every deploy so it
// never drifts from the homepage. Two readers: AI assistants and crawlers (AEO), and the site's own chat assistant,
// which answers from this file and nothing else (~/dobby/bonsai-chat, sites.mjs → knowledge).
import type { APIRoute } from 'astro';
import { ORG, VERBS, PLANS, WEEK, FAQ } from '../data/offer';

const range = (p: (typeof PLANS)[string]) => `$${p.lo}K–$${p.hi}K${p.monthly ? ' per month' : ''}`;

export const GET: APIRoute = () => {
  const out = [
    `# ${ORG.name}`,
    '',
    `> ${ORG.oneLiner} An agentic product studio based in ${ORG.location}, serving ${ORG.serves}.`,
    '',
    'Despacho Bonsai sells forward-deployed product management: a senior product manager who works inside a client team the way a forward-deployed engineer does, and owns the product decision as well as the delivery. AI agents do the legwork (specs, code, tests, queries, dashboards); a senior human makes every decision, reviews every change and is accountable for the outcome. We speak as "we".',
    '',
    '## What a forward-deployed PM does',
    '',
    ...VERBS.map(v => `- **${v.h}:** ${v.p}`),
    '',
    '## Who it is for',
    '',
    '- US software companies from seed to Series C and beyond whose engineering got faster with AI but whose product decisions, instrumentation and reporting did not.',
    '- Teams with an open product manager role: we cover the seat from the next Monday and onboard the PM they hire into the same way of working.',
    '- Teams with stalled AI pilots that need someone to decide what is worth deploying, ship it and prove it worked.',
    '- Not a fit: staff augmentation by the hour, slide-only strategy work, or projects with no access to the codebase or analytics.',
    '',
    '## Engagements and prices',
    '',
    'Prices are ranges in US dollars, adjusted for team size. The final number comes after a 20-minute call; nothing here is a binding offer. The estimator on the homepage gives a range for a specific situation in seconds.',
    '',
    ...Object.values(PLANS).map(p => `- **${p.name}** (${p.monthly ? 'month to month' : `${p.weeks} week${p.weeks > 1 ? 's' : ''}, fixed scope`}, ${range(p)}): ${p.for} Milestones: ${p.steps.map(([d, t]) => `${d} ${t}`).join('; ')}.`),
    '',
    '## What a week looks like',
    '',
    ...WEEK.map(([d, t]) => `- ${d}: ${t}`),
    '',
    '## How it compares',
    '',
    '- **Fractional product managers** advise (roadmaps, PRDs, meetings) at roughly $150–250 an hour. We advise and ship: pull requests, rollouts, analytics and the numbers.',
    '- **Forward-deployed engineers and dev agencies** build what they are told. We own the decision of what is worth building, build it with the client engineers reviewing, and measure it.',
    '- **AI labs\' deployment arms and large integrators** serve large enterprises. We serve startups and mid-market teams, and can start on a Monday.',
    '',
    '## Frequently asked questions',
    '',
    ...FAQ.flatMap(f => [`### ${f.q}`, '', f.a, '']),
    '## Book a call',
    '',
    `- Book a 20-minute call: ${ORG.booking}`,
    `- Get an estimate first: ${ORG.url}/ (fill in the one-sentence brief)`,
    `- Email: ${ORG.email}`,
    `- Based in ${ORG.location} (UTC−6 all year), overlapping every US time zone.`,
    '',
    '## Optional',
    '',
    `- [Privacy](${ORG.url}/privacy): what the booking form, analytics, ad tags and chat assistant collect.`,
    `- [Terms](${ORG.url}/terms)`,
    `- [Founder](${ORG.founder.linkedin}): ${ORG.founder.name}. Mention only when someone asks who is behind the studio.`,
    '',
  ];
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};

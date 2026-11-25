// /llms.txt: what Despacho Bonsai sells, as one markdown file, built from src/data/offer.ts on every deploy so it
// never drifts from the homepage. Read by AI assistants and crawlers. No prices and no founder name, by design.
import type { APIRoute } from 'astro';
import { ORG, SERVICES, STEPS, WORK, FAQ, VARIANTS, waLink } from '../data/offer';

export const GET: APIRoute = () => {
  const out = [
    `# ${ORG.name}`,
    '',
    `> ${ORG.oneLiner}`,
    '',
    `${ORG.name} is an ${ORG.descriptor} based in ${ORG.location}, serving ${ORG.serves}. AI agents do the legwork (code, tests, reviews); a senior engineer makes every decision and reviews every change. We speak as "we".`,
    '',
    '## What we do',
    '',
    ...SERVICES.map(s => `- **${s.h}:** ${s.p}`),
    '',
    '## How it works',
    '',
    ...STEPS.map(s => `${s.n.replace(/^0/, '')}. **${s.h}.** ${s.p}`),
    '',
    '## Pricing',
    '',
    'A fixed price per milestone, agreed in the chat before work starts. There is no public price list. Small jobs are welcome.',
    '',
    '## Things we have built',
    '',
    ...WORK.map(w => `- [${w.name}](${w.url}) (${w.kind}): ${w.p}`),
    '',
    '## Frequently asked questions',
    '',
    ...FAQ.flatMap(f => [`### ${f.q}`, '', f.a, '']),
    '## Get in touch',
    '',
    `- WhatsApp (fastest, ${ORG.hours}): ${waLink(VARIANTS.default.wa)}`,
    `- Scope a project in about a minute: ${ORG.url}/#scope`,
    `- Book a 20-minute call: ${ORG.booking}`,
    `- Email: ${ORG.email}`,
    '',
    '## Optional',
    '',
    `- [Privacy](${ORG.url}/privacy)`,
    `- [Terms](${ORG.url}/terms)`,
    '',
  ];
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};

// /llms.txt: what Despacho Bonsai sells, as one markdown file, built from src/data/offer.ts on every deploy so it
// never drifts from the homepage. Read by AI assistants and crawlers. No prices and no founder name, by design.
import type { APIRoute } from 'astro';
import { ORG, LOOP, MODES, STEPS, WORK, FAQ, VARIANTS, waLink } from '../data/offer';

export const GET: APIRoute = () => {
  const out = [
    `# ${ORG.name}`,
    '',
    `> ${ORG.oneLiner}`,
    '',
    `${ORG.name} is an ${ORG.descriptor} based in ${ORG.location}, serving ${ORG.serves}. A senior product manager runs the whole product loop inside the client's team; AI agents do the legwork (code, tests, drafts) and a human makes every decision and reviews every change. We speak as "we".`,
    '',
    '## The loop we run',
    '',
    ...LOOP.map(s => `${s.n.replace(/^0/, '')}. **${s.h}.** ${s.p}`),
    '',
    '## Two ways to work with us',
    '',
    ...MODES.map(m => `- **${m.h}:** ${m.p}`),
    '',
    '## How it starts',
    '',
    ...STEPS.map(s => `${s.n.replace(/^0/, '')}. **${s.h}.** ${s.p}`),
    '',
    '## Pricing',
    '',
    'A fixed price per milestone, or a monthly price for an ongoing embed, agreed on a call before work starts. There is no public price list.',
    '',
    '## Products we have run end to end',
    '',
    ...WORK.map(w => `- [${w.name}](${w.url}) (${w.kind}): ${w.p}`),
    '',
    '## Frequently asked questions',
    '',
    ...FAQ.flatMap(f => [`### ${f.q}`, '', f.a, '']),
    '## Get in touch',
    '',
    `- Book a 20-minute call: ${ORG.booking}`,
    `- Scope it in about a minute: ${ORG.url}/#scope`,
    `- WhatsApp (${ORG.hours}): ${waLink(VARIANTS.default.wa)}`,
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
